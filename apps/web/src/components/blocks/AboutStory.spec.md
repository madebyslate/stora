# `<AboutStory>` — spec

## Co to jest

Pierwsza sekcja pod hero strony `about-us`: zdanie o pochodzeniu i skali Story
wewnątrz wysokiego pola fotografii. Pełnoekranowe hero nadal kurczy się do
środkowego kadru, ale sekcja nie zatrzymuje scrolla. Dwanaście rozmieszczeń
z sześciu dostarczonych zdjęć układa się w czterech pionowych torach; tory
zewnętrzne jadą do góry szybciej niż wewnętrzne, więc ruch pozostaje widoczny
przez cały naturalny przebieg sekcji.

- Punkt odniesienia ruchu: `https://waabi.ai/`, strona główna, sekcja „We built
  our own road.” — sprawdzona 2026-08-31.
- Figma: brak linku do node'a; pierwotna geometria pochodziła ze zrzutu
  1016 × 682 przekazanego 2026-08-21.
- Wariant: tylko `about-us`.

## Pola

| Pole | Typ | Wymagane | Uwagi |
|---|---|---|---|
| `blockType` | `'aboutStory'` | tak | dyskryminator unii |
| `statement` | `string` | tak | zdanie odsłaniane słowo po słowie |
| `photos` | tuple 6 × `MediaImage` | tak | sześć zdjęć treściowych; drugie użycie każdego jest dekoracyjne i ma pusty `alt` |
| `heroImage` | `MediaImage` | tak | to samo źródło co hero; statyczny następca morfowanego kadru |

## Geometria i rytm

| Element | Desktop | Mobile |
|---|---|---|
| wysokość sekcji | `clamp(72rem, 190svh, 96rem)` | `clamp(70rem, 190svh, 84rem)` |
| środkowy kadr hero | 112–156 px | 112 px |
| zdjęcia | 12 rozmieszczeń, cztery tory | te same 12, tory częściowo wychodzą poza krawędzie |
| tekst | 32 / 40 / 500, miara 720 px; przytrzymany na środku viewportu, bez tła | pełna szerokość siatki; białe tło maskuje kadry przechodzące pod literami |
| tory (x od krawędzi) | zewnętrzny 24 px, wewnętrzny 112–160 px | zewnętrzny −20 px (kadrowany), wewnętrzny 56 px |
| rzędy (y w sekcji) | 3 / 20 / 37 / 54 / 71 / 88% | 2 / 18 / 34 / 55 / 72 / 89% |
| tory zewnętrzne | dodatkowy przebieg 22 rem | dodatkowy przebieg 13 rem |
| tory wewnętrzne | dodatkowy przebieg 96 px | dodatkowy przebieg 40 px |

Zdjęcia są kwadratowymi kadrami `object-fit: cover`. Sześć pierwszych wystąpień
zachowuje opisy z fixture. Sześć powtórek służy wyłącznie gęstości kompozycji,
jest `aria-hidden` i nie rozszerza modelu danych.

## Breakpointy

| Szerokość | Co się zmienia |
|---|---|
| ≥ 1280 | tekst bez tła — tory wewnętrzne nie dosięgają miary (przy 1440 zapas 56 px) |
| < 1280 | tekst dostaje pełne tło `--color-bg`: tor 11.5vw + kadr 10vw przecinają stałą miarę 720 px w okolicy 1270 |
| ≥ 768 | cztery symetryczne tory, tekst o stałej maksymalnej mierze |
| < 768 | węższe zdjęcia, zewnętrzne tory są częściowo kadrowane przez sekcję; przy 390 wszystkie cztery tory przechodzą pod tekstem, dlatego tło jest obowiązkowe |

Centrowanie zdania robi `margin-inline: auto`, **nie** `inset-inline-start: 50%`.
Na boksie `sticky` inline-owy inset jest ograniczeniem przyklejenia, a żądane
przesunięcie jest przycinane do krawędzi bloku zawierającego: przy 1440 akapit
ma pół szerokości sceny, limit nie działa i para 50% + `translate(-50%)` trafia
na środek przypadkiem; przy 390 akapit zajmuje prawie całą scenę, przesunięcie
zostaje przycięte do ~40 px zamiast żądanych 195, a translate wyciąga zdanie
135 px za lewą krawędź ekranu. Pionowa połowa translate to jedyna realna praca.

## Animacje

