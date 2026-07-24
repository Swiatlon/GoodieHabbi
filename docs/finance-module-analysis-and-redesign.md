# Moduł Finanse — analiza obecnego stanu i propozycja przeprojektowania

> Perspektywa: zwykły użytkownik telefonu, korzystający z aplikacji w biegu, jedną ręką, często przez 10-15 sekund dziennie. Nie perspektywa developera czytającego kod.

## 1. Jak to działa dzisiaj (stan obecny)

- Trzy **odrębne ekrany** dostępne z drawer menu: `Wydatki`, `Przychody`, `Statystyki`. Nie są ze sobą wizualnie/nawigacyjnie połączone — to trzy różne miejsca w apce.
- **Wydatki**: 6 kategorii (Mieszkanie, Transport, Życie i Zdrowie, Rozwój i Edukacja, Rozrywka i Inne, Finanse i Oszczędności), każda z rozbudowaną listą podkategorii (np. Mieszkanie ma 12 podkategorii). Każda kategoria ma **własny, ręcznie ustawiany budżet** (osobny modal).
- Na górze ekranu Wydatki jest karta "Monthly Overview" pokazująca `Spent` vs `Budget`, gdzie `Budget` = suma przychodów z tego miesiąca (auto, niedawno zmienione na Twoją prośbę).
- **Przychody**: lista wpisów z jednego miesiąca, suma na górze, source (Wynagrodzenie/Premia/Freelance/itd.), swipe-to-delete.
- **Statystyki**: widok **roczny** — 4 KPI, pie chart (rozkład kategorii), bar chart (przychody vs wydatki per miesiąc), progress bary (budżet vs wykonanie per kategoria), line chart (trend salda).
- Nawigacja miesiąc/rok: osobny scrollowany selektor miesięcy (chipy) na Wydatkach/Przychodach, tylko selektor roku na Statystykach (brak widoku miesięcznego w statystykach).
- Dodawanie wydatku/przychodu: osobne modale, osobne FAB-y, każdy wymaga: wybór kategorii (grid chipów) → wybór podkategorii (drugi grid, tylko wydatki) → kwota → opcjonalny opis.
- Dane są mockowe (RTK Query `queryFn`), jedno konto (`accountId: 1` na sztywno).

## 2. Co mi się podoba — zostawić

1. **Taksonomia kategorii i podkategorii wydatków jest naprawdę dobra.** To nie jest generyczny "Food/Transport/Other" — te podkategorie (np. "Czynsz administracyjny", "IKE/IKZE", "Rata leasingu") wyglądają jak napisane przez kogoś, kto realnie rozumie polskie realia budżetu domowego. Szkoda by to zepsuć w przebudowie.
2. **Dobór wykresów na Statystykach jest trafny merytorycznie** — donut do rozkładu kategorii, bar do porównania miesięcznego, line do trendu salda. To nie przypadkowy zestaw widgetów, każdy odpowiada na konkretne pytanie.
3. **Warstwa danych (RTK Query, tagi invalidacji) jest czysta** i łatwo wymienialna na prawdziwe API — nie trzeba tego przepisywać niezależnie od tego, co zrobimy z UI.
4. Podstawy mobilne są już ogarnięte: swipe-to-delete, pull-to-refresh, klawiatura nie zasłania inputów, formatowanie PLN.

## 3. Co mi się nie podoba — z perspektywy użytkownika telefonu

### 3.1. Brak jednego miejsca "dodaj transakcję"
Użytkownik, który właśnie coś kupił, nie myśli "czy to jest ekran Wydatków czy Przychodów" — myśli "muszę to zapisać, zanim zapomnę". A tu ma **dwa różne FAB-y na dwóch różnych ekranach**, do których trzeba dojść przez drawer. To dokładnie odwrotność tego, jak działają Revolut, Monzo, Spendee, YNAB — tam jest **jeden przycisk "+"**, a typ (wydatek/przychód) to prosty toggle *wewnątrz* jednego flow. Im więcej tarcia przy zapisywaniu, tym szybciej użytkownik przestaje logować wydatki (a to jest śmierć każdej apki finansowej — dane wysychają po tygodniu).

