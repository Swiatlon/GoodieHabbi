# Questy — nowy model (harmonogram + cel). Instrukcja dla zespołu FE

Typy TypeScript: [`docs/quests-api-schema.ts`](./quests-api-schema.ts).
Poprzedni dokument — [`questy-analityka-frontend.md`](./questy-analityka-frontend.md) — opisuje zmianę
formatu dat i pierwszą wersję analityki. **Nadal obowiązuje w części o datach**; wszystko o typach questów
zastępuje ten plik.

**TL;DR**
1. 🔴 **Quest nie ma już typu.** Ma **harmonogram** (jakie są okresy) i **cel** (ile znaczy „zrobione”).
   Wszystkie endpointy per-typ zniknęły.
2. 🔴 `PATCH .../completion { isCompleted }` zastąpione przez `POST /quests/{id}/completions`.
   Można wołać wielokrotnie — stąd „umyć zęby 2x dziennie”.
3. 🟢 Da się wreszcie zrobić: **2x dziennie**, **min. 2x w tygodniu (dowolne dni)**, **co drugi dzień**,
   **2 litry wody**, sezonowy quest który **wraca co roku**.
4. 🟢 **Nadrabianie zaległości**: zapomniane odhaczenie można uzupełnić do 2 dni wstecz —
   `GET /quests/catch-up` daje gotową listę.
5. 🟡 `GET /quests?legacyType=Daily` odtwarza stary podział ekranów, ale po przeglądzie FE ustaliliśmy,
   że **nie budujemy na nim** — jedna lista z filtrami, a `legacyType` znika razem z krokiem 2 migracji.

---

## 1. Dlaczego to zmieniamy

Stary model trzymał trzy różne rzeczy w jednym enumie i jednym booleanie:

| Czego nie dało się wyrazić | Dlaczego |
|---|---|
| Umyć zęby 2x dziennie | Wystąpienie było booleanem — nie było licznika |
| Ćwiczyć min. 2x w tygodniu, dowolne dni | „Weekly” znaczyło „w te dni tygodnia”, a nie „tyle razy w tygodniu” |
| Co drugi dzień | Brak interwału |
| Wypić 2 litry | Brak jednostki i wartości |
| Sezonowy quest wracający co roku | Sezonowe nigdy się nie resetowały — po pierwszym ukończeniu zostawały zrobione na zawsze |

Teraz są to trzy osobne pojęcia:

- **Harmonogram (`schedule`)** — jakie okresy istnieją.
- **Cel (`target`)** — ile trzeba zrobić w jednym okresie.
- **Log odhaczeń (`completions`)** — co użytkownik faktycznie zrobił, jeden wiersz na tapnięcie.

**Okres jest jednostką rozliczenia.** Serie (streaki), skuteczność, nagrody i cele — wszystko liczy się
per okres.

---

## 2. Harmonogram i cel — jak to złożyć

`schedule.unit` to `None` | `Day` | `Week` | `Month` | `Year`.

| Nawyk | `schedule` | `target` |
|---|---|---|
| Codziennie *(stare Daily)* | `{ unit: 'Day' }` | — |
| Pon/śr/pt *(stare Weekly)* | `{ unit: 'Day', weekdays: ['Monday','Wednesday','Friday'] }` | — |
| **Umyć zęby 2x dziennie** | `{ unit: 'Day' }` | `{ amount: 2 }` |
| **Ćwiczyć min. 2x w tygodniu** | `{ unit: 'Week' }` | `{ amount: 2, maxCompletionsPerDay: 1 }` |
| **Co drugi dzień** | `{ unit: 'Day', interval: 2 }` | — |
| Rozliczenie 1–5 dnia *(stare Monthly)* | `{ unit: 'Month', monthWindowStartDay: 1, monthWindowEndDay: 5 }` | — |
| **Czytać w 20 dni miesiąca** | `{ unit: 'Month' }` | `{ amount: 20, maxCompletionsPerDay: 1 }` |
| **Wypić 2 litry wody** | `{ unit: 'Day' }` | `{ amount: 2, unit: 'L' }` |
| Zima *(stare Seasonal)* | `{ unit: 'Year', yearWindowStart: 1221, yearWindowEnd: 320 }` | — |
| Jednorazowy *(stare OneTime)* | `{ unit: 'None' }` | — |

