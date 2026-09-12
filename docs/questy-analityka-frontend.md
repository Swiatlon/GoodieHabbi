# Questy — nowa analityka i zmiana formatu dat (instrukcja dla zespołu FE)

> ⚠️ **CZĘŚCIOWO NIEAKTUALNE (2026-09-12).** Sekcje o formacie dat (§2) i o modelu okresów (§3) nadal
> obowiązują. Wszystko o **typach questów** (Daily/Weekly/Monthly/Seasonal/OneTime) i o endpointach
> per-typ zostało zastąpione przez [`questy-nowy-model-frontend.md`](./questy-nowy-model-frontend.md) —
> quest ma teraz harmonogram i cel, a nie typ. Kształt `byWeekday` też się zmienił.
> Ten plik zostaje jako zapis poprzedniej migracji dat.

Dokument opisuje zmiany w module questów po refaktorze wystąpień (`QuestOccurrence`) oraz nowe
endpointy analityczne. Typy TypeScript: [`docs/quests-api-schema.ts`](./quests-api-schema.ts).
Pełny kontrakt: `docs/swagger.json`.

**TL;DR**
1. 🔴 **Breaking:** `startDate` / `endDate` w questach to teraz daty kalendarzowe `"2026-08-01"`,
   a nie znaczniki czasu. Dotyczy zarówno requestów, jak i odpowiedzi.
2. 🟢 Doszły dwa endpointy analityczne: dla pojedynczego questa i zbiorczy dla wszystkich nawyków.
3. 🟡 Zmieniła się semantyka liczenia „skuteczności” — bieżący, nieukończony jeszcze okres nie liczy
   się już jako porażka.

---

## 1. Dlaczego to zmieniamy

Wystąpienie questa (`QuestOccurrence`) przechowywało dotąd **znaczniki czasu UTC** wyliczone ze strefy
czasowej użytkownika w momencie generowania. Strefa jest jednak zmienna — backend aktualizuje ją przy
**każdym odświeżeniu tokenu** (nagłówek `x-time-zone`). W efekcie, gdy użytkownik zmienił strefę
(podróż), ten sam dzień lokalny mógł dostać **drugie wystąpienie** (podróż na zachód) albo **zostać
pominięty** (podróż na wschód). Psuło to liczniki, serie (streaki) i uniemożliwiało poprawne
narysowanie kalendarza — bo zakresu UTC nie da się jednoznacznie przypisać do komórki kalendarza bez
wiedzy, w jakiej strefie powstał.

Po refaktorze wystąpienie jest **okresem kalendarzowym** (`periodStart` / `periodEnd` jako `DateOnly`),
a unikalność `(quest, periodStart)` gwarantuje baza danych. Data jest faktem o kalendarzu użytkownika
i nie przesuwa się przy zmianie strefy.

---

## 2. 🔴 Breaking change: format dat w questach

| Pole | Przed | Po |
|---|---|---|
| `startDate` (request i response) | `"2026-08-01T00:00:00.000Z"` | `"2026-08-01"` |
| `endDate` (request i response) | `"2026-08-01T00:00:00.000Z"` | `"2026-08-01"` |
| `lastCompletedAt` | `"...Z"` | **bez zmian** (`"...Z"`) |
| `scheduledTime` | `"HH:mm:ss"` | **bez zmian** |

Dotyczy endpointów: `POST/PUT /api/quests/{one-time,daily,weekly,monthly,seasonal}` oraz każdej
odpowiedzi zawierającej `QuestDetailsDto` (`/active`, `/{questType}`, `/{questType}/{id}`,
`/eligible-for-goal`).

### Co trzeba zrobić po stronie FE

**Wysyłanie.** Backend parsuje te pola jako `DateOnly` — akceptuje **wyłącznie** `"YYYY-MM-DD"`.
Wysłanie pełnego timestampu skończy się `400 Bad Request`. Datę należy formatować z **lokalnego**
czasu urządzenia, nie z UTC:

```ts
// ✅ dobrze — lokalny dzień, który użytkownik widzi w pickerze
const toIsoDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

// ❌ źle — dla stref na wschód od UTC potrafi cofnąć o dzień
const wrong = d.toISOString().slice(0, 10);
```

`date-fns`: `format(d, 'yyyy-MM-dd')`. `dayjs`: `dayjs(d).format('YYYY-MM-DD')`. Oba operują lokalnie.

**Odbieranie.** `new Date("2026-08-01")` parsuje ciąg jako **północ UTC**, więc w strefach ujemnych
wyświetli się 31 lipca. Bezpieczniej trzymać te pola jako string i formatować bezpośrednio, albo
parsować jawnie jako datę lokalną:

```ts
const parseIsoDate = (s: string) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d); // lokalna północ
};
```

**Walidacja** (bez zmian merytorycznych, ale komunikaty dotyczą teraz dat): `endDate >= startDate`,
a przy tworzeniu obie daty muszą być `>= wczoraj` (liczone w UTC, z jednodniowym zapasem na różnicę
stref).