### 3.2. Sprzeczny model budżetu
Na górze Wydatków `Budget` = suma przychodów miesiąca (auto). Ale każda kategoria ma **swój własny, zupełnie niezależny** budżet ustawiany ręcznie. Te dwie liczby nie muszą się w ogóle zgadzać — kategorie mogą sumować się do znacznie więcej albo mniej niż "budżet" na górze, i apka to nie sygnalizuje. To są w praktyce **dwa różne pojęcia nazwane tym samym słowem "budżet"**, co jest prosta droga do dezorientacji (to zresztą już się zdarzyło — to Ty zgłosiłeś, że budżet powinien = przychód; ale kategorie zostały nietknięte i wciąż żyją własnym życiem).

### 3.3. Zero transakcji cyklicznych
Czynsz, wynagrodzenie, Netflix, rata kredytu — to z definicji się powtarza co miesiąc. A dziś trzeba wpisywać to ręcznie od zera każdego miesiąca. To jest **najczęstsza przyczyna, dla której ludzie przestają używać apek budżetowych** — samo ręczne wprowadzanie tych samych 5-10 pozycji miesiąc w miesiąc.

### 3.4. Statystyki tylko roczne
Nie ma szybkiego porównania "ten miesiąc vs poprzedni" — trzeba jechać do Statystyk i mrużyć oczy na wykres z 12 słupkami, z których większość może być pusta (np. dla nowego użytkownika w sierpniu 8 z 12 miesięcy to zera, a i tak się renderują).

### 3.5. Nawigacja miesiącem = małe strzałki, nie gest
Naturalny gest mobilny do zmiany miesiąca to **swipe w lewo/prawo po treści** (tak działa kalendarz, tak działa większość apek finansowych). Tu trzeba trafić w mały chevron albo przescrollować rząd chipów.

### 3.6. Dodawanie wydatku to długi formularz, nie quick-entry
Grid kategorii → grid podkategorii → kwota → opis, wszystko w jednym scrollu. Brak "ostatnio używane" na górze, brak zapamiętanego domyślnego wyboru. Za każdym razem taki sam wysiłek, nawet dla wydatku który wpisujesz codziennie (np. "kawa").

### 3.7. "Finanse i Oszczędności" to podkategoria wydatków — to psuje matematykę
Inwestycje/IKE/oszczędności są liczone jako **wydatek**, czyli jako pieniądze które "wyparowały". To zaniża realny obraz — 8000 zł wpłacone na inwestycje wygląda identycznie jak 8000 zł przepalone na coś bezzwrotnego, i ciągnie w górę "biggest category" oraz zjada "wskaźnik oszczędności", mimo że to pieniądze wciąż Twoje. Oszczędzanie to nie wydawanie.

### 3.8. Brak jakiegokolwiek związku z resztą aplikacji
To jest apka z questami, poziomami, XP, sklepem, rankingiem — cały produkt jest zbudowany wokół grywalizacji nawyków. A moduł finansowy zachowuje się jak wklejony 1:1 klon nudnego arkusza kalkulacyjnego, bez XP za regularne logowanie, bez questa "zaloguj każdy wydatek w tym tygodniu", bez odznaki za 3 miesiące w budżecie. To nie błąd techniczny, to niewykorzystana tożsamość produktu.

### 3.9. Brak wglądu z Dashboardu
Finanse to coś, co ludzie chcą widzieć **od razu**, bez wchodzenia głębiej. Dziś główny Dashboard nic o finansach nie mówi — trzeba świadomie wejść w drawer → Finanse, żeby zobaczyć czy jesteś w budżecie.

