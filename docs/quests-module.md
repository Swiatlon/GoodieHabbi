# Quests module — decisions and rules

> Reference for the quest feature domain after the flexible-recurrence rebuild (2026-09-12).
> `ARCHITECTURE.md` §6 is the summary; this file holds the reasoning. The build plan that produced it is
> [`quests-module-plan.md`](./quests-module-plan.md) — **delete that once step 2 has shipped**, the way
> `FINANCE_MODULE_PLAN.md` and `workouts-module-plan.md` were handled.
>
> FE contract: [`quests-api-schema.ts`](./quests-api-schema.ts) + [`questy-nowy-model-frontend.md`](./questy-nowy-model-frontend.md).

---

## 1. The shape

Three things the old model kept in one enum and one boolean are now separate:

| Concept | Where it lives | What it decides |
|---|---|---|
| **Schedule** | `QuestSchedule` (owned VO → columns on `Quests`) | which calendar periods exist |
| **Target** | `QuestTarget` (owned VO → columns on `Quests`) | what counts as done inside one period |
| **Completion log** | `QuestCompletion` (table) | what the user actually did, one row per tap |

`QuestTypeEnum`, `Quest.IsCompleted`, `Quest.NextResetAt`, `QuestOccurrence.WasCompleted` and the
`WeeklyQuest_Day` / `MonthlyQuest_Days` / `SeasonalQuest_Season` satellite tables are all gone.

**The period is the unit of accountability.** Streaks, completion rate, rewards and goals are judged per
period, never per tap. This is the single decision the rest of the module falls out of — paying per tap
would make "drink 10 glasses of water" earn ten times a daily gym habit purely through the arithmetic of
its unit.

---

## 2. Rules that are load-bearing

### Completion is derived, not stored

`Quest.IsCompletedOn(today)` reads the period covering today. There is no flag and no reset job.
This deletes a whole class of bug: the old `ResetQuestsTask` was the only thing that cleared
`IsCompleted`, and both `Quest.Complete` and the completion handler returned early while it was set — so
a daily quest completed yesterday could not be completed today until the process restarted.

### Periods snapshot their target

`QuestOccurrence.TargetAmount` is copied from the quest when the period is created. Editing "twice a
week" to "three times a week" must not turn last month's successes into failures. Same template-versus-
record rule as `RecurringTransaction → FinanceTransaction` and `WorkoutRoutine → WorkoutSession`, and it
is also why periods stay materialized rather than being recomputed on read: the rows *are* the historical
record of what was asked of the user.

### Partial periods are clipped and prorated

When `StartDate`/`EndDate` cuts through a Week, Month or Year period, the period is clipped and its
target scaled by the active fraction, rounded up. Without it a "three times a week" quest created on a
Saturday opens its life with a guaranteed failure.

### `UNIQUE (QuestId, PeriodStart)` still governs everything

Inherited from the previous refactor and just as load-bearing. **Any code path that generates periods
must load every one of the quest's occurrences**, because de-duplication happens in memory; a partial
load emits a row that collides with the index. Read-only display paths may filter the include (they do,
to a two-day window) precisely because they never generate.

### Progress is denormalized, so the period carries a `RowVersion`

Two simultaneous taps on a `1/2` period would otherwise both read 1, both reach the target, and both pay
the reward.

### Rewards are granted once per period, ever

Recorded on the period (`RewardGrantedAt`, `XpAwarded`, `CoinsAwarded`). Undoing a completion never
reclaims them and re-completing never pays again. This closes the old exploit where `Coins += 10` ran
outside the rewards gate and `RevertQuestCompletion` never took them back, making complete/uncomplete an
unlimited coin farm.

### Off-schedule completions are legal

A tap on a day the quest was not due is recorded with `OccurrenceId = null`. It counts towards totals and
the weekday/hour analytics, belongs to no period, and earns nothing. Same argument as
`SupplementIntake.IsAdHoc`: a model that can only record planned activity punishes the deviation most
worth recording.

### The catch-up window is 2 days

