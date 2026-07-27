# Specyfikacja kategorii finansowych do zasilenia backendu

Kompletna lista kategorii i podkategorii, jakie frontend zakłada w module Finanse. Każda pozycja mapuje się 1:1 na `FinanceCategoryDto` / `CreateFinanceCategoryRequest` ze swaggera:

- **name** — nazwa wyświetlana (backend nie ma i18n dla kategorii, więc to jest jedyny tekst jaki użytkownik zobaczy)
- **type** — `Expense` albo `Income`
- **icon** — nazwa ikony z [Ionicons](https://ionic.io/ionicons) (wersja outline), np. `home-outline`. **Ważne**: to musi być dokładnie taka nazwa, inaczej ikona się nie wyrenderuje po stronie apki (to jest źródło problemu z ikonami, które teraz widzisz — backend najwyraźniej zwraca `null` albo nieprawidłowe nazwy dla części kategorii).
- **color** — hex, np. `#1987EE`
- **isSavings** — `true` tylko dla kategorii "Finanse i Oszczędności" (i jej dzieci) — to pole dodaliśmy do swaggera specjalnie po to, żeby oddzielić oszczędności od wydatków
- **parentCategoryId** — `null` dla kategorii głównych, dla podkategorii wskazuje na `id` rodzica

Podkategorie **nie muszą** mieć własnej ikony/koloru — mogą być `null` i wtedy apka użyje ikony/koloru rodzica. Poniżej podane są tylko dla kategorii głównych (podkategorie to głównie kwestia nazwy).

---

## Kategorie WYDATKÓW (type: Expense)

### 1. Mieszkanie
`icon: home-outline` · `color: #1987EE` · `isSavings: false`

| Podkategoria |
|---|
| Czynsz / Rata kredytu |
| Czynsz administracyjny |
| Prąd |
| Woda i ścieki |
| Gaz |
| Ogrzewanie |
| Wywóz nieczystości |
| Internet / Wi-Fi |
| Telewizja |
| Ubezpieczenie nieruchomości |
| Serwis / Naprawy domowe |
| Środki czystości |

### 2. Transport
`icon: car-outline` · `color: #F59E0B` · `isSavings: false`

| Podkategoria |
|---|
| Paliwo |
| Rata kredytu / leasingu |
| Ubezpieczenie OC/AC |
| Przegląd / Serwis |
| Opony |
| Komunikacja miejska / PKP |
| Taxi / Uber / Bolt |
| Parkingi / Autostrady |
| Akcesoria samochodowe |

### 3. Życie i Zdrowie
`icon: heart-outline` · `color: #10B981` · `isSavings: false`

| Podkategoria |
|---|
| Zakupy spożywcze |
| Jedzenie na mieście |
| Wizyty lekarskie |
| Leki i suplementy |
| Dentysta |
| Siłownia / Karnet sportowy |
| Kosmetyczka / Fryzjer |
| Odzież i obuwie |

### 4. Rozwój i Edukacja
`icon: school-outline` · `color: #8B5CF6` · `isSavings: false`

| Podkategoria |
|---|
| Czesne |
| Kursy online / Szkolenia |
| Książki / E-booki |
| Subskrypcje edukacyjne |
| Sprzęt edukacyjny |

### 5. Rozrywka i Inne
`icon: game-controller-outline` · `color: #EC4899` · `isSavings: false`

| Podkategoria |
|---|
| Streaming (Netflix, Spotify...) |
| Kino / Teatr / Koncerty |
| Hobby i akcesoria |
| Zwierzęta |
| Dzieci |
| Prezenty |
| Wyjścia ze znajomymi |
| Nieprzewidziane wydatki |

### 6. Finanse i Oszczędności ⚠️ `isSavings: true`
`icon: trending-up-outline` · `color: #14B8A6` · **`isSavings: true`**

Ta kategoria (i jej podkategorie) jest wykluczana z sumy "wydano" na Pulpicie i w Statystykach — pokazywana osobno jako "Odłożone w tym miesiącu". To jest jedyna kategoria z `isSavings: true`.

| Podkategoria |
|---|
| Poduszka finansowa |
| IKE / IKZE |
| Inwestycje (ETF / Giełda) |
| Oszczędności celowe |
| Spłata długów |

---

## Kategorie PRZYCHODÓW (type: Income)

Bez podkategorii (płaska lista). W apce nazywane "źródłami przychodu", ale w API to zwykłe kategorie z `type: Income`.

| Nazwa | icon | color |
|---|---|---|
| Wynagrodzenie | `briefcase-outline` | `#10B981` |
| Premia / Bonus | `gift-outline` | `#10B981` |
| Działalność gosp. | `business-outline` | `#10B981` |
| Freelance | `laptop-outline` | `#10B981` |
| Dochód pasywny | `wallet-outline` | `#10B981` |
| Świadczenia | `shield-checkmark-outline` | `#10B981` |
| Zwrot podatku | `receipt-outline` | `#10B981` |
| Inne | `ellipsis-horizontal-outline` | `#10B981` |

*(Kolor przychodów może być jeden dla wszystkich — `#10B981` to zielony używany w całej apce dla przychodów. Ikony różne dla rozróżnienia źródeł.)*

---

## Podsumowanie liczb

- 6 kategorii wydatków głównych, w tym 1 oznaczona `isSavings: true`
- 47 podkategorii wydatków łącznie (12+9+8+5+8+5 — ostatnie 5 to podkategorie "Finanse i Oszczędności")
- 8 kategorii przychodów (płaskie, bez podkategorii)
- Gotowy JSON do zasilenia backendu: [`finance-categories-seed.json`](./finance-categories-seed.json)

## Rzeczy do potwierdzenia z backendem

1. **Czy `icon`/`color` na podkategoriach są w ogóle potrzebne backendowi, czy mogą być `null`?** Apka i tak spada na ikonę/kolor rodzica.
2. **Czy nazwy kategorii można kiedyś zlokalizować (EN/PL)?** Obecny `FinanceCategoryDto.name` to jeden string — jeśli kiedyś chcemy angielską wersję apki z angielskimi nazwami kategorii, backend będzie musiał to wsparć (np. osobne pole albo nagłówek `Accept-Language`).
3. **Czy `isSavings` powinien być też ustawialny per-podkategoria, czy tylko na kategorii głównej?** Zakładam, że flaga na rodzicu wystarczy (apka i tak traktuje wszystkie dzieci kategorii oznaczonej `isSavings: true` jako oszczędności).