### 3.10. Brak wyszukiwania/filtrowania listy transakcji
Przy większej ilości danych flat lista per kategoria/miesiąc szybko robi się nieużywalna — nie da się np. sprawdzić "czy już zapisałem ten Netflix w tym miesiącu".

*(Techniczna, niezwiązana z designem uwaga na marginesie: nazwy miesięcy w wykresach (`MONTHS_SHORT`) są zahardkodowane po polsku i nie przechodzą przez i18n — to zostało przeoczone przy wcześniejszej konwersji całej apki. Wart naprawić niezależnie od tego, co zrobimy z resztą modułu.)*

## 4. Diagnoza

Moduł Finanse jest architektonicznie **generycznym klonem budżetówki bankowej**, doklejonym do apki, której cała reszta jest zaprojektowana wokół gier/nawyków. Problemy UX-owe (fragmentacja nawigacji, brak unified quick-add, sprzeczny model budżetu, brak cykliczności) to typowe bolączki tego typu apek na mobile — i dokładnie to jest miejsce, gdzie warto pójść "całkowicie inaczej", jak zaproponowałeś.

## 5. Propozycja nowej struktury

### Nowa architektura informacji (IA)
Zamiast 3 osobnych pozycji w drawer → **jedna pozycja "Finanse"**, wewnątrz segmented control / top-tabs (nie drawer):

```
Finanse
├── Pulpit      (nowy — dashboard finansowy)
├── Historia    (połączone wydatki + przychody, jedna lista, filtrowalna)
└── Statystyki  (zostaje, ale z widokiem miesięcznym obok rocznego)
```

- **Pulpit** (nowy ekran domyślny): duża karta "saldo tego miesiąca", pod nią "budżet — ile zostało" (jedna, jasno zdefiniowana liczba, nie dwie sprzeczne), poniżej 5 ostatnich transakcji (mieszane wydatki+przychody), i to tutaj żyje **jedyny przycisk dodawania**.
- **Historia**: scalona lista wszystkich transakcji (nie dwa osobne ekrany), z wyszukiwaniem i filtrem (typ / kategoria / zakres dat).
- **Statystyki**: dodać przełącznik Miesiąc/Rok, żeby "ten miesiąc vs poprzedni" nie wymagało jechania do rocznego wykresu.

### Unified "dodaj transakcję" (największy pojedynczy zysk UX)
Jeden flow, nie dwa modale:
1. Ekran/modal quick-entry: duży numpad na kwotę (jak kalkulator), na górze mały segmented toggle **Wydatek / Przychód**.
2. Po wpisaniu kwoty → wybór kategorii, z **"ostatnio używane" jako pierwszy rząd chipów** (największy realny time-saver dla codziennych wydatków typu kawa/paliwo).
3. Opis/data — opcjonalne, zwinięte domyślnie.

### Gest zmiany miesiąca
Swipe w lewo/prawo po treści Pulpitu/Historii = poprzedni/następny miesiąc, oprócz istniejących strzałek (nie usuwać, dodać).

### Naprawa modelu budżetu
Przejść na jasne **envelope budgeting**: użytkownik ustawia jeden budżet miesięczny (domyślnie = przychód, edytowalny), a budżety kategorii muszą się do niego sumować — jeśli nie sumują się, pokazać wprost "Nieprzydzielone: X zł" albo "Przekroczono łączny budżet o X zł", zamiast dwóch cichych, niezgadzających się liczb.

### Oszczędności/Inwestycje jako osobna oś, nie wydatek
Wydzielić "Finanse i Oszczędności" z listy kategorii wydatków i pokazywać jako **"Odłożone w tym miesiącu"** — osobny, pozytywnie ramowany wskaźnik (przyczynek do majątku netto), nie pozycja w "ile wydałem".

### Transakcje cykliczne
Przy dodawaniu wydatku/przychodu — opcja "Powtarzaj każdy miesiąc". Na początku nowego miesiąca — jedno-kliknięciowe potwierdzenie "Dodać znowu: Czynsz 1500 zł, Wynagrodzenie 10000 zł?" zamiast wpisywania od zera.