Gotowe przepisy są w `SCHEDULE_RECIPES` na końcu pliku ze schematem.

### Dwie rzeczy, które zaskakują

**`maxCompletionsPerDay` jest ważne przy celach tygodniowych.** Bez niego „2x w tygodniu” można odhaczyć
dwa razy w poniedziałek i mieć tydzień z głowy. Z `1` drugie tapnięcie tego samego dnia zwróci **409**.
W UI opierajcie stan przycisku o **`currentPeriod.canCompleteToday`** — nie o lokalną flagę, która ginie
po restarcie aplikacji.

**Przekroczenie celu jest OK.** Trzeci trening w tygodniu przy celu 2 zapisze się normalnie
(`progress: 3`), ale nie da dodatkowej nagrody. To jest dokładnie przypadek „czasem 2, czasem 3 razy” —
UI może pokazać `3/2 ✓`.

---

## 3. Odhaczanie — nowy endpoint

```
POST /api/quests/{id}/completions
{
  "amount": 1,                      // opcjonalne, domyślnie 1 (dla celu mierzonego: litry, strony)
  "completedOn": "2026-09-11",      // opcjonalne, domyślnie dziś — TU nadrabiasz zaległości
  "clientRequestId": "uuid",        // ⚠️ WYSYŁAJCIE TO
  "note": "..."                     // opcjonalne
}
```

Odpowiedź zawiera **cały quest po zmianie** (`quest`), więc wiersz na liście odświeżacie z jednej
odpowiedzi, bez dodatkowego GET-a.

### ⚠️ `clientRequestId` — proszę to wysyłać

Generujcie **stabilny UUID na jedną akcję użytkownika** (nie na request — na akcję; przy retry ten sam).
Bez tego powtórzony request zapisze drugie odhaczenie. Przy starym modelu było to nieszkodliwe
(boolean i tak był `true`), teraz przy celu 2 **po cichu kończy dzień**.

Odpowiedź z `wasAlreadyRecorded: true` oznacza „to już było zapisane, nic nie zrobiłem” — traktujcie jak sukces.

### Cofanie

```
DELETE /api/quests/{id}/completions/{completionId}
```

`completionId` bierzecie z **`currentPeriod.completions`** (dodane po przeglądzie FE — wcześniej id było
tylko w odpowiedzi na `POST`, więc cofanie przestawało działać po restarcie aplikacji):

```ts
currentPeriod: {
  // …
  todayProgress: number,        // ile z `progress` pochodzi z dzisiejszego dnia lokalnego
  canCompleteToday: boolean,    // false gdy dzienny limit wyczerpany → zablokujcie przycisk
  completions: { id, completedOn, amount }[]   // rosnąco, do cofania i do historii
}
```

`canCompleteToday` jest liczone po stronie BE, więc **nie musicie odtwarzać reguły `maxCompletionsPerDay`
ani zgadywać, który dzień jest „dzisiaj” u użytkownika** — i przeżywa restart aplikacji, czego lokalna
flaga nie robi.

Postęp spada, a jeśli okres przestaje spełniać cel — `isCompleted` wraca na `false`.
**Nagroda raz przyznana nie jest odbierana i nie zostanie przyznana drugi raz.** Nie ma sensu chować
przycisku cofania „żeby nie kombinowali” — nie da się na tym nic ugrać.

---

## 4. 🆕 Nadrabianie zaległości (catch-up)

To odpowiedź na „zrobiłem, ale zapomniałem odhaczyć”. W starym modelu było to praktycznie niewykonalne;
teraz odhaczenie niesie własną datę, więc **działa też dla questów dziennych**.

**Okno: 2 dni wstecz** (dziś, wczoraj, przedwczoraj). Poza tym oknem → `400`.

```
GET /api/quests/catch-up
→ { "graceDays": 2,
    "days": [ { "date": "2026-09-10",
                "quests": [ { "questId": 12, "title": "Medytacja", "progress": 0, "target": 1,
                              "outcome": "Missed" } ] } ] }
```

