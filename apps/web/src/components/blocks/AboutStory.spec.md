# `<AboutStory>` — spec

## Co to jest

Pierwsza sekcja pod hero strony `about-us`: zdanie o pochodzeniu i skali Story,
otoczone sześcioma fotografiami. Podczas przewijania hero kurczy się do kwadratu
156 × 156 px w górnej części kompozycji, pozostałe zdjęcia wchodzą do kadru,
a słowa zdania przechodzą kolejno z 0,5 do pełnego krycia. Po dotarciu hero do
kwadratu kompozycja jest przypięta na jeden dodatkowy ekran scrolla — dopiero ten
zakres steruje zdjęciami i tekstem, więc ostatnie słowo kończy ruch przed
zwolnieniem sekcji. Sama kompozycja jest wyśrodkowana pionowo w przypiętym
ekranie; na ekranie niższym niż projekt kurczy wysokość do dostępnego miejsca.

- Figma: brak linku do node'a; źródłem jest zrzut 1016 × 682 przekazany 2026-08-21
- Warianty w Figmie: jeden, tylko `about-us`

## Pola

| Pole | Typ | Wymagane | Uwagi |
|---|---|---|---|
| `blockType` | `'aboutStory'` | tak | dyskryminator unii |
| `statement` | `string` | tak | jedno zdanie odsłaniane słowo po słowie |
| `photos` | tuple 6 × `MediaImage` | tak | kolejność odpowiada sześciu stałym miejscom kompozycji |
| `heroImage` | `MediaImage` | tak | to samo źródło co hero; statyczny następca morfowanego hero |

## Zmierzona geometria

Zrzut jest eksportem ramki 1440 px do szerokości 1016 px: skala
`1440 / 1016 = 1,4173`. Potwierdzają ją obrazy: np. plik 384 px jest na zrzucie
rysowany na 181 px, czyli po przeliczeniu 256,5 px — dokładnie 2/3 eksportu.

| Element | Wartość przy 1440 | Jak ustalono |
|---|---:|---|
| wysokość sekcji | 966 px | `682 × 1,4173` |
| kwadrat hero | 156 × 156 px | podane wprost; na zrzucie 109–110 px |
| skala sześciu eksportów | 2/3 | sześć niezależnych proporcji plik → zrzut |
| tekst | 32 / 40 / 500 | podane 32/500; leading z istniejącego `--text-heading` |
| miara tekstu | 720 px | `~508 px × 1,4173`, tak aby zachować cztery linie |
| zakres przypięcia | 100 svh | jeden pełny gest scrolla na wejścia zdjęć i tekst |
| pozycja pionowa | środek viewportu | scena 966 px jest centrowana w wysokim ekranie |
| zdjęcie 1 | 194 px, x 0, y 224 | pomiar zrzutu × 1,4173 |
| zdjęcie 2 | 106 px, x 329, y 119 | j.w. |
| hero | 156 px, wyśrodkowane, y 200 | podany rozmiar + pomiar pozycji |
| zdjęcie 3 | 160 px, x 1220, y 157 | pomiar zrzutu × 1,4173 |
| zdjęcie 4 | 256 px, x 1092, y 597 | j.w. |
| zdjęcie 5 | 194 px, x 475, y 683 | j.w. |
| zdjęcie 6 | 184 px, x 64, y 574 | j.w. |

## Odstępstwa od Figmy

- Zrzut pokazuje inny środkowy kadr niż aktualne hero About Us, ale brief mówi
  wprost, że ma to być **to samo zdjęcie co w hero**. Implementacja używa więc
  `about-us-hero.jpg`, a nie zgaduje brakującego pliku z rastra.
- Brak projektu mobile. Układ zachowuje kolaż, lecz skaluje i przesuwa zdjęcia,
  aby żadne nie powodowało poziomego przelewu, a tekst pozostał czytelny.

## Breakpointy

| Szerokość | Co się zmienia |
|---|---|
| ≥ 1440 | geometria 1:1 ze zrzutem po przeliczeniu do ramki 1440 |
| 768–1439 | cała kompozycja skaluje się względem szerokości ramki |
| < 768 | osobna, wyższa kompozycja; hero nadal kończy jako kwadrat, zdjęcia są odsunięte od tekstu |

Przy każdym breakpoincie scena jest wyśrodkowana pionowo w `100svh`. Gdy viewport
jest od niej niższy, jej wysokość jest ograniczona do wysokości viewportu, więc
nie powstaje dodatkowe obcięcie.

## Stany

Brak elementów interaktywnych. Zdjęcia są treścią ilustracyjną i biorą `alt`
z fixture'a.

## Animacje

| Co | Kiedy | Czas | Krzywa | `prefers-reduced-motion: reduce` |
|---|---|---|---|---|
| hero → kwadrat | podczas jednego ekranu scrolla poprzedzającego sekcję | zależny od scrolla | liniowa względem scrolla | wyłączone; od razu układ końcowy |
| pin kompozycji | po zakończeniu morfowania hero | 100 svh scrolla | — | wyłączony |
| zdjęcia | pierwsza połowa przypiętego zakresu, z osobnymi progami | zależny od scrolla | `--ease-out-expo` dla postępu wejścia | od razu stan końcowy |
| słowa zdania | przez prawie cały przypięty zakres | zależny od scrolla | liniowa względem scrolla | pełne krycie |

Animowane są wyłącznie `transform` i `opacity`. Niejednolita skala zewnętrznego
pudełka zmienia pełnoekranowe hero w kwadrat; obraz w środku dostaje przeciwną
skalę obu osi, więc fotografia nie jest rozciągana.

## Budżet

| Element | Budżet | Faktycznie |
|---|---:|---:|
| JavaScript | ≤ 1 KB gz | 717 B gz / 1882 B raw, inline |
| Requesty | 7 obrazów, wszystkie poniżej folda poza już pobranym hero | 7 kandydatów wybieranych przez przeglądarkę |
| Największy asset | ≤ 150 KB po optymalizacji Astro | 20 233 B AVIF (zdjęcie 5) |

Lokalny skrypt jest uzasadniony, bo musi w każdej klatce znać rzeczywisty
prostokąt miejsca docelowego i skoordynować transform istniejącego, sąsiedniego
`PageHero`; sam CSS nie potrafi odczytać prostokąta elementu z innego bloku.

Bez JavaScriptu sekcja nie jest przypięta i pokazuje stan końcowy. Dzięki temu
brak skryptu nie daje pustego, podwójnie wysokiego bloku. Ta sama statyczna ścieżka
obowiązuje przy `prefers-reduced-motion: reduce`.

## A11y

- Sekcja ma niewidoczny wizualnie `<h2>` jako nazwę regionu; statement jest akapitem.
- Brak nawigacji klawiaturą, bo blok nie ma kontrolek.
- Nieodsłonięta połowa tekstu ma 0,5 Lime-Dark na bieli i jest dużym tekstem;
  wartość jest częścią briefu, a wynik kontrastu trzeba zmierzyć przy audycie.
- `alt` pochodzi z `photos[]`; powtórzone zdjęcie hero ma pusty `alt`, bo hero
  opisało już ten sam kadr bezpośrednio nad sekcją.

## Otwarte pytania

- [ ] Czy środkowe zdjęcie z makiety ma zastąpić aktualny kadr hero, czy brief
  celowo wygrywa z widocznym na zrzucie eksportem?
- [ ] Czy na mobile kwadrat końcowy nadal ma dokładnie 156 px, czy powinien zejść
  do 112 px razem z resztą kolażu?