### Karta na Dashboardzie
Mały widget na głównym Dashboardzie: "Wydano X / Budżet Y" z tap-through do Pulpitu Finansów — żeby nie trzeba było świadomie wchodzić w drawer, by wiedzieć gdzie się stoi.

### Opcjonalnie: sprzężenie z grywalizacją (osobna decyzja, patrz sekcja 6)
Skoro cała apka żyje z questów/XP/odznak — Finanse mogłyby dostać: XP za zalogowanie transakcji tego samego dnia, quest tygodniowy "Zaloguj każdy wydatek", odznaka za 3 miesiące w budżecie. To największa różnicująca zmiana, ale też najbardziej opcjonalna — nie każdy chce, żeby finanse były "grą".

## 6. Decyzje, których nie mogę podjąć sam — potrzebuję Twojego wyboru

1. **Nawigacja**: drawer z 3 pozycjami (jak teraz) vs. jedna pozycja "Finanse" z segmented tabs/top-tabs wewnątrz (proponowane)?
2. **Model budżetu**: twarde envelope budgeting (kategorie muszą sumować się do całości, z walidacją) vs. tylko "soft" wskaźnik nieprzydzielonych środków (łatwiejsze, mniej restrykcyjne)?
3. **Transakcje cykliczne**: robimy w tej iteracji, czy to faza 2?
4. **Grywalizacja finansów** (XP/questy/odznaki): tak czy nie — to zmienia charakter modułu, nie tylko UI?
5. **Oszczędności/Inwestycje**: wydzielić z wydatków jak proponuję, czy zostawić jak jest (mniejsza zmiana, ale zostaje wypaczona matematyka)?
6. **Wiele kont** (gotówka / konto bankowe / oszczędnościowe): potrzebne teraz, czy jedno konto na razie wystarczy?
7. **Unified add-transaction**: pełny nowy numpad-first flow (większa zmiana wizualna) vs. mniejsza zmiana — zostawić dwa formularze, ale jeden wspólny punkt wejścia (FAB z wyborem typu)?

## 7. Proponowany plan fazowy (jeśli idziemy w tę stronę)

**Faza 1 — fundament (największy zysk UX, umiarkowany koszt)**
- Nowa IA: Pulpit / Historia / Statystyki pod jedną pozycją "Finanse"
- Unified add-transaction (jeden punkt wejścia, toggle wydatek/przychód)
- Scalona lista Historia (wydatki+przychody razem, z filtrem/szukajką)
- Naprawa modelu budżetu (jasne "nieprzydzielone" albo pełne envelope budgeting — do wyboru w pkt 6.2)
- Swipe-gest zmiany miesiąca
- Widok miesięczny w Statystykach

**Faza 2 — utrzymanie nawyku**
- Transakcje cykliczne (rachunki/wynagrodzenie)
- "Ostatnio używane" kategorie w quick-add
- Karta finansowa na Dashboardzie

**Faza 3 — różnicowanie produktu (opcjonalne)**
- Sprzężenie z grywalizacją (XP/questy/odznaki finansowe)
- Oszczędności/Inwestycje jako wskaźnik majątku, nie wydatek
- Wielo-kontowość

---

Dalszy krok: odpowiedz na pytania z sekcji 6 (albo daj znać jeśli chcesz, żebym po prostu zaproponował swój wybór dla każdego) — wtedy rozpiszę to na konkretny plan implementacji.

---

## 8. Iteracja 2 — analiza przeciążenia informacyjnego (po wdrożeniu Fazy 1)

Feedback po zbudowaniu Fazy 1: Pulpit jest nieczytelny, użytkownik czuje się zagubiony pod naporem informacji. Poniżej analiza **czemu** tak jest — nie chodzi o to, że informacji jest za dużo, tylko że wszystkie są pokazane na tym samym poziomie szczegółowości, w tym samym momencie, tym samym sposobem wizualnym.

