# `<GrowthTimeline>` — spec

## Co to jest

Trzecia sekcja strony `about-us`: czteropunktowa oś czasu pokazująca drogę od
założenia Story w Polsce do ekspansji paneuropejskiej. Ostatni punkt opisuje
przyszłość i dlatego pozostaje wyróżniony w stanie spoczynku.

- Figma: brak linku do node'a; źródłem jest zrzut 1461 × 693 przekazany 2026-08-21
- Warianty w Figmie: jeden, tylko `about-us`

## Pola

| Pole | Typ | Wymagane | Uwagi |
|---|---|---|---|
| `blockType` | `'growthTimeline'` | tak | dyskryminator unii |
| `heading` | `string` | tak | nagłówek sekcji |
| `items` | tuple 4 × item | tak | cztery etapy w kolejności chronologicznej |
| `items[].title` | `string` | tak | nazwa etapu nad osią |
| `items[].period` | `string` | tak | rok, przedział albo „Next” |
| `items[].description` | `string` | tak | krótki opis etapu |
| `items[].icon` | enum | tak | `poland`, `bolt`, `arrow`, `globe` |

## Zmierzona geometria

| Element | Wartość przy 1440 | Jak ustalono |
|---|---:|---|
| nagłówek | 56 / 64 / 500 | podane wprost; leading istniejącego `--text-title` |
| nagłówek → kroki | 80 px | podane wprost |
| tytuł kroku | 28 / 36 / 500 | podane 28/500; leading istniejącego `--text-card-title` |
| średnica punktu | 64 px | podane wprost |
| pole ikony | 14–31 px | korekta po przeglądzie realnego renderu 2026-08-21: strzałka 14, Polska 24, błyskawica 22, globus 31; rozmiary kompensują bardzo różne viewBoxy i wewnętrzne marginesy, a każdy glif zachowuje proporcje |
| linia i border | Lime-Dark 40% | podane wprost |
| okres | 16 / 24 / 500, Lime-Dark 60% | rozmiar, grubość i krycie podane; leading istniejącego `--text-detail` |
| opis | 16 / 24 / 400, Lime-Dark 60% | „taki sam, tylko 400”; leading wspólny z okresem |
| padding inline | siatka strony, min. 20 px | brief podaje 20; `container-page` schodzi do 20 na mobile i utrzymuje wspólną krawędź 40 na desktopie |

## Odstępstwa od Figmy

- Na desktopie sekcja trzyma wspólną siatkę strony 1360/40 zamiast stałego
  paddingu 20 px. To istniejąca reguła całego projektu; poniżej 1440 gutter
  płynnie schodzi do podanych 20 px.
- Opisy przy 60% Lime-Dark mają niższy kontrast niż wymagane 4,5 : 1 dla tekstu
  16 px. Wartość zostaje jak w briefie w szybkim zakresie przed audytem.

## Breakpointy

| Szerokość | Co się zmienia |
|---|---|
| ≥ 1024 | cztery równe kolumny na jednej poziomej osi |
| 768–1023 | cztery kolumny zostają, typografia i odstępy korzystają z płynnej skali |
| < 768 | oś obraca się pionowo; tytuł, okres i opis stoją obok kolejnych punktów |

## Stany

- Domyślnie aktywny jest czwarty krok: tytuł i okres są Green, a punkt ma Green
  na tle i borderze oraz biały glif. Opis pozostaje Lime-Dark 60%.
- Na urządzeniu ze wskaźnikiem hover chwilowo przekazuje aktywność wskazanemu
  krokowi. Po zejściu wskaźnika aktywny wraca krok czwarty.
- Kroki nie są kontrolkami i nie dostają sztucznego fokusu: hover nie zmienia
  treści ani nie uruchamia akcji.

## Animacje

| Co | Kiedy | Czas | Krzywa | `prefers-reduced-motion: reduce` |
|---|---|---|---|---|
| nagłówek | wejście sekcji w viewport | 900 ms | `--ease-out-expo` | od razu stan końcowy |
| linia osi | po nagłówku | 900 ms | `--ease-out-expo` | od razu stan końcowy |
| cztery kroki | kolejno za rysowaną linią | 900 ms każdy, stagger 90 ms | `--ease-out-expo` | od razu stan końcowy |
| stan hover | wskazanie kroku | 250 ms | `--ease-standard` | zachowany jako prosta zmiana koloru |

Animowane są wyłącznie `transform` i `opacity`. Sekcja korzysta ze wspólnego
`data-reveal-group`; bez JavaScriptu treść pozostaje widoczna.

## Budżet

| Element | Budżet | Faktycznie |
|---|---:|---:|
| JavaScript lokalny | 0 B | 0 B |
| Requesty | 0 | 0 |
| Assety | inline SVG | 4 małe ścieżki w HTML |

## A11y

- Sekcja ma `<h2>` i `aria-labelledby`; etapy są uporządkowaną listą.
- Ikony są dekoracyjne (`aria-hidden`), bo tę samą informację podają tytuły.
- Brak nawigacji klawiaturą: blok nie zawiera akcji.
- Zielony aktywny tytuł 28 px spełnia próg dużego tekstu; kontrast wyciszonego
  copy zostaje do odłożonego audytu.

## Otwarte pytania

- [ ] Czy po audycie opis ma zachować 60% krycia, czy podnieść je do wartości
  przechodzącej 4,5 : 1?
- [ ] Czy na tabletach oś ma już przechodzić w pion, jeśli realne copy okaże się
  dłuższe od tekstu ze zrzutu?