Lista zawiera **wyłącznie okresy, w których tapnięcie jeszcze coś zmieni** (minione, w oknie, Missed lub
Partial). Ukończone nigdy się nie pojawią, więc **puste `days` = nie ma o co pytać → nie pokazujcie karty.**

**Proponowany UX:** po otwarciu aplikacji jedna karta „Masz 3 nieodhaczone nawyki z ostatnich 2 dni”,
rozwijana w checklistę pogrupowaną po dniach. Odhaczenie woła **zwykły** endpoint completions
z `completedOn` ustawionym na ten dzień. Stan zamknięcia karty trzymajcie po stronie klienta.

Uzupełniony okres dostaje `isBackfilled: true` — jeśli chcecie, oznaczcie to subtelnie w kalendarzu.
Liczy się normalnie: seria się odbudowuje, nagroda jest przyznawana.

---

## 5. Odczyt questa

`isCompleted` jest **wyliczane** z okresu, w którym użytkownik jest teraz. Nie ma już flagi w bazie.

```ts
currentPeriod: {
  start, end,           // granice okresu, włącznie
  progress, target,     // "1 / 2"
  remaining,
  outcome,              // Completed | Missed | Pending | Partial | Skipped
  remainingDays,        // ile dni zostało, z dzisiejszym
  isAtRisk              // patrz niżej
}
```

- **`currentPeriod === null`** → quest dziś nie jest zaplanowany. Pusty stan, **nie** czerwony.
- **`isAtRisk`** → zostało tyle do zrobienia, że potrzeba każdego pozostałego dnia. Dla okresów
  jednodniowych **zawsze `false`** (tam „jeszcze nie zrobione” nic nie znaczy). Używajcie do podpowiedzi
  typu „jeszcze 2 treningi, zostały 2 dni”.
- `currentPeriod` przychodzi też zanim backend zmaterializuje okres, więc pierwszego dnia nowego nawyku
  pokażecie `0 / 2` bez żadnego triku.

### Nowy wynik okresu: `Partial`

Okres minął z jakimś postępem, ale poniżej celu (`1/2`). **Liczy się jak porażka** w każdej stopie
i serii — jest osobno tylko po to, żebyście mogli narysować częściowy postęp zamiast czerwonego pola.

---

## 6. Migracja istniejących ekranów

Macie 7 ekranów. 5 mapuje się wprost, jeden się rozjeżdża.

| Ekran | Wywołanie |
|---|---|
| Today Quests | `GET /quests/active` — **bez zmian** |
| Daily Quests | `GET /quests?legacyType=Daily` |
| Weekly Quests | `GET /quests?legacyType=Weekly` |
| Monthly Quests | `GET /quests?legacyType=Monthly` |
| One Time Quests | `GET /quests?legacyType=OneTime` |
| Seasonal Quests | `GET /quests?legacyType=Seasonal` |
| All Quests | `GET /quests` |

**Dlaczego `legacyType`, a nie `unit`:** stary quest „Weekly pon/śr/pt” to teraz harmonogram **dzienny
z filtrem dni**. Filtrując po `unit=Day` wylądowałby na ekranie Daily. `legacyType=Weekly` skleja obie
połówki z powrotem, więc grupowanie zostaje takie, jakiego użytkownicy się spodziewają.

`legacyType` jest **przejściowe**. Warto rozważyć, czy podział Daily/Weekly/Monthly nadal ma sens, skoro
„2x w tygodniu” i „co drugi dzień” się w nim nie mieszczą — ale to decyzja produktowa, nie termin.
Dajcie znać, czy sam `legacyType` wam wystarcza, czy potrzebujecie pełnego shimu ze starymi trasami.

---

## 7. Analityka — co się zmieniło

Endpointy bez zmian (`/quests/{id}/analytics`, `/quests/analytics/overview`), doszły pola.

**Nowe i przydatne:**

- **`streakUnit`** (`Day` | `Week` | …) — seria „5” przy nawyku tygodniowym to **5 tygodni**.
  Widget „🔥 5” bez tego kłamie.
- **`progressRate`** — kredyt częściowy. Przy myciu zębów: `completionRate` mówi „w ilu dniach umyłem
  oba razy”, `progressRate` mówi „ile ze wszystkich myć zrobiłem”.