### Uwaga migracyjna

Istniejące `startDate` / `endDate` zostały przekonwertowane przez obcięcie części czasowej ze
znacznika UTC. Jeżeli aplikacja wysyłała dotąd lokalną północ z offsetem (np. `2026-08-01T00:00:00+02:00`,
co backend zapisywał jako `2026-07-31T22:00:00Z`), to **część questów może mieć daty cofnięte o jeden
dzień**. Warto przejrzeć to na swoich danych testowych i dać znać — poprawka po stronie bazy to jeden
`UPDATE`. Daty wystąpień (kalendarz, statystyki) **nie są** tym dotknięte — tam konwersja była
jednoznaczna i uwzględniała strefę użytkownika.

---

## 3. Model pojęciowy: okresy i ich wynik

Każdy powtarzalny quest (Daily / Weekly / Monthly) ma listę **okresów**. Okres ma
`periodStart` i `periodEnd` — obie **włącznie**:

| Typ questa | Okres |
|---|---|
| `Daily` | jeden dzień (`periodStart === periodEnd`) |
| `Weekly` | jeden dzień — każdy zaplanowany dzień tygodnia to osobny okres |
| `Monthly` | zakres dni w miesiącu, np. `2026-08-05` … `2026-08-10` |

Każdy okres ma wynik (`outcome`):

- **`Completed`** — użytkownik odhaczył questa w tym okresie.
- **`Missed`** — okres minął w całości bez ukończenia.
- **`Pending`** — okres trwa lub jest w przyszłości. **To nie jest jeszcze porażka.**

`isBackfilled: true` oznacza, że ukończenie zostało zapisane już po zakończeniu okresu (dopuszczamy
jeden dzień zapasu — np. odhaczenie porannego nawyku następnego ranka). Do wykorzystania, jeśli
chcecie to oznaczyć w UI; można też ignorować.

### Jak liczymy skuteczność

```
evaluatedPeriods = completedPeriods + missedPeriods      // bez Pending
completionRate   = completedPeriods / evaluatedPeriods   // null gdy evaluatedPeriods === 0
```

Dzięki temu procent **nie spada w ciągu dnia** tylko dlatego, że dzisiejszy nawyk nie jest jeszcze
odhaczony. `completionRate` to liczba `0..1` (nie procent) zaokrąglona do 4 miejsc — mnożcie przez 100
przy wyświetlaniu.

⚠️ `completionRate === null` znaczy **„brak danych”**, a nie 0%. Trzeba to rozróżnić w UI, inaczej nowy
quest pokaże się jako „0% skuteczności”.

Wszystkie daty w analityce są liczone w **strefie czasowej użytkownika** zapisanej w profilu. Zadbajcie
o wysyłanie aktualnego `x-time-zone` (IANA, np. `Europe/Warsaw`) przy logowaniu i odświeżaniu tokenu —
to on decyduje, który dzień backend uzna za „dzisiaj”.

---

## 4. 🟢 Nowy endpoint: analityka pojedynczego questa

```
GET /api/quests/{questId}/analytics?from=2026-05-01&to=2026-08-01&granularity=Week
```

| Parametr | Wymagany | Domyślnie | Uwagi |
|---|---|---|---|
| `questId` (path) | tak | — | tylko quest powtarzalny; dla `OneTime`/`Seasonal` → `400` |
| `from` | nie | `to` − 90 dni | `"YYYY-MM-DD"`, włącznie |
| `to` | nie | dzisiaj (lokalnie u użytkownika) | `"YYYY-MM-DD"`, włącznie |
| `granularity` | nie | `Week` | `Day` \| `Week` \| `Month` — dotyczy tylko `trend` |

Maksymalny zakres: **1830 dni**. Nie swój quest → `404`.

Odpowiedź (`GetQuestAnalyticsResponse`) zawiera:

- **`from` / `to`** — faktycznie użyty zakres. Warto go czytać, jeśli nie podaliście własnego —
  to jedyny sposób, żeby FE poznał „dzisiaj” użytkownika bez zgadywania strefy.