`Quest.BackfillGraceDays`. A completion carries the local day it counts for, so backfilling works for
every schedule — daily included, which the old model could not do at all. Beyond the window it is
refused: rewriting old periods would make every streak and rate untrustworthy, and inventing history is
exactly the damage the previous quest migration had to repair.

### The client must be able to read the completion log, not just write it

`CurrentPeriodDto` carries the current period's `completions` (with ids), plus `todayProgress` and
`canCompleteToday`. This is not convenience: completion ids used to appear **only** in the `POST`
response, so undo worked until the app restarted and then silently stopped — a first-minute regression
against the old `PATCH { isCompleted: false }`, which needed nothing but the quest id. The same gap made
`maxCompletionsPerDay` unenforceable in the UI, because nothing said whether the recorded progress
happened today. Found by the FE review, not by our tests.

`canCompleteToday` is computed server-side on purpose: "today" depends on the profile timezone, which
only the server resolves, and a client-side flag does not survive a restart.

### Analytics tap counts come from the log, never from periods

`TotalCompletions` is passed into `QuestStatisticsCalculator.Calculate` and
`QuestAnalyticsCalculator.Summarize` by the caller. Counting `occurrence.Completions` undercounts
off-schedule taps (they belong to no period) and reads zero wherever the query did not include them —
which is most places. Both were live bugs found by running against real data.

### `isAtRisk` is false for single-day periods

"Not done yet" is the normal state of every habit before the user gets to it; flagging all of them says
nothing. The signal only means something when there were several days to spread the work over.

---

## 3. Time

Unchanged in principle from §6 of `ARCHITECTURE.md`, extended to the new rows:

| Value | Type | Why |
|---|---|---|
| `QuestOccurrence.PeriodStart` / `PeriodEnd` | `DateOnly` | a calendar fact; must not move when the user travels |
| `QuestCompletion.CompletedOn` | `DateOnly` | which day it counts for — and what makes backfilling expressible |
| `QuestCompletion.LocalTime` | `TimeOnly?` | **snapshotted** wall-clock time; deriving it later from the profile's current timezone would shift the hour of every tap made abroad |
| `QuestCompletion.CompletedAt` | UTC `DateTime` | the instant of the tap |
| `UserProfile.MaintainedThrough` | `DateOnly` | the maintenance watermark, compared against the user's own today |

`UserProfile.LocalDateOn` remains the single answer to "what day is it for this user"; it now delegates
to `LocalCalendar.LocalDateOn` so the maintenance pre-check can use it without loading a profile.

---

## 4. No scheduler, by design

⚠️ **The API runs on shared IIS with an app pool that shuts down after 15 idle minutes.** No timer can be
relied on to fire, so `BackgroundService`, Hangfire and Quartz are all unusable here.

The rebuild removes the need rather than working around it:

| Old job | Now |
|---|---|
| `ResetQuestsTask` | deleted — completion is derived |
| `ProcessOccurrencesTask` | on demand: the first completion materializes its period |
| `RecalculateRepeatableQuestStatisticsTask` | recalculated whenever a quest's periods change |
| `ExpireGoalsTask` | folded into the maintenance pass |

`IUserMaintenanceService` runs one idempotent pass per user per local day — materialize due periods,
refresh statistics, expire goals, recompute the "currently completed" counter — guarded by
`UserProfile.MaintainedThrough` and triggered from `GET /quests/active`, the call the app already makes on
open. A cheap watermark query short-circuits it the rest of the day.

This is a deliberate exception to "reads never write", and the hosting is the justification.
`RunMaintenanceTask` stays as a startup safety net, not as the mechanism. An external cron hitting a
maintenance endpoint is the cheapest way to get real scheduling when reminders (phase 2) need it.

---

## 5. Google Calendar (phase 3, not built)

Decided: **one-way export of quests as events; completion stays in the app.** Four things in the current
model keep it cheap:

1. The schedule is RRULE-compatible without being stored as RRULE — `Day + weekdays` →
   `FREQ=WEEKLY;BYDAY=…`, `Day + interval` → `FREQ=DAILY;INTERVAL=n`. "N times per week, any day" has no
   RRULE equivalent because it is a target, not an event; it exports as one all-day event per period.
