# `ProcessBehindAsset` — spec

## What it is

Sekcja Develop-to-Sell pokazująca dwa źródła przewagi Stora: proces oparty na
danych oraz lokalną ekspertyzę. Składa się z nagłówka i dwóch naprzemiennych
wierszy tekst–zdjęcie.

- Referencja: obraz przekazany przez klienta 2026-08-21
- Wariant: jasne tło, dwa elementy

## Fields

| Field | Type | Required | Notes |
|---|---|---|---|
| `blockType` | `'processBehindAsset'` | yes | union discriminator |
| `heading` | `string` | yes | Nagłówek sekcji |
| `items` | `array[2]` | yes | Dwa naprzemienne elementy |
| `items[].title` | `string` | yes | Nagłówek elementu |
| `items[].subtitle` | `string` | yes | Podnagłówek elementu |
| `items[].description` | `string` | yes | Opis elementu |
| `items[].bullets` | `string[]` | yes | Lista korzyści |
| `items[].image` | `MediaImage` | yes | Obraz 620 × 489 |

## Measured geometry

| Element | Value | How it was established |
|---|---|---|
| Nagłówek sekcji | 56 / 500 | Podane przez klienta |
| Nagłówek elementu | 48 / 500 | Podane przez klienta |
| Podnagłówek | 24 / 500 | Podane przez klienta |
| Opis i lista | 16 / 400 | Podane przez klienta |
| Marker listy | 5 × 5 | Podane przez klienta |
| Proporcja zdjęcia | 620 / 489 | Wymiary plików źródłowych |

## Deviations from Figma

- Brak pliku Figma; breakpointy i odstępy wynikają z przekazanego obrazu oraz
  istniejącej siatki strony.

## Breakpoints

| Width | What changes |
|---|---|
| ≥ 1024 | Dwie kolumny; drugi element odwraca kolejność |
| < 1024 | Jedna kolumna; tekst poprzedza obraz w obu elementach |

## States

Brak stanów interaktywnych.

## Animations

Elementy używają istniejących animacji reveal/curtain zależnych od wejścia sekcji
w viewport. Przy `prefers-reduced-motion: reduce` globalne tokeny skracają ruch.

## Budget

| Item | Budget | Actual |
|---|---|---|
| JavaScript | 0 KB | 0 KB |
| Requests | 2 obrazy | 2 obrazy |
| Largest asset | plik źródłowy | do sprawdzenia po kopiowaniu |

## A11y

- Sekcja używa `h2` i `aria-labelledby`; elementy używają `h3`.
- Brak obsługi klawiatury, ponieważ blok nie jest interaktywny.
- Tekst używa tokenów Lime Dark i wariantu o kryciu 0,6.
- `alt` pochodzi z danych strony; obrazy są dekoracyjne, więc pozostaje pusty.

## Open questions

- [ ] Finalne odstępy mogą zostać doprecyzowane po otrzymaniu pliku Figma.
