# Odpowiedź BE na przegląd kontraktu questów (FE-1 … FE-13)

Data: 12.09.2026 · Dotyczy: „Przegląd kontraktu questów”, wersja 1 i 2, FE (Swida)

> **Runda 2 (12.09.2026):** FE-11, FE-12 i FE-13 — **wszystkie trzy zrobione**, mimo że żadna nie
> blokowała. Szczegóły na końcu dokumentu. Kontrakt i swagger zaktualizowane.

**Skrót:** oba blokery były realnymi dziurami w projekcie API, nie nieporozumieniem — **naprawione i
zweryfikowane na żywym API**. FE-7 zrobione. Reszta to odpowiedzi i uzupełnienia dokumentacji.
Rekomendację z sekcji 4 (odcięcie od `questType`) przyjmujemy w całości.

Kontrakt: [`quests-api-schema.ts`](./quests-api-schema.ts) · [`questy-nowy-model-frontend.md`](./questy-nowy-model-frontend.md) · `swagger.json` — wszystkie zaktualizowane.

---

## Blokery

### FE-1 — brak odczytu odhaczeń ✅ ZROBIONE

Mieliście rację i to jest błąd po naszej stronie: **log odhaczeń był z perspektywy klienta tylko do
zapisu.** `completionId` pojawiał się wyłącznie w odpowiedzi na `POST`, więc cofanie działało do
pierwszego restartu aplikacji i potem po cichu przestawało. Nasz własny smoke test miał w środku linijkę
„*13. Undo a completion — skipped: needs a completion id listing endpoint*”: dziura była zapisana i
nierozpoznana jako dziura.

Dodane dokładnie tak, jak proponowaliście — w `CurrentPeriodDto`:

```ts
completions: { id: number; completedOn: IsoDate; amount: number }[];   // rosnąco
```

Zweryfikowane na żywo: świeży `GET /quests/{id}` (bez odpowiedzi POST w ręku) zwraca id, a `DELETE`
z tym id cofa odhaczenie i zbija `progress`.

Wersji z `DELETE ?completedOn=` **nie** robiliśmy — „skasuj ostatnie z danego dnia” robi się dwuznaczne,
gdy `amount` się różnią.

### FE-2 — `maxCompletionsPerDay` nieegzekwowalne ✅ ZROBIONE

Ta sama dziura z drugiej strony, i zgadzamy się co do wagi: to jest flagowy scenariusz całego refaktoru,
więc nie może mieć najgorszego feedbacku. Dodaliśmy **dwa** pola zamiast jednego:

```ts
todayProgress: number;      // ile z `progress` pochodzi z dzisiejszego dnia lokalnego
canCompleteToday: boolean;  // false gdy dzienny limit wyczerpany
```

`canCompleteToday` liczymy po stronie BE celowo: dzięki temu **nie odtwarzacie reguły limitu ani nie
zgadujecie, który dzień jest „dzisiaj”** u użytkownika (to zależy od strefy w profilu, którą rozstrzyga
tylko serwer) — i odpowiedź przeżywa restart aplikacji, czego lokalna flaga nie robi.

Zweryfikowane: po jednym tapnięciu przy `maxCompletionsPerDay: 1` świeży GET zwraca
`todayProgress: 1.0`, `canCompleteToday: false`; po cofnięciu wraca `true`.

---

## Rozjazdy i pytania

### FE-3 — `legacyQuestType` tylko na liście ✅ ZAMKNIĘTE PRZEZ SEKCJĘ 4

Potwierdzamy: pola nie ma na `/active`, `/{id}`, `/eligible-for-goal` ani w celach. Skoro odcinamy się od
`questType` (sekcja 4), **nie rozszerzamy go** — zostaje tam, gdzie jest, do czasu kroku 2 migracji,
a potem `legacyQuestType` i `?legacyType=` znikają razem. Gdybyście jednak w trakcie migracji potrzebowali
mostu szerzej, powiedzcie — to pięć linijek.

### FE-4 — cele ✅ UZUPEŁNIONE W DOKUMENTACJI

Nasze przeoczenie: zmieniliśmy kontrakt celów i nie opisaliśmy tego nigdzie. Odpowiedzi na trzy pytania:

**Co znaczy „quest kwalifikujący się” do celu weekly/yearly?** Nic się nie zmieniło co do zasady —
`/quests/eligible-for-goal` **nigdy** nie filtrowało po typie questa. **Typ celu wyznacza okno czasowe
celu, a nie wymaganie wobec questa**, więc dowolny quest może stać za celem Daily/Weekly/Monthly/Yearly.
Jedyna zmiana: quest powtarzalny zostaje kwalifikowany, nawet jeśli jest dziś zrobiony (bo wróci);
„zużyty” jest tylko jednorazowy, który kiedykolwiek został ukończony.