2. Periods have a stable identity, `(QuestId, PeriodStart)`, which maps onto recurring-event instance ids.
3. `CompletionSource` and `ClientRequestId` make a future import idempotent against taps made in the app.
4. `DurationMinutes` exists so a timed event can be emitted.

If completing from the calendar is ever wanted, it means **Google Tasks** (events have no done state),
and the open question is how much recurrence the Tasks API exposes — needs a spike.

---

## 6. Migration (two steps, only the first applied)

Follows the `QuestCalendarPeriods` precedent. `QuestRecurrenceBackfill` is shared by both steps and
**every statement is idempotent and scoped to unmigrated rows**, which is what makes a phased deploy
safe: between step 1 and the new release the old API is still writing rows the old way, and step 2 sweeps
them up before dropping anything.

The scoping matters in both directions. A quest created by the *new* code takes the legacy `QuestType`
column's default, so an unguarded `UPDATE … WHERE QuestType = 'Daily'` would overwrite a correct Week
schedule with a Day one. Hence every update also requires the schedule to still be unset.

- **Step 1 (applied to production 2026-09-12):** additive columns, the `QuestCompletions` table, a default
  constraint on the legacy `QuestType` column so the old API can still insert, and the backfill.
- **Step 2 (written, deliberately NOT applied):** re-runs the backfill, then hard-fails if any quest still
  has no schedule, then drops `QuestType`, `IsCompleted`, `NextResetAt`, `WasCompleted` and the three
  satellite tables. Held back until the FE ships, because the legacy columns are the rollback path.

⚠️ `dotnet ef database update` with no target applies **everything pending**, including step 2. Always
name the target migration. And note `-- production` points at the live hosted database while
`-- Development` points at a local one.

**What the backfill does not recover:** `LocalTime` on migrated completions (the user's historical
timezone is unknowable, so `byHourOfDay` skips those rows), and seasonal periods before the current
season — deliberately, rather than inventing history.

---

## 7. Gaps and deferred work

- **Phase 2:** skip/excuse days plus a "streak freeze" consumable (the shop already has consumables and
  `ActiveUserEffect`), `AtMost` limit habits (the enum slot ships; the validator rejects it), named time
  slots with reminders, stretch-target bonus.
- **`legacyType` is a bridge with an expiry date.** The FE decided (2026-09-12) to cut over in one
  release rather than keep the old screen split, so `?legacyType=` and the `legacyQuestType` field
  **are to be deleted together with step 2 of the migration**. They are kept until then purely as slack
  in case the client migration runs long. Note the field is populated only on `GET /quests`, never on
  `/active`, `/{id}` or the goal endpoints — deliberately, since nothing is meant to build on it.
- **No weekly-streak badge.** Badges re-key to `Schedule.Unit`, which leaves Week without one.
  `CompleteDailySeven`/`CompleteDailyThirty` now mean Day-unit; `CompleteMonthlyTwelve` means Month-unit.
  A legacy Mon/Wed/Fri quest consequently feeds `CompletedDailyQuests`, which only Balanced Hero reads.
- **Goals** are achieved by the first period that reaches its target inside the goal window, not on the
  first tap. A deeper redesign ("N successful periods in the window") is deferred. Two details that were
  missing from the first documentation pass: eligibility never filtered by quest type and still does not
  (a goal's *type* is its own time window, not a requirement on the quest), and
  `PATCH /goals/{id}/completion` now ignores its body and simply records one completion — treat it as
  deprecated in favour of `POST /quests/{id}/completions`.

- ⚠️ **A recurring `Year` quest must not carry an `endDate`.** The year window *is* the recurrence, so an
  end date at the close of the first season kills the habit permanently — which is exactly what the old
  seasonal form used to set. Harmless in the current data (production has no seasonal quests at all), but
  a trap for the new client.
- **Tests** are pure domain tests plus EF InMemory. The `RowVersion` concurrency guard and the filtered
  unique index are **not** covered — InMemory ignores both (`ARCHITECTURE.md` §10). Relational tests
  (SQLite or Testcontainers) are the gap worth closing first.