- **`range`** — `QuestAnalyticsSummary` dla wybranego okna.
- **`lifetime`** — statystyki „od zawsze” (z cache'owanego wiersza statystyk).
- **`calendar`** — lista okresów do kalendarza/heatmapy.
- **`trend`** — seria czasowa wg `granularity`.
- **`byWeekday`** — rozbicie na dni tygodnia.

### `range` vs `lifetime` — nie mieszać

To **dwie różne liczby** i celowo są rozdzielone:

- `range.currentStreak` — seria liczona **wewnątrz okna** `from..to`. Przydatna do „jak Ci szło w
  sierpniu”.
- `lifetime.currentStreak` — prawdziwa, aktualna seria użytkownika. **To jej używajcie w widgetach
  typu „🔥 12 dni z rzędu”.**

To samo dotyczy `completionRate`. Klasyczny błąd: pokazanie streaka z `range` na ekranie głównym —
przy domyślnym oknie 90 dni długa seria zostanie ucięta.

### Kalendarz / heatmapa

`calendar` to gotowe komórki — `periodStart` mapuje się 1:1 na dzień kalendarza, bez żadnych
przeliczeń stref:

```ts
const byDay = new Map(res.calendar.map(c => [c.periodStart, c.outcome]));
const color = (day: string) => {
  switch (byDay.get(day)) {
    case 'Completed': return colors.success;
    case 'Missed':    return colors.danger;
    case 'Pending':   return colors.neutral;
    default:          return 'transparent'; // brak okresu = quest nie był tego dnia zaplanowany
  }
};
```

**Ważne:** brak wpisu dla danego dnia ≠ porażka. Dla questa `Weekly` (pon./śr.) dni bez wpisu to po
prostu dni, w których nawyk nie był zaplanowany — powinny być puste, nie czerwone.

Dla questów `Monthly` jedna komórka rozciąga się na `periodStart..periodEnd` — trzeba ją narysować
jako pasek na kilku dniach albo pokazać w widoku miesięcznym jako jeden wiersz.

### Trend

Kubełki z `granularity`. `bucketStart` dla `Week` to zawsze **poniedziałek** (ISO), `bucketEnd` jest
włącznie. **Kubełki bez zaplanowanych okresów są pomijane** — brak kubełka znaczy „nic nie było
zaplanowane”, a nie „wszystko przepadło”. Jeśli wykres wymaga ciągłej osi X, uzupełnijcie luki po
stronie FE (najlepiej jako przerwa w linii, nie jako 0%).

### `byWeekday`

Odpowiada na pytanie „w które dni najczęściej mi to ucieka”. Zawiera tylko dni, w których questa
zaplanowano. **Dla questów `Monthly` tablica jest pusta** — rozbicie na dni tygodnia nie ma sensu przy
okresach wielodniowych. Ukryjcie sekcję, gdy tablica jest pusta.

---

## 5. 🟢 Nowy endpoint: przegląd wszystkich nawyków

```
GET /api/quests/analytics/overview?from=2026-07-01&to=2026-08-01
```

`from` / `to` opcjonalne, domyślne okno to **30 dni**, maksymalne **732 dni**.

Odpowiedź (`GetHabitsOverviewResponse`):

- **`overall`** — jedno `QuestAnalyticsSummary` dla wszystkich okresów wszystkich powtarzalnych
  questów razem. Dobre na kafelek „skuteczność w tym miesiącu”.
- **`quests`** — po jednym podsumowaniu na quest, **posortowane malejąco po `completionRate`**
  (potem po tytule). Pierwsze pozycje to najlepiej trzymane nawyki, ostatnie — te wymagające uwagi.
  Uwaga: questy z `completionRate === null` lądują na końcu.
- **`dailyCompletionRate`** — seria „ile procent nawyków zrobiono danego dnia”, po jednym punkcie na
  dzień kalendarzowy. Okresy wielodniowe (Monthly) liczą się do **każdego** dnia swojego zakresu.
  Dni bez żadnego zaplanowanego nawyku są pominięte.

To jest materiał na ekran „Statystyki” / dashboard: `overall` jako nagłówek, `dailyCompletionRate`
jako wykres lub heatmapa, `quests` jako lista rankingowa.

---

## 6. Checklist wdrożeniowy

- [ ] Zmienić typ `startDate` / `endDate` na `string` w formacie `"YYYY-MM-DD"` w modelach questów.
- [ ] Poprawić formatowanie przy wysyłce — **lokalnie**, nie przez `toISOString()`.
- [ ] Poprawić parsowanie przy odbiorze — nie przez `new Date(string)` bez korekty.
- [ ] Sprawdzić, czy istniejące questy nie mają dat cofniętych o dzień (patrz §2, uwaga migracyjna).
- [ ] Wysyłać aktualny `x-time-zone` (IANA) przy logowaniu i odświeżaniu tokenu.
- [ ] Rozróżnić w UI `completionRate === null` („brak danych”) od `0` („0%”).
- [ ] Nie renderować `Pending` jako porażki.
- [ ] Do widgetów ze streakiem używać `lifetime`, nie `range`.
- [ ] W kalendarzu: brak wpisu = dzień niezaplanowany (pusty), nie czerwony.
- [ ] W trendzie: brakujący kubełek = przerwa, nie 0%.

## 7. Pytania otwarte do ustalenia

1. Czy chcecie oznaczać w UI ukończenia z `isBackfilled: true` (np. innym odcieniem)? Backend to
   udostępnia, decyzja jest po Waszej stronie.
2. Czy przydałby się endpoint zwracający analitykę dla **wybranej listy** questów (teraz jest albo
   jeden, albo wszystkie)? Da się dodać, jeśli ekran tego wymaga.
3. Czy domyślne okna (90 dni / 30 dni) pasują do projektowanych ekranów, czy dopasować?