**`PATCH /goals/{id}/completion` — celowo czy przeoczenie?** Pół na pół. Trasa działa, ale **ignoruje
body** i po prostu zapisuje jedno odhaczenie na queście; nie ma tam już ścieżki cofania. Traktujcie ją
jako deprecated i wołajcie wprost `POST /quests/{id}/completions` — cel zaliczy się jako konsekwencja.
Trasę zostawiamy, żeby nic Wam nie padło w trakcie migracji.

**Raz na tydzień czy przy pierwszym domknięciu okresu?** Przy **pierwszym** okresie, który osiągnie swój
target w oknie celu.

Uwaga praktyczna: `GET /goals/active/{goalType}` zwraca `QuestDetailsDto` w nowym kształcie, więc
`IUserGoal` z `season`/`weekdays`/`type`/`startDay`/`endDay` trzeba przepisać na `schedule`.

### FE-5 — sezony ✅ POTWIERDZONE + jedno ostrzeżenie

**(a) Granice.** Wasza tabela zgadza się co do dnia z tym, czego użyła migracja:

| Sezon | `yearWindowStart` | `yearWindowEnd` |
|---|---|---|
| Winter | 1221 | 320 |
| Spring | 321 | 620 |
| Summer | 621 | 922 |
| Autumn | 923 | 1220 |

Popieramy Waszą preferencję: **sezony jako presety w pickerze**, poza nimi surowy zakres dat. BE nie
będzie zwracać wyliczanego `season` — mniej stanu, a granice i tak macie u siebie.

**(b) Co migracja zrobiła ze starymi datami.** Dobre pytanie i **sprawdziliśmy na produkcji: sezonowych
questów nie ma ani jednego** (10 × Day, 3 × Month, 47 × None). Problem nie wystąpił.

⚠️ **Ale zostaje dla nowych.** Okno roczne **jest** powtarzalnością. Jeśli formularz ustawi `endDate` na
koniec sezonu — tak jak robił stary UI — quest zimowy wygaśnie po pierwszym sezonie i nigdy nie wróci,
mimo obietnicy „wraca co roku”. **Nie ustawiajcie `endDate` przy sezonowych**, chyba że użytkownik
naprawdę chce zakończyć nawyk. Dopisane do dokumentacji (§8b).

### FE-6 — `interval` przy `startDate: null` ✅ POTWIERDZONE

Kotwicą jest `startDate`, a gdy go nie ma — **lokalna data utworzenia questa**. To reguła, nie obejście.
Wasz plan (wymusić jawny `startDate` przy `interval > 1`) jest dokładnie tym, co byśmy zrobili — inaczej
użytkownik nie przewidzi, które dni wypadają. Dopisane do schematu przy polu `interval`.

### FE-7 — `byWeekday` bez mianownika ✅ ZROBIONE

Racja, i to argument arytmetyczny, nie kosmetyczny. Dodaliśmy **dwa** mianowniki:

```ts
daysInRange: number;        // ile razy ten dzień tygodnia wypadł w oknie [from, to]
daysScheduled: number | null;  // ile z tego quest był faktycznie zaplanowany
```

`daysScheduled` jest `null` dla harmonogramów, które nie przypinają dni tygodnia (Week/Month/Year) — tam
„ile było wtorków, w które byłem zobowiązany” nie ma sensu i `daysInRange` jest jedynym uczciwym
mianownikiem. Tam, gdzie nie jest null, jest lepszy: „z 12 poniedziałków, w które miałeś trening, zrobiłeś 9”.

Zmiana przy okazji: **wiersz pojawia się dla każdego dnia, który był zrobiony *albo* zaplanowany**.
Wcześniej dzień z zerem odhaczeń w ogóle nie wracał — czyli dzień, który użytkownik regularnie pomija,
znikał z widgetu odpowiadającego na pytanie „który dzień mi ucieka”.

### FE-8 — analityka dla `Year` i `None` ✅ ODPOWIEDŹ

- **`Year` przechodzi.** Sezonowy jest teraz powtarzalny, więc bramka go przepuszcza.
- **`None` zwraca 400.** Jednorazowy nie ma serii ani trendu.

Czyli: **chowajcie „Statystyki” tylko dla `None`.** Dla `Year` technicznie działa, ale macie rację co do
wyglądu — jeden okres na rok w kalendarzu i kubełki tygodniowe w trendzie wyjdą dziwnie. Uproszczony
widok warto zaprojektować, ale nie blokuje wydania: możecie na start chować przycisk także dla `Year`
i dodać go później, nic po stronie BE się nie zmieni.

### FE-9 — zasięg i czas życia `clientRequestId` ✅ ODPOWIEDŹ