| Co | Kiedy | Krzywa | `prefers-reduced-motion: reduce` |
|---|---|---|---|
| hero → środkowy kadr | pierwsze 45% ekranu scrolla | smoothstep na postępie scrolla | wyłączone; dwa statyczne bloki |
| zdjęcia w torach (dryf) | przez wejście i wyjście całej sekcji | `cubic-bezier(0.37, 0, 0.63, 1)` na `view-timeline` sekcji | brak dodatkowej transformacji; zwykły naturalny scroll |
| wejście kadru | `entry 0%` → `cover 14%` własnej osi kadru | `--ease-in-out`; `opacity` + `translate` + zoom obrazu 1.16 → 1 | wyłączone |
| wyjście kadru | `cover 86%` → `exit 100%` własnej osi kadru | `--ease-in-out`; `opacity` + `translate` + zoom 1 → 1.08 | wyłączone |
| pozycja zdania | od wejścia do wyjścia sekcji | `position: sticky`, środek viewportu | pozycja statyczna z projektu |
| słowa zdania — wejście | gdy akapit wchodzi w środkowe 56% viewportu | czasowa: 900 ms `--ease-out-expo`, start 420 ms, krok 42 ms na słowo | pełne krycie, bez przejścia |
| słowa zdania — wyjście | gdy akapit opuszcza to samo pole | czasowa: 520 ms `--ease-in-out`, krok 16 ms **od końca zdania** | pełne krycie, bez przejścia |

Nie ma pinowania sceny ani dodatkowego dystansu scrolla w `AboutStory`. Sticky
jest wyłącznie tekst na środku viewportu; zdjęcia i wysokość dokumentu pozostają
w naturalnym przepływie. Każdy kadr porusza się do góry razem z dokumentem,
a `view-timeline` dodaje tylko różnicę prędkości.

Trzy animacje leżą na jednym kadrze i współistnieją tylko dlatego, że każda ma
inną własność: dryf toru bierze `transform`, wejście i wyjście biorą `translate`
i `opacity`, zoom siedzi na `<img>` (kadrowany przez `overflow: clip` ramki).
Tryby wypełnienia są nośne — `both` na wejściu, `forwards` na wyjściu, inaczej
wyjście nadpisuje wejście przez cały czas przed swoim zakresem.

Oba zakresy sięgają poza samo przekroczenie krawędzi, w `cover`, i oba jadą na
symetrycznej krzywej S. `ease-out` dawał pełne krycie, zanim kadr skończył
wjeżdżać — to był ten „pop", którego się pozbywamy.

Zdanie **nie jest** sterowane pozycją scrolla: `IntersectionObserver` przełącza
`data-statement-in`, a resztę robią przejścia CSS. Odwracalne w obie strony bez
retriggerowania, więc powrót w górę odgrywa je jeszcze raz — dlatego to własny
obserwator, a nie współdzielony `data-reveal-group`, który odpala raz i się
rozłącza. Bez JS zdanie jest od razu w pełni czytelne (stan spoczynkowy jest
bramkowany na `html.js`).

Morfowany hero i jego statyczny następca mają warstwę ponad torami zdjęć.
Animowane są wyłącznie `transform`, `translate`, `opacity` i `filter` (rozmycie
słów). Bez obsługi scroll-driven animations zdjęcia nadal układają się poprawnie
i jadą z naturalnym scrollowaniem strony.

## Budżet

| Element | Budżet |
|---|---:|
| JavaScript | **820 B gz / 1998 B raw**, morfowanie hero + obserwator zdania |
| Źródła treściowe | 7: sześć fotografii + powtórzone źródło hero |
| Dodatkowe requesty przez powtórzenia | 0 — przeglądarka korzysta z tych samych URL-i |

## A11y

- Sekcja ma niewidoczny wizualnie `<h2>` jako nazwę regionu.
- Statement jest jednym akapitem z pełnym `aria-label`.
- Pierwsze użycie każdego zdjęcia zachowuje `alt` z fixture; powtórki i środkowy
  kadr po hero są dekoracyjne.
- Sekcja nie ma kontrolek ani nawigacji klawiaturą.

## Odstępstwa

- To świadoma korekta wcześniejszej wersji z Figmy po feedbacku klienta.
  Zamiast sześciu kadrów w przypiętej scenie jest dwanaście rozmieszczeń
  w naturalnym przepływie, inspirowanych rytmem Waabi.
- Nie dodano nowych zdjęć źródłowych. Powtórzenia istniejących kadrów utrzymują
  spójny model treści i nie wymagają tymczasowych assetów.