- **`byHourOfDay`** — o której faktycznie robicie dany nawyk. To jest ta analityka, którą dałyby dwa
  osobne questy „rano / wieczorem” — tylko że przy jednym queście z celem 2.
- **`totalCompletions`** — liczba tapnięć (nie ukończonych okresów).
- **`partialPeriods`** / `partialCount`.

**Zmiany wymagające uwagi:**

- 🔴 **`byWeekday` zmieniło kształt.** Nie ma już `completionRate`; są `completions`, `daysWithActivity`
  oraz mianowniki `daysInRange` (ile razy ten dzień tygodnia wypadł w oknie) i `daysScheduled` (ile z tego
  quest był zaplanowany; `null` dla harmonogramów Week/Month/Year, które nie przypinają dni tygodnia).
  Wiersz pojawia się dla każdego dnia, który był **zrobiony albo zaplanowany**, więc dzień regularnie
  pomijany widać jako zero przy niezerowym mianowniku.
  Liczone z logu odhaczeń, nie z okresów — dzięki temu działa też dla „3x w tygodniu”, gdzie okresem jest
  tydzień, ale robi się to w konkretne dni. **Dla questów miesięcznych nie jest już puste.**
- 🔴 **`dailyCompletionRate` w overview** liczy teraz **tylko questy dzienne**. Wcześniej okres
  wielodniowy był rozsmarowany na każdy swój dzień, więc jeden nieudany cel tygodniowy malował
  7 dni na czerwono. Okresy tygodniowe/miesięczne/roczne są osobno w **`periodic`**.

**Bez zmian (ale łatwo o pomyłkę):** `completionRate === null` to **„brak danych”**, nie 0%.
Do widgetów ze streakiem używajcie `lifetime`, nie `range`.

---

## 8. Nagrody — zmiana zasady

**Nagroda jest za ukończony okres, nie za tapnięcie.** Inaczej „wypić 10 szklanek wody” zarabiałoby
dziesięciokrotnie więcej niż codzienna siłownia, tylko dlatego że cel jest liczony w mniejszych jednostkach.

- Pierwsze tapnięcie przy celu 2 → `xpAwarded: 0`. Dopiero drugie (domykające) płaci.
- Dłuższy okres jest wart więcej (dzień 1×, tydzień 3×, miesiąc 8×, rok 20×).
- **Raz na okres, na zawsze.** Cofnięcie i ponowne odhaczenie nie płaci drugi raz.
- Odhaczenie w dniu, w którym quest nie był zaplanowany, zapisuje się, ale nie płaci.

`periodCompleted: true` w odpowiedzi to dobry moment na animację/celebrację.

---

## 8a. Cele (goals) — czego brakowało w pierwszej wersji

Trzy rzeczy, o których pierwsza wersja dokumentu milczała:

- **`GET /goals/active/{goalType}` zwraca `QuestDetailsDto` w nowym kształcie** — bez `season`,
  `weekdays`, `type`, `startDay`/`endDay`. Zamiast nich `schedule`.
- **Kwalifikacja do celu się nie zmieniła co do zasady.** `/quests/eligible-for-goal` nigdy nie filtrowało
  po typie questa i nadal nie filtruje — **typ celu wyznacza okno czasowe celu, a nie wymaganie wobec
  questa**, więc dowolny quest może stać za celem Daily/Weekly/Monthly/Yearly. Jedyna zmiana: quest
  powtarzalny pozostaje kwalifikowany, nawet jeśli jest dziś zrobiony (wróci), a „zużyty” jest tylko
  jednorazowy, który kiedykolwiek został ukończony.
- **Zaliczenie celu:** cel zalicza **pierwszy okres, który osiągnie swój target w oknie celu** — nie raz
  na tydzień i nie przy pierwszym tapnięciu.
- ⚠️ **`PATCH /goals/{id}/completion` istnieje, ale ignoruje body** i po prostu zapisuje jedno odhaczenie;
  nie ma tam ścieżki cofania. Traktujcie jako deprecated i wołajcie wprost
  `POST /quests/{id}/completions` — cel zaliczy się przy okazji.

## 8b. Sezonowe: ⚠️ nie ustawiajcie `endDate`