- **Zasięg: per quest.** Filtrowany unikalny indeks na `(QuestId, ClientRequestId)`. Czyli **tak, możecie
  użyć tego samego klucza dla dwóch questów odhaczonych jednym gestem.**
- **Czas życia: bezterminowo.** Nie ma TTL ani czyszczenia — deduplikacja idzie po pełnej historii
  odhaczeń questa. Retry po kilkunastu minutach, po godzinach, następnego dnia: zadziała.

To realnie wspiera kolejkę offline, nie tylko teoretycznie.

### FE-10 — trigger maintenance ✅ ODPOWIEDŹ (lepiej, niż myśleliście)

**Nie jest jedyny — są trzy:**

```
GET /quests/active   ·   GET /quests/catch-up   ·   GET /quests/analytics/overview
```

Plus zadanie startowe procesu. Przebudowa nawigacji Wam tego nie zepsuje: cokolwiek użytkownik otworzy
pierwsze, prawie na pewno trafi w jeden z tych trzech. Przebieg jest idempotentny i przez resztę dnia
kończy się na jednym tanim zapytaniu, więc wywołanie kilku nic nie kosztuje.

Gdyby kiedyś pojawił się osobny endpoint utrzymaniowy dla crona — damy znać, przepięcie będzie trywialne.

---

## Sekcja 4 — odcięcie od `questType`: zgoda

Przyjmujemy w całości. Argument „ta praca i tak przepadnie” jest rozstrzygający, a „podział przestał być
podziałem” trafia w sedno: „2× w tygodniu” i „co drugi dzień” nie mają swojego ekranu w starym drzewku,
więc utrzymując je spychamy nowe funkcje na „Wszystkie”.

Docelowy układ (Dziś / Nawyki / Statystyki / Etykiety) z chipami filtrów na jednej liście jest lepszy niż
to, co proponowaliśmy — jedno `GET /quests` zamiast pięciu równoległych zapytań, plus kombinacje filtrów,
których menu nigdy nie da. Filtr „zagrożone” po `isAtRisk` jest sprytny; przypominamy tylko, że dla
questów dziennych `isAtRisk` jest zawsze `false` z założenia, więc ten filtr pokaże wyłącznie nawyki
tygodniowe/miesięczne — co jest chyba dokładnie tym, o co chodzi.

**Konsekwencje po naszej stronie:** `legacyQuestType` i `?legacyType=` usuwamy razem z krokiem 2 migracji.
Zostawiamy je do tego czasu jako zapas — nic nie kosztują, a gdyby migracja FE się rozciągnęła, są pod ręką.

---

## Harmonogram: zgoda, krok 2 od razu po przełączeniu

Potwierdzamy Waszą ocenę okna migracyjnego. Krok 1 (dodanie kolumn + backfill) **jest już na produkcji**
i zweryfikowany. Krok 2 (drop starych kolumn) jest napisany i celowo niewykonany — stare kolumny są
ścieżką wycofania. Skoro nie ma ruchu do ochrony, uruchomimy go zaraz po przełączeniu FE.

Jedna rzecz do zapamiętania po naszej stronie: backfill jest idempotentny i „zamiata” wiersze zapisane
przez stare API w oknie między krokami, więc kolejność przełączenia nie jest krytyczna.

---

## Wasza sekcja 6 — dwie uwagi

- **`Partial` w heatmapie z `default: 'transparent'`** — dobry wyłap, to jest dokładnie ten cichy błąd,
  który najłatwiej przegapić. Dla jasności: `Partial` **liczy się jak porażka** w każdej stopie i serii;
  jest osobno tylko po to, żeby dało się narysować częściowy postęp. Nie traktujcie go jak sukcesu.
