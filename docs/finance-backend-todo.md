# Backend TODO: status płatności, saldo przechodzące, transakcje cykliczne

Frontend już zakłada te trzy rzeczy — kontrakty (`src/contract/finance/finance.contract.ts`) i wywołania API
(`src/redux/api/finance/finance-api.ts`) są napisane tak, jakby backend już je obsługiwał. Poniżej dokładnie
czego brakuje po stronie backendu, żeby to zaczęło faktycznie działać (a nie tylko renderować się w UI).

## 1. Status zapłacone / niezapłacone (`isPaid`)

Odpowiada na: "wydatki powinny móc mieć ustawione czy już zapłaciłem czy nie".

- Dodać `isPaid: bool` (NOT NULL, default `true`) do encji `Transaction`.
- `POST /finance/transactions` i `PUT /finance/transactions/{id}` — przyjmować opcjonalne pole `isPaid` w
  body. Frontend zawsze je wysyła (dla wydatków — dla przychodów wysyła `true`, bo tam to pojęcie nie ma
  sensu), ale zróbcie je opcjonalne z defaultem `true` dla innych klientów tego API.
- `GET /finance/transactions` (i wszędzie indziej, gdzie w odpowiedzi pojawia się pełny obiekt transakcji,
  np. `corrections` zagnieżdżone w transakcji nadrzędnej) — zwracać `isPaid` w każdym obiekcie.
- Nowy endpoint: `PATCH /finance/transactions/{id}/paid-status`, body `{ "isPaid": bool }`, zwraca
  zaktualizowaną transakcję. Frontend używa tego do oznaczania "zapłacone" jednym tapnięciem na liście, bez
  przesyłania całego obiektu transakcji.
- Migracja: istniejące transakcje dostają `isPaid = true` (to rzeczy, które już się wydarzyły).
- Do ustalenia po waszej stronie: czy przy tworzeniu transakcji z datą w przyszłości `isPaid` powinno mieć
  inny default niż `true`? Frontend zawsze wysyła jawną wartość, więc to dotyczy tylko klientów, którzy pole
  pominą.

**Dopóki tego nie ma:** apka nie pokazuje niczego ekstra (frontend sprawdza `!transaction.isPaid`, więc
brakujące/`undefined` pole = "zapłacone", zero zmiany w obecnym UI) — bezpieczne do wdrożenia w dowolnym
momencie bez efektu ubocznego na to co już działa.

## 2. Saldo przechodzące z miesiąca na miesiąc (`openingBalance`)

Odpowiada na: "co z kasą, która została z tamtego miesiąca — nie chcę wpisywać jej drugi raz jako przychód,
bo zepsuje mi to statystyki".

- `GET /finance/analytics/monthly-summary?year&month` — dodać pole `openingBalance: number` do odpowiedzi
  (`IMonthlySummary`).
- Logika: `openingBalance(rok, miesiąc) = max(0, openingBalance(poprzedni miesiąc) + totalIncome(poprzedni
  miesiąc) - totalExpense(poprzedni miesiąc))`. To musi się liczyć **łańcuchowo** od pierwszego miesiąca z
  danymi użytkownika (albo od momentu włączenia tej funkcji), nie tylko "miesiąc wstecz" — inaczej saldo
  znika, jeśli ktoś nie otworzy apki przez 2+ miesiące.
- Do ustalenia biznesowo: czy saldo może wyjść na minus (wydano więcej niż było)? `max(0, ...)` powyżej
  ucina do zera — alternatywa to pokazywać ujemne saldo jako ostrzeżenie zamiast chować je.
- Wydajność: to się liczy przy każdym odczycie summary — rozważcie cache/denormalizację (np. przeliczaną
  wsadowo po każdej zmianie transakcji w danym miesiącu) zamiast sumowania całej historii na żywo za każdym
  razem.

**Dopóki tego nie ma:** pole nie istnieje w odpowiedzi → frontend czyta `summary?.openingBalance ?? 0` →
karta "Zostało z poprzednich miesięcy" po prostu się nie pokazuje, budżet miesiąca liczy się jak dotychczas.
Zero efektu ubocznego.

## 3. Transakcje cykliczne (recurring transactions)

Odpowiada na: "kopiowanie rzeczy, które się powtarzają z miesiąca na miesiąc (czesne, czynsz)" — docelowo
automatycznie, nie ręcznie. Manualne kopiowanie (które już działa w apce, patrz
`copy-from-last-month-modal.tsx` / `copy-transaction-modal.tsx`) zostaje jako alternatywa i tak zostanie —
to jest o dodaniu opcji "rób to za mnie automatycznie".

Nowa encja `RecurringTransaction`:

| pole | typ | uwagi |
|---|---|---|
| id | int | |
| type | Income / Expense | |
| categoryId | int, nullable | |
| amount | decimal | |
| note | string, nullable | |
| dayOfMonth | int (1-31) | patrz uwaga o krótszych miesiącach niżej |
| isActive | bool | |
| createdAt / updatedAt | datetime | |

Endpointy (frontend już ich używa, patrz `finance-api.ts`):

- `GET /finance/recurring-transactions` — lista szablonów
- `POST /finance/recurring-transactions` — body: `type, categoryId?, amount, note?, dayOfMonth`
- `PUT /finance/recurring-transactions/{id}` — body: `amount?, note?, dayOfMonth?, isActive?`
- `DELETE /finance/recurring-transactions/{id}`

**Najważniejsza decyzja projektowa — materializacja.** Coś musi faktycznie tworzyć prawdziwe `Transaction`
z szablonu co miesiąc. Dwie opcje:

1. **Scheduled job** (cron / Hangfire / itp.) — czyściejsze, ale wymaga infrastruktury do zadań cyklicznych.
2. **Lazy materialization** — przy pierwszym odczycie danego (rok, miesiąc) backend sprawdza aktywne
   szablony bez odpowiadającej transakcji w tym miesiącu i je tworzy. Prostsze bez dodatkowej infry, ale
   trzeba pilnować idempotencji (nie duplikować przy kolejnych odświeżeniach tego samego miesiąca).

Rekomendacja: (2), jeśli nie ma już mechanizmu do jobów w tle — mniej roboty na start, można później
przepisać na (1) bez zmian w kontrakcie API.

Uwaga: `dayOfMonth` większy niż liczba dni w danym miesiącu (np. 31 w lutym) — materializować na ostatni
dzień miesiąca, dla spójności z tym jak już działa ręczne kopiowanie (`remapOccurredOnToMonth` w
`src/utils/finance/form-helpers.ts`).

**Dopóki tego nie ma:** te endpointy nie istnieją na realnym API. Modal "Cykliczne płatności" na Dashboardzie
pokaże pusty/błędny stan (obsłużone gracefully, nie crashuje), a checkbox "Powtarzaj co miesiąc" w modalu
dodawania transakcji zafailuje po cichu — sama transakcja i tak się doda poprawnie, tylko szablon cykliczny
nie powstanie (osobny snackbar z błędem tylko dla tej części).

## Priorytety

1. **`isPaid`** — najmniejszy kawałek, jedno pole + jeden endpoint.
2. **`openingBalance`** — logika prosta, ale wymaga przemyślenia wydajności/cache'u.
3. **Recurring transactions** — największy kawałek: nowa encja + decyzja o materializacji + 4 endpointy.