### 8.1. Wzorzec z Questów — czego się nauczyć

Sprawdziłem dokładnie, jak Questy (które też mają sporo danych na quest: tytuł, priorytet, trudność, daty, zaplanowana godzina, tagi, statystyki, sezon...) radzą sobie z tym bez przytłaczania:

**Lista (skan):** każdy quest w liście (`daily-quest-item.tsx` i podobne) pokazuje naprawdę wiele atrybutów na raz (emoji, tytuł, priorytet, daty, godzina, trudność, tagi) — ale każdy jako **jedna krótka linijka tekstu z ikoną/emoji**, bez ramek, tła, kart. Atrybuty, których nie ma (np. brak tagów), **po prostu się nie renderują** (`return null`). Efekt: gęsto informacyjnie, ale wizualnie "cicho" — oko skanuje kolumnę krótkich linii, nie kolekcję pudełek.

**Szczegóły (dotknięcie):** dopiero po tapnięciu quest otwiera modal (`quest-show-item-modal.tsx`) z pełnym rozpisaniem — ale nawet tam każdy temat (status, opis, priorytet, trudność, daty, tagi, statystyki) to **osobna, mała karta skoncentrowana na jednej rzeczy**, ułożone w kolumnie z równym odstępem. Nigdy dwa tematy w jednej karcie.

**Kluczowa zasada:** lista = szybki skan, jedna linia na atrybut, zero chromu. Szczegóły = dopiero po geście, jeden temat na kartę.

### 8.2. Gdzie Pulpit Finansów łamie tę zasadę

1. **Kategorie na Pulpicie to od razu "widok szczegółowy".** Każda `CategoryCard` to pełna karta z nagłówkiem, **całą listą pojedynczych transakcji tej kategorii wewnątrz**, i paskiem budżetu na dole — i to się dzieje **dla każdej kategorii na raz**, wszystkie rozwinięte, na starcie. To jest odpowiednik pokazania od razu `quest-show-item-modal` dla każdego questa w liście, zamiast krótkiej linijki. To jest największy winowajca przeciążenia.
2. **Sekcja Oszczędności jest zduplikowana.** "Odłożone w tym miesiącu" pojawia się jako kompaktowa zielona karta (dobrze, to jest OK) **i drugi raz** jako pełna rozwinięta `CategoryCard` niżej — dwa różne poziomy szczegółowości tej samej informacji na jednym ekranie.
3. **Karta "Przegląd miesiąca" miesza kilka tematów w jednej karcie**: wydano/budżet, pasek postępu, % wykorzystania, ile zostało/przekroczono, ostrzeżenie o nieprzydzielonym budżecie — to 3 różne tematy (nagłówek, szczegół postępu, zdrowie alokacji) w jednym pudełku, wbrew zasadzie "jeden temat = jedna karta".

### 8.3. Propozycje (bez redukcji informacji — zmiana sposobu, jak proponowałeś)

**Opcja A — kategorie jako kompaktowe wiersze + tap-to-detail (rekomendowana, najmniejsza zmiana):**
Zamiast pełnej karty na kategorię, jedna krótka linia: ikona, nazwa, wydano/budżet, cienki pasek — analogicznie do questowej listy. Tapnięcie otwiera dokładnie tę samą zawartość, którą `CategoryCard` już dziś renderuje (pełna lista transakcji + pasek + akcja "ustaw budżet"), tylko jako modal otwierany na życzenie, nie zawsze widoczny. Zero utraty informacji — wszystko wciąż dostępne, jedno tapnięcie głębiej. To naprawia też duplikat z Oszczędności (staje się taką samą kompaktową linią jak inne kategorie).

**Opcja B — akordeon inline (bez nowego modala):**
Kategorie jako kompaktowe wiersze, ale tapnięcie rozwija transakcje **w miejscu** (accordion), bez osobnego ekranu. Wszystko zostaje na jednym scrollu, ale domyślnie zwinięte. Mniej podobne do wzorca questów (tam zawsze pełny modal), ale mniejsza zmiana nawigacyjna.