Okno roczne (`yearWindowStart`/`yearWindowEnd`) **jest** powtarzalnością. Jeśli formularz ustawi
`endDate` na koniec sezonu — tak jak robił stary UI — quest zimowy wygaśnie po pierwszym sezonie i
**nigdy nie wróci**, mimo że model to umożliwia. `endDate` zostawiajcie puste, chyba że użytkownik
naprawdę chce, żeby nawyk się skończył.

Granice sezonów po stronie BE są dokładnie takie, jak w Waszej tabeli
(1221/320, 321/620, 621/922, 923/1220) — migracja użyła tych samych stałych.

## 9. Checklista wdrożeniowa

- [ ] Zmienić trasy: create/update/get/delete bez segmentu typu (patrz nagłówek pliku `.ts`).
- [ ] `PATCH .../completion` → `POST /quests/{id}/completions`.
- [ ] **Wysyłać `clientRequestId`** przy każdym odhaczeniu.
- [ ] Renderować `currentPeriod.progress / target` zamiast checkboxa tam, gdzie cel > 1.
- [ ] Blokować przycisk po osiągnięciu `maxCompletionsPerDay` (albo obsłużyć 409).
- [ ] `currentPeriod === null` → „niezaplanowane”, nie „nieudane”.
- [ ] Dodać kartę catch-up (`GET /quests/catch-up`), ukrytą gdy `days` puste.
- [ ] Zastąpić pięć list per-typ **jedną** listą z `GET /quests` i filtrami po stronie klienta
      (ustalenie z przeglądu FE — `?legacyType=` celowo nie używamy).
- [ ] Poprawić `byWeekday` (zmiana kształtu) i rozdzielić `dailyCompletionRate` / `periodic`.
- [ ] Pokazywać `streakUnit` przy serii.
- [ ] `Partial` jako częściowy postęp, nie jako sukces.
- [ ] Dalej wysyłać `x-time-zone` przy logowaniu i odświeżaniu tokenu.
- [ ] Cofanie oprzeć o `currentPeriod.completions[].id`, a blokadę przycisku o `canCompleteToday`.
- [ ] Nie ustawiać `endDate` przy questach sezonowych (§8b).
- [ ] Cele: przestać czytać `season`/`weekdays`/`type` z `IUserGoal` (§8a).

## 10. Ustalenia (po przeglądzie FE, 12.09.2026)

Pięć pytań z pierwszej wersji ma odpowiedzi i wszystkie zostały przyjęte:

1. **Most `?legacyType=`** — nieużywany. Pełnego shimu nie budujemy; parametr i pole `legacyQuestType`
   znikają razem z krokiem 2 migracji.
2. **Przy celu > 1** — „+1” jako główna akcja, „−” jako korekta w szczegółach; przy `target.unit != null`
   stepper z presetami. Cofanie stoi na `currentPeriod.completions[].id`.
3. **`isBackfilled`** — oznaczane subtelnie (kropka/obwódka), nie osobnym kolorem.
4. **Okno nadrabiania** — 2 dni, bez zmian.
5. **Podział ekranów** — odcinamy się od typów. Docelowo **Dziś · Nawyki · Statystyki · Etykiety**,
   z chipami filtrów na jednej liście z jednego `GET /quests`.

Uwaga do filtra „zagrożone”: `isAtRisk` jest z założenia `false` dla harmonogramów dziennych, więc ten
filtr pokaże wyłącznie nawyki tygodniowe i miesięczne.

### Zmiany po przeglądzie

- `currentPeriod.completions[]`, `todayProgress`, `canCompleteToday` (FE-1, FE-2).
- `byWeekday` z mianownikami `daysInRange` / `daysScheduled` (FE-7).
- `GET /quests/catch-up?includeCompleted=true` — zwraca też okresy już odhaczone w oknie, żeby dało się
  cofnąć tapnięcie z karty nadrabiania po restarcie aplikacji (FE-11).
- `canCompleteToday` jest `false` dla ukończonego questa **jednorazowego** — przekraczanie celu ma sens
  przy nawyku, nie przy czymś, co dzieje się raz (FE-12). Po Waszej stronie nic nie trzeba pilnować.
- **Cofnięcie odhaczenia nie cofa zaliczonego celu** — zamierzone, tak samo jak z nagrodami (FE-4).