- **`progress`/`target` to `decimal`, nie `double`** (po stronie C#). W JSON to i tak liczba, ale
  serializują się z zachowaną skalą, więc zobaczycie `2` i `1.5`, a czasem `0.00` — formatowanie po
  Waszej stronie i tak musi to ogarnąć, jak napisaliście.

---

## Czego jeszcze nie ma

Uczciwie, żeby nie było niespodzianek:

- **Brak testów relacyjnych.** Zestaw testów pokrywa domenę i EF InMemory, który **ignoruje** zarówno
  filtrowany unikalny indeks, jak i token współbieżności `RowVersion` na okresie. Czyli ochrona przed
  dwoma równoczesnymi tapnięciami na tym samym okresie jest zaimplementowana, ale nieprzetestowana.
  To pierwsza luka, którą zamkniemy.
- **`AtMost`** (limity typu „maks. 2 kawy”) — slot w enumie jest, walidator odrzuca. Faza 2.
- **Pomijanie dni / „streak freeze”** — faza 2.


---

# Runda 2 — FE-11, FE-12, FE-13

Żadna z trzech nie blokowała startu prac, ale FE-11 i FE-12 to dziury tej samej klasy co FE-1, więc
domykamy je teraz zamiast zostawiać połowiczną naprawę.

## FE-11 — cofanie odhaczenia z catch-upu ✅ ZROBIONE

Trafna diagnoza: to jest **dokładnie ten sam mechanizm co FE-1**, tylko w oknie nadrabiania.
`currentPeriod.completions` z definicji pokrywa bieżący okres, a tapnięcie z karty ląduje we wczorajszym.
Scenariusz z omyłkowym odhaczeniem jest realny i — co gorsza — samonaprawiający się w złą stronę: okres
przestaje być `Missed`, więc znika z domyślnej listy i pomyłka zostaje w historii razem z „naprawioną” serią.

Zrobione po Waszej propozycji, w wariancie z flagą:

```
GET /api/quests/catch-up?includeCompleted=true
```

Zwraca w oknie także okresy ukończone, z `outcome: 'Completed'` i tablicą `completions` (te same
`PeriodCompletionDto`, co w `currentPeriod`). **Domyślnie flaga jest wyłączona** — celowo, żeby reguła
„puste `days` = nie ma o co pytać = ukryj kartę” dalej była prawdziwa. Czyli: karta woła bez flagi,
a widok „historia nadrabiania / cofnij” woła z flagą.

Zweryfikowane na żywym API: po odhaczeniu wczorajszego dnia quest znika z domyślnej odpowiedzi,
a z `includeCompleted=true` wraca z `outcome: Completed` i `id` odhaczenia, którym `DELETE` je cofa.

## FE-12 — `canCompleteToday` przy queście jednorazowym ✅ ZROBIONE PO STRONIE BE

Dobre pytanie i słuszna obawa o „obie strony założą, że pilnuje ta druga”. **Bierzemy to na siebie.**

`canCompleteToday` schodzi teraz na `false` również wtedy, gdy quest **nie jest powtarzalny**
(`unit: 'None'`) i jego okres jest ukończony. Nie musicie nic sprawdzać po swojej stronie.

Rozumowanie: przekraczanie celu jest **cechą** przy nawyku — trzeci trening w tygodniu „2×” jest
prawdziwy i wart zapisania. Przy czymś, co dzieje się raz, `2 / 1` to po prostu pomyłka. Domena nadal
przyjmie takie tapnięcie (nie dokładamy twardej reguły, bo „przeczytać 3 rozdziały” jako jednorazowy
z celem 3 jest legalne) — to DTO zamyka przycisk, i to jest właściwy poziom.

Zweryfikowane: jednorazowy po ukończeniu → `canCompleteToday: false`; nawyk dzienny po ukończeniu →
`true`, przekraczanie dalej działa.

## FE-13 — nieaktualne §9 i §10 ✅ POPRAWIONE

Słusznie — „ktoś to przeczyta za miesiąc i uwierzy”. Poprawione wszystkie trzy miejsca:

- **§9, checklista** — punkt o `?legacyType=` zamieniony na „zastąpić pięć list **jedną** z `GET /quests`
  i filtrami po stronie klienta”, z adnotacją, że `legacyType` celowo nie używamy.
- **§10** — „Pytania do Was” → **„Ustalenia”**, z pięcioma odpowiedziami i podsumowaniem zmian z obu rund.
- **Nagłówek `quests-api-schema.ts`** — już nie reklamuje `?legacyType=` jako sposobu na „ekrany działają
  bez zmian”; mówi wprost, że nic nie ma na tym stać i że parametr znika z krokiem 2.

## Wasza uwaga przy FE-4: cofnięcie a zaliczony cel

Potwierdzamy — **zamierzone, dokładnie jak z nagrodami.** Cofnięcie odhaczenia nie cofa zaliczonego celu.
Powód ten sam: mieszkanie w stanie „zaliczone, ale już nie” kosztuje więcej, niż chroni, a przy dwóch
użytkownikach nie ma czego pilnować. Dopisane do kontraktu, żeby UI mógł to zakomunikować, jeśli
pozwolicie cofać z ekranu celu.

## Stan

Wszystkie trzynaście pozycji zamkniętych. Nic po naszej stronie nie czeka na Was — **możecie startować**.

Jedyna rzecz, o której warto pamiętać (i którą sami wypunktowaliście): brak testów relacyjnych na
`RowVersion` i filtrowanym indeksie. Zgadzamy się z Waszą oceną ryzyka — dwa równoczesne tapnięcia w tym
samym okresie wymagają dwóch urządzeń naraz, a retry z kolejki i tak jest zdeduplikowany po
`clientRequestId`. Zamkniemy to przy okazji lokalnej bazy, która i tak jest potrzebna przed krokiem 2.