**Opcja C — najbardziej radykalne rozdzielenie:**
Pulpit pokazuje wyłącznie kompaktowe wiersze budżetu kategorii (bez możliwości rozwinięcia). Chcesz zobaczyć konkretne transakcje danej kategorii? Idziesz do Historii (którą już lubisz) i filtrujesz po kategorii — Pulpit staje się czysto "zdrowie budżetu", Historia = wszystkie transakcje. Wymaga dodania filtra kategorii do Historii (dziś ma tylko filtr typu Wydatek/Przychód).

Dodatkowo (niezależnie od wybranej opcji): rozbicie karty "Przegląd miesiąca" na wydzielony, mniej krzykliwy sposób pokazania ostrzeżenia o nieprzydzielonym budżecie (mniejsza czcionka/plomba, nie w jednej linii z resztą liczb).

### 8.4. Górny tab bar (Pulpit/Historia/Statystyki) — czy to zbędna warstwa?

Masz rację, że to warto przemyśleć. Trzy opcje:

**A) Zostaw jak jest** — pełnej szerokości segmented tabs, zawsze widoczne.

**B) Ten sam mechanizm, lżej wizualnie** — mniejsze "piguły" zamiast pełnej szerokości segmentów, żeby nie wyglądało jak drugi system nawigacji, tylko szybki przełącznik.

**C) Usuń tab bar, wróć do wzorca nawigacji z resztą apki (rekomendowana):**
Zauważyłem, że w innych miejscach apki (np. Profil → Powiadomienia/Ekwipunek) nawigacja działa jako **normalne przejście z przyciskiem "wstecz"**, nie jako rówieśnicze zakładki. Dla Finansów: Pulpit = ekran domowy (bez tab bara), z dwoma ikonami w nagłówku ("Historia", "Statystyki") które **przechodzą** do tych ekranów z normalnym "wstecz", zamiast być trzema równorzędnymi zakładkami. To usuwa wrażenie "dodatkowej warstwy nawigacji", bo staje się tym samym wzorcem, który już znasz z reszty apki, zamiast nowego, bespoke mechanizmu.

*Zastrzeżenie do C: trochę utrudnia szybkie przeskoczenie Historia→Statystyki bez wracania do Pulpitu — da się to zrekompensować małą ikoną "przejdź do X" w nagłówku tamtych ekranów, jeśli to problem.*

*Uwaga techniczna, na wypadek gdybyśmy wrócili do idei zakładek jako swipe'owanych stron: gest swipe lewo/prawo już oznacza "zmień miesiąc" na Pulpicie/Historii. Swipe'owalne zakładki użyłyby tego samego gestu do czegoś innego — to by się gryzło. Zostawiam to jako techniczne ostrzeżenie, nie jako coś, co już zrobiłem.*

### 8.5. Poprawki i18n wykonane przy tej analizie (nie wymagały decyzji, więc już zrobione)

- `finance.contract.ts` — nazwy kategorii, podkategorii i źródeł przychodu (np. "Mieszkanie", "Czynsz / Rata kredytu") były zahardkodowane po polsku wprost w modelu danych, z pominięciem systemu i18n. Przepisane na wzorzec `labelKey` (jak w module Shop) + pełne tłumaczenia EN/PL.
- `quest-item-date.tsx` — kilka angielskich napisów ("No deadline", "Expired", "Last day!", "days left") ominiętych przy wcześniejszej konwersji całej apki na i18n. Naprawione, z reużyciem kluczy już istniejących w `quest-dates-extended.tsx`.

### 8.6. Co dalej

Czekam na Twój wybór z 8.3 (kategorie) i 8.4 (tab bar) — mogę zaproponować swój wybór, jeśli wolisz, ale to zmienia strukturę ekranów, więc chcę Twojego zdania przed kodowaniem.
