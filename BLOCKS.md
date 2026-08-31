# BLOCKS

Stan bloków. Aktualizujesz przy każdym commicie dotykającym bloku.

Blok jest `done` dopiero, gdy przeszedł WSZYSTKIE punkty 5–7 z AGENT-RULES §3:
porównanie ze screenshotem z Figmy (±2 px), snapshot Playwright (desktop +
mobile) i Lighthouse bez regresji.

| Blok | Status | Strony | JS (gz) | Uwagi |
|---|---|---|---|---|
| `Header` | 🟢 done | wszystkie | 514 B gz inline | Dwa tony wejściowe (`on-media` / `default`); nagłówek pozostaje nieruchomy od pierwszej klatki i przy pierwszym scrollu natychmiast przechodzi w jasny wariant z ciemnym CTA. Menu kompaktowe < 1024 px ma widoczny biały przycisk zamknięcia ponad ciemnym panelem oraz sekwencyjne wejście linków; nie ma pokrycia w Figmie. Roll linków desktopowych trwa 450 ms. Testy zachowania: `header.spec.ts`. |
| `Hero` | 🟢 done | `home` | 604 B inline | Zgodny z klatką 1440 do 1–2 px w pionie i 1 px na szerokościach ink. Odstępstwa i pomiary: `Hero.spec.md`. |
| `LogoWall` | 🟢 done | `home`, `about-us` | 352 B inline (wspólny obserwator) | Logotypy tworzą bezszwowo zapętlone marquee ograniczone do wspólnego `inner`, bez lokalnego JS; trzy zestawy o szerokości własnej treści z jednym stałym odstępem 64 px, także na szwie (DECISIONS 2026-08-31, PLAYBOOK P-039). Dwa zestawy są ukryte semantycznie, a `prefers-reduced-motion` przywraca pełną statyczną siatkę. Testy bloku: 16/16 (desktop + mobile), snapshoty bez regresji. Lighthouse Home: 100/96/100/100, About Us: 100/96/100/100. `LogoWall.spec.md`. |
| `ServiceCards` | 🟡 in progress | `home` | **0 B** | Trzy obszary jako pełnoekranowe kafle, rozwijane bez ani jednej linii JS. Rząd jest full-bleed do 1440 px, a na ultrawide zostaje wycentrowany na maksymalnej szerokości 1440 px (3 × 480), zamiast rozciągać fotografie. Geometria z ramki, kontrast zmierzony pod glifami (najgorszy 5,01 przy progu 4,5) — kosztem dwóch wartości z Figmy. Zostały snapshoty i Lighthouse. `ServiceCards.spec.md`. |
| `OurProcess` | 🟡 in progress | `home` | **0 B lokalnego** | Cztery kroki w sekcji przypiętej na scroll, sterowane jedną `view-timeline`. Sekcja ma 300 vh zamiast 560 vh, więc aktywna droga kółka spadła z 460 do 200 vh. Globalny Lenis wygładza wejście kółka, a liniowa oś bloku nie nakłada na nie drugiego zwolnienia. Wymiana zdjęć zachowuje dotychczasowe ~33 vh, ale martwy odcinek pomiędzy wymianami spadł z ~33 do ~8 vh. Zdjęcia nadal tworzą szczelną **taśmę**, nie przenikanie. `OurProcess.spec.md`. |
| `TeamGrid` | 🟡 in progress | `home`, `about-us` | **0 B** | Cztery portrety ze współdzielonej listy; About Us nadpisuje tylko nagłówek. Jeden kafel zawsze wyróżniony — najechanie przekazuje wyróżnienie dalej, bez linii JS. Na prośbę klienta kafle nie renderują znaków LinkedIn i nie udają kontrolek klawiaturowych. Stan spoczynku i wyróżniony to **jedno jednolite `scale()`** na jednym elemencie, bo kafel niesie proporcję portretu (36/43). Zmierzone: portret 180,02 × 215,01 przy 1440. Kosztuje 7 px wysokości kafla — powód w `TeamGrid.spec.md`. Zostały snapshoty, Lighthouse i kontrast (odłożone na prośbę klienta). |
| `WiderTeam` | 🟡 in progress | `about-us` | **0 B** | Dziewięć portretów w pięciu kolumnach, bez LinkedIna i bez domyślnie aktywnego kafla na desktopie. Na mobile wszystkie kafle są od razu powiększone, z gradientem i białym tekstem; pilnuje tego test stanu dziewięciu kart. Zostało porównanie wizualne i pełny pakiet testów, odłożone na prośbę klienta. |
| `MarketSlider` | 🟡 in progress | `home` | 470 B gz inline | Slider bez JS: grupa radio → `--active` → dwie taśmy (zdjęcia i pary strzałek). Geometria odtworzona z kadru rysowanego w skali 0,6 — skala potwierdzona trzema niezależnymi drogami. Zmierzone na zbudowanej stronie przy 1440: skrzynka 1360, pasmo nagłówka 197, zdjęcie 640 × 640 na x = 400, przyciski 40 × 40 z 1 px przerwy, dosunięte do prawej krawędzi zdjęcia i do linii pod tytułem, opis 22/28/500 w mierze 296, opis → przycisk 40. Nowy stopień skali `--text-claim`. Gest przeciągania (palec i mysz) + trzy zamknięte drogi na wyciągnięcie zdjęcia poza stronę. Opis wjeżdża **słowo po słowie** przy każdej zmianie slajdu, zdjęcie odmaskowuje się z lewej. Dwa slajdy używają nowych materiałów 960 × 960: wykresu OZE/BESS i mapy `Poland-s4`. Zostały snapshoty i Lighthouse. `MarketSlider.spec.md`. |
| `AudienceTabs` | 🟡 in progress | `home`, `about-us` | **0 B** | Współdzielona 1:1 sekcja „Store energy at large scale”. Trzy pytania, trzy zdjęcia, trzy calle — przełącznik bez JS: radio w środku labela, więc stan aktywny i fokus to po jednej regule, a nie po jednej na pozycję. Na mobile wszystkie opcje są widoczne jako kompaktowe wiersze z licznikiem, regułą i strzałką aktywnego stanu; nie wymagają już odkrycia poziomego scrolla. Całe zdjęcie jest linkiem, przycisk w rogu to tylko afordancja (`Button as="span"`). Nieaktywne panele są `visibility: hidden`, więc w kolejności tabulacji jest dokładnie jeden link — zmierzone. Zmierzone przy 1440: pasmo 1360 × 500, połowy 675 z 10 px przerwy, tło `rgb(241,242,235)`, pytanie 40/500/-0,8 px w rytmie 80,24, przycisk 40 wysokości w wcięciu 39,7 / 39,8, nagłówek 56/64 z 48 do pasma i 120 nad nim, pod nim zero. Test mobile przechodzi dla Home i About Us; Lighthouse obu stron: 100/96/100/100, LCP 1,73 s, TBT 0, CLS 0. Mobilne snapshoty wymagają akceptacji nowego wariantu. `AudienceTabs.spec.md`. |
| `PageHero` | 🟢 done | `about-us`, `brokerage`, `develop-to-sell`, `develop-to-hold` | **0 B** | Hero podstrony: zdjęcie, `<h1>` 72/500 i linia 28/36 wyśrodkowane 72 px nad stopą bloku, wysokość `100svh` jak na home. Efekt „następna sekcja najeżdża na hero" to `position: sticky` + `z-index: -1` — bez linii JS, i wyłączony przy `prefers-reduced-motion`. Zmierzone przy 1440 × 900 na zbudowanej stronie: blok 900, nagłówek 72/72 na 700, linia na 792 (odstęp 20), stopa 828 → 900 (72); test na 1440 × 1100 pilnuje wysokości 1100 na wszystkich czterech podstronach. Własne scrimy, głębsze niż na home — najgorszy zmierzony kontrast pod glifami: nagłówek 3,39, linia 5,08, nawigacja 5,08 (4 strony × 5 szerokości). Snapshoty desktop + mobile, Lighthouse 100/100/100/100 na wszystkich czterech adresach. `PageHero.spec.md`. |
| `AboutStory` | 🟡 in progress | `about-us` | **763 B gz inline przed ostatnią korektą** | Pierwsza sekcja pod hero: sześć zdjęć treściowych daje dwanaście rozmieszczeń w czterech pionowych torach. Scena nie jest pinowana: kadry płyną w naturalnym scrollu, a natywna `view-timeline` przesuwa zewnętrzne tory szybciej od wewnętrznych. Tekst sam pozostaje na środku viewportu, z niewidoczną białą maską pod literami. `PageHero` kończy kwadrat już po 45% pierwszego ekranu scrolla i wraz z kadrem docelowym jest nad pozostałymi zdjęciami. Powtórki są dekoracyjne, nie dodają requestów ani pól CMS. Mobile kadruje skrajne tory bez poziomego przelewu. `AboutStory.spec.md`. |
| `GrowthTimeline` | 🟡 in progress | `about-us` | **0 B lokalnego** | Trzecia sekcja About Us: cztery etapy na poziomej osi, ostatni domyślnie aktywny; hover przekazuje wyróżnienie tytułu, okresu i punktu, a opis pozostaje wyciszony. Glify mają osobne rozmiary odpowiadające realnej geometrii SVG (strzałka 14, Polska 24, błyskawica 22, globus 31), pełny globus zawiera kontynenty. Linia odmaskowuje się od lewej, a punkty i copy wchodzą sekwencyjnie przez wspólny obserwator sekcji, bez lokalnego JS. Poniżej 768 oś przechodzi w pion. Typecheck czysty; snapshoty, Lighthouse i pełny audyt kontrastu odłożone na prośbę klienta. `GrowthTimeline.spec.md`. |
| `MetricStatement` | 🟢 done | `about-us`, `brokerage`, `develop-to-sell`, `develop-to-hold` | **0 B** | Na About Us wariant treści `Credibility` / `~1 GW`; geometria wspólna. Nagłówek 56/64, pod nim figura 300 px w Lime-Dark na 0,1 i zdanie 28/36 w kolumnie 480 dosuniętej do prawej krawędzi siatki. Zmierzone przy 1440: 120 padding, nagłówek na 1020, figura na 1120 (odstęp 36), tekst na 1192 (72 poniżej szczytu figury), kolumna 920–1400, sekcja 640. Figura jest `aria-hidden` — 1,2 : 1 to tło, a nie tekst; liczba wraca słowami w zdaniu obok i test pilnuje obu połówek. `MetricStatement.spec.md`. |
| `FeaturePair` | 🟡 in progress | `brokerage`, `develop-to-sell`, `develop-to-hold` | **0 B** | Dwa kafle 465 px z odstępem 10 px i paddingiem 53 px. Rząd jest full-bleed do 1440 px, a na ultrawide zostaje wycentrowany na maksymalnej szerokości 1440 px (2 × 715 + 10), zamiast rozciągać fotografie. Pierwszy opis jest widoczny domyślnie; hover przesuwa całą grupę tekstu i przekazuje stan drugiemu. Nagłówek, tytuły i aktywny opis wchodzą wyraz po wyrazie co 26 ms; opis odtwarza falę przy każdej zmianie aktywnego kafla. Zdjęcia są absolutnymi warstwami `cover`, bez wpływu proporcji pliku na rysowany kadr. Gradient 275 px zgodny z wartością klienta, wykorzystane sześć właściwych zdjęć z `_inbox/zdjecia/podstrony-boxy`. Testy odłożone na prośbę klienta. `FeaturePair.spec.md`. |
| `TechnicalDepthTabs` | 🟡 in progress | `brokerage`, `develop-to-hold` | **0 B** | Dwa lub trzy aktywne przełączniki radio: 18/500 z licznikiem i animowaną strzałką, opis 32/500 + 16/400 oraz kwadratowe media 560. Obsługuje fotografie i SVG; desktop 680/120/560, poniżej 1024 układ składa się w jedną kolumnę. Zmiana stanu odmaskowuje nowe medium dwuwarstwową kurtyną i podmienia opis bez JS. Testy odłożone na prośbę klienta. `TechnicalDepthTabs.spec.md`. |
| `MarketFlexibility` | 🟡 in progress | `develop-to-hold` | **0 B** | Sekcja na tle Lime-Mist z nagłówkiem 56/500 i opisem 16/400 na 0,6. Biały panel z lewym wyrównaniem i paddingiem 55 px mieści dwa dostarczone SVG pod tytułami 24/500, rozdzielone linią `#E0E0E0`; poniżej 1024 kolumny składają się pionowo. Nagłówki, opis, panel i oba SVG wchodzą wspólną sekwencją reveal bez lokalnego JS. Testy odłożone na prośbę klienta. `MarketFlexibility.spec.md`. |
| `HowWeDevelop` | 🟡 in progress | `develop-to-sell`, `about-us` | **0 B** | Jedna współdzielona treść i geometria etapów rozwoju; Dev-to-Sell ma wariant biały, About Us wariant Lime-Dark z białymi nagłówkami i opisami na 0,6 oraz aktywną zakładką Green. Padding 120, nagłówek 56/500, trzy zakładki 30/500 i zdjęcia 974:564. Desktop 560/120/680. Zmiana etapu odmaskowuje medium bez JS. Testy odłożone na prośbę klienta. `HowWeDevelop.spec.md`. |
| `FeaturedPublications` | 🟡 in progress | `about-us`, `develop-to-sell` | **0 B lokalnego** | Wspólny placeholder czterech publikacji po `HowWeDevelop`: nagłówek 56/500 odsłaniany maską, następnie cztery boksy wchodzą sekwencyjnie przez wspólny obserwator sekcji. Siatka 4/2/1, padding 32, rytm 24, border `#E0E0E0`, dostarczone logo Forbes i ciemny wariant wspólnego przycisku. Testy, Lighthouse i audyt kontrastu odłożone na prośbę klienta. `FeaturedPublications.spec.md`. |
| `ProcessBehindAsset` | 🟡 in progress | `develop-to-sell` | **0 B** | Biała sekcja z nagłówkiem 56/500 i dwoma naprzemiennymi wierszami. Tytuły 48/500, podnagłówki 24/500, opis i listy 16/400 na 0,6, markery 5 × 5 oraz obrazy 620:489. Wejście tekstów, markerów i zdjęć jest sekwencyjne; bez JS. Testy odłożone na prośbę klienta. `ProcessBehindAsset.spec.md`. |
| `ProcessIntroduction` | 🟡 in progress | `brokerage`, `develop-to-sell` | ≤ **1 KB** | Lewa kolumna z nagłówkiem 56/500 i fotografią 870:515, prawa z trzema punktami 01–03. Desktop 560/120/680, tło `#F1F2EB`, rytm 30/34/64/42 zgodny z briefem. Wejście: maskowany tytuł, 1,3-sekundowe ukośne odmaskowanie uruchamiane dopiero po wejściu kadru w viewport i zdekodowaniu obrazu oraz sekwencyjne punkty z rysowanymi liniami; wyłącznie transform/opacity. Testy odłożone na prośbę klienta. `ProcessIntroduction.spec.md`. |
| `EngagementComparison` | 🟡 in progress | `brokerage` | **0 B** | Porównanie Retained / Ad-Hoc z sześcioma wierszami, dostarczonymi SVG statusów i osobnym zielonym CTA, bez lokalnego JS. Nagłówek wchodzi maską, kafle pakietów i wiersze sekwencyjnie, a CTA ma osobny trigger wejścia, żeby animacja nie kończyła się pod foldem. Desktop odpowiada kompozycji referencji; mobile składa każdy tytuł nad parą wartości. Typecheck, lint, build oraz oględziny 1440/390 czyste; snapshoty, Lighthouse i pełny audyt kontrastu odłożone na prośbę klienta. Dwie wartości kontrastu wynikające z briefu zapisane w decyzjach. `EngagementComparison.spec.md`. |
| `ProofPoints` | 🟡 in progress | `brokerage`, `develop-to-sell`, `develop-to-hold` | **0 B** | Wspólna sekcja końcowa na Lime-Dark: tytuł 56/500, siatka 2–3 metryk 72/500, dostarczona grafika 573/578 × 548 i wspólna wizytówka Michała 92 × 92 z paddingiem 14. Wizytówka jest jawnie wyrównana do lewej, nazwisko ma 24/500, a wrappery utrzymują rasterowe `<picture>` i SVG w tej samej geometrii. Nagłówek, grafika, metryki i wizytówka wchodzą wspólną sekwencją reveal bez lokalnego JS. Snapshoty, Lighthouse i kontrast odłożone na prośbę klienta. Zielony mail 14 px ma 3,09:1 i czeka na decyzję grafika. `ProofPoints.spec.md`. |
| `Cta` | 🟡 in progress | wszystkie | **0 B** | Domknięcie strony, **globalne** (`site.cta`), nie blok — renderuje je `BaseLayout` wewnątrz `<main>`. Linia wspierająca jest opcjonalna; po jej usunięciu przycisk zachowuje istniejący odstęp 48 px od nagłówka. Zmierzone przy 1440: padding 120/120, znak 116, znak → nagłówek 48, nagłówek 72/72. Przycisk odwrócony (ciemne tło, biały tekst) przez nadpisanie jego własnych tokenów na wrapperze; na hoverze dzieli wspólne odmaskowanie Green. Dwa nowe stopnie skali: `--text-standfirst` i `--text-detail`. Zostały snapshoty, Lighthouse i kontrast (odłożone na prośbę klienta). `Cta.spec.md`. |
| `Footer` | 🟡 in progress | wszystkie | **0 B** | Trzy kolumny rozdzielone kreskami na pełną wysokość bloku — dlatego padding siedzi na kolumnach, a nie na kontenerze: kreska jest krawędzią kolumny, więc sięga bordera i stopy z konstrukcji, a nie z dobranej pary liczb. Stopka ma własne etykiety nawigacji dla tych samych celów co header, ponieważ klient zatwierdził osobne nazwy `IPP Portfolio` i `IPP Pipeline`. Zmierzone przy 1440: kreski 463,2 / 759,9 (projekt 463 / 759), padding 64/64, rytm nawigacji 40, grupa → grupa 72, podział kolumn kontaktowych 256. Etykiety grup mają 3,04:1 — wartość z projektu, pytanie w spec-u. `Footer.spec.md`. |

Legenda: ⚪ todo · 🟡 in progress · 🟢 done

> Staging etapu 1 publikuje wyłącznie istniejące strony. Planowane CTA do
> `/contact/`, `/industry-insights/` i `/join-us/` mają w fixtures
> `disabled: true`: pozostają widoczne do oceny projektu, ale nie renderują
> `href` i nie trafiają do kolejności klawiatury. Pilnuje tego
> `tests/visual/published-links.spec.ts`.

> `PageHero` i `MetricStatement` przeszły komplet z AGENT-RULES §3: pomiar
> pikselowy kontra ramka (metoda i arytmetyka w spec-ach), snapshoty Playwright
> desktop + mobile, Lighthouse na czterech nowych adresach — wszystkie
> 100/100/100/100, najgorsze LCP 1,80 s — i pomiar kontrastu pod glifami, którego
> Lighthouse nie umie wykonać.
>
> Kontrast był tu realnym problemem, nie formalnością, i to **dwa razy**. Na
> scrimach ze strony głównej standfirst Dev-to-Sell mierzy 3,56 : 1 przy
> wymaganych 4,5 (białe kontenery bateryjne dokładnie pod tekstem), a nagłówek
> About us 2,91 : 1 przy 3. Po pogłębieniu dolnego scrimu wyszła druga usterka —
> nawigacja na 4,28 : 1, jasne niebo pod headerem tego samego zdjęcia. Oba
> tokeny są najpłytszymi punktami przemiatania, które mieszczą się nad progiem
> z ~13% zapasu; obie tabele są w `PageHero.spec.md`.
>
> Jeden błąd był niewidoczny dla każdego pomiaru DOM-u i złapał go dopiero
> snapshot: zagnieżdżony ujemny `z-index` (sekcja -1, warstwa tła -1) wyłącza
> malowanie zdjęcia w Chromium przy komplecie zielonych asercji o `<img>`.
> `PLAYBOOK.md` `P-031`, plus asercja wprost w `page-hero.spec.ts`, żeby awaria
> nazywała przyczynę.
>
> Zdjęcia mają 1440 × 900 — pokrywają kadr 1440 w 1×, więc na ekranie 2× i na
> każdym viewporcie szerszym niż 1440 fotografia jest skalowana w górę. Mastery
> ≥ 2880 naprawiłyby to bez zmiany kodu. Ta sama uwaga, którą noszą już
> `ServiceCards` i `TeamGrid`.
>
> Otwarte pytania do grafika (żadne nie blokuje, każde ma zaimplementowaną
> odpowiedź domyślną) są na końcu obu spec-ów. Najważniejsze: nagłówek
> `Leader, not broker` jest identyczny na wszystkich trzech ramkach — czy to
> treść, czy wklejka; oraz krawędź sekcji, która w **tej samej** ramce co header
> na 40 px siedzi na ~55.

> `Header`, `Hero` i `LogoWall` przeszły komplet z AGENT-RULES §3: porównanie
> z klatką (pomiar pikselowy, nie „na oko"), snapshoty Playwright desktop +
> mobile, Lighthouse 100/100/100/100 na mobile i desktopie. Dodatkowo `Hero` ma
> test kontrastu tekstu na wideo, którego Lighthouse nie umie wykonać — patrz
> `PLAYBOOK.md` `P-018`.
>
> `LogoWall` dostał ramkę tylko jako zrzut 1189 × 376, bez linku do node'a. Skala
> eksportu (1,2111) jest wyliczona trzema niezależnymi drogami — wysokość wersalika
> kontra `sCapHeight` z pliku fontu, podany padding 120 px i proporcja logotypów do
> ich PNG-ów — i wszystkie trzy się zgadzają. Metoda jest opisana w spec-u; przy
> następnym zrzucie bez linku idzie się tą samą drogą, a nie „na oko".
>
> Otwarte pytania do grafika (nie blokują, każde ma zaimplementowaną odpowiedź
> domyślną) są wypisane na końcu `Hero.spec.md` i `LogoWall.spec.md`. Najważniejsze
> z nowych: lewa krawędź sekcji (ramka mówi ~56 px, siatka strony 40) i podpis,
> który w projekcie urywa się w połowie zdania.
>
> `ServiceCards` ma zamknięte: geometrię (odtworzoną z ramki, metoda w spec-u),
> rozwijanie i zwijanie, animację wejścia, klawiaturę, kontrast i `pnpm verify`.
> Do `done` brakuje snapshotów Playwright i Lighthouse.
>
> Kontrast był realnym problemem, nie formalnością. Para z Figmy — scrim
> 0,48/0,48/0,56 pod opisem na 70% bieli — daje pod glifami **3,21 : 1** przy
> wymaganych 4,5. Co ważne, **samo podbicie tekstu tego nie ratuje**: przy 100%
> bieli i nietkniętym scrimie wychodzi 4,70, i to tylko dlatego, że tekst jest już
> czysto biały, czyli znika różnica tonalna między tytułem a opisem, którą projekt
> wyraźnie robi. Ruszyły więc obie wartości, każda możliwie mało (scrim → 0,56/0,63,
> opis → 0,85), co daje najgorszy przypadek 5,01 przy ~10% zapasu. Tabela z siatką
> wariantów i pomiarami jest w spec-u; oba tańsze warianty jednopokrętłowe są
> o jeden token stąd.
>
> Zdjęcia są na miejscu, ale mają 612 × 600 i 528 × 600 przy kaflu 480 × 600 —
> pokrywają go w 1×, więc na ekranie 2× fotografia jest miękka. Mastery ≥ 960 px
> naprawiłyby to bez zmiany kodu.
>
> `TeamGrid` ma zamknięte: geometrię, wyróżnianie, klawiaturę, animację wejścia
> i `pnpm verify`. Wszystkie podane wartości odczytane z realnego renderu, nie
> „powinno być ok": tło sekcji `rgb(241,242,235)`, tło kafla `rgb(228,229,220)`,
> odstęp kafli 10 px, nagłówek 56/64, nagłówek → rząd 48 px, padding 16 px,
> imię → stanowisko 4 px, przyciemnienie 120 px, ikonka `rgb(171,173,158)`
> w spoczynku i biała po wyróżnieniu, opis `rgba(255,255,255,0.6)`.
>
> Jedno odstępstwo i jest świadome: kafel ma 397 px zamiast 390. Ramka rysuje
> rząd o szerokości ~1331 px przy marginesach ~55, a strona ma siatkę 1360/40 —
> ta sama rozbieżność, którą `LogoWall.spec.md` już zgłosił. Poszerzenie rzędu
> musi gdzieś oddać 1,8%: albo w wysokości kafla, albo w proporcji portretu.
> Oddane w wysokości, bo 36/43 zostało podane wprost, a 390 odczytane z klatki
> o węższym rzędzie — i bo wspólna proporcja kafla i portretu jest tym, co robi
> z dwóch stanów jedno `scale()`.
>
> Kurtyna wejścia miała tę samą usterkę, którą `ServiceCards` już naprawił:
> apertura musi być na panelu, nie na kaflu, inaczej portret jest widoczny od
> pierwszej klatki i wygląda, jakby wjeżdżało samo tło. Złapane dopiero na
> klatce pośredniej (90 ms) — statyczny zrzut stanu końcowego tego nie pokaże.
>
> Zdjęcia mają 486 × 585 przy kaflu 332,5 × 397 — pokrywają go w 1×, więc na
> ekranie 2× wyróżniony portret jest miękki. Mastery ≥ 700 px naprawiłyby to bez
> zmiany kodu.
>
> **Brakuje adresów LinkedIn.** Bez nich znacznik nie jest linkiem, a link jest
> jedynym elementem fokusowalnym kafla — czyli sekcja działa myszą, ale nie
> klawiaturą. To luka w treści, nie w kodzie: cztery adresy w `home.json`
> zamykają ją bez dotykania komponentu.

> `OurProcess` jest pierwszą sekcją sterowaną pozycją scrolla i **nie kosztuje ani
> bajta JavaScriptu**: przypięcie to `position: sticky`, a cała sekwencja to jedna
> `view-timeline` na sekcji czytana w zakresie `contain` — dla elementu wyższego
> niż okno ten zakres to dokładnie okno przypięcia. Okna kolejnych kroków zachodzą
> na siebie o pół rozpiętości, więc wyjście jednego kroku i wejście następnego to
> **ten sam** kawałek scrolla, a wszystkie okna są równe — stąd jeden komplet
> keyframe'ów opisuje każdy krok. Metoda: `PLAYBOOK.md` `P-025`, decyzja:
> `DECISIONS.md`.
>
> Zdjęcia nie przenikają się — jadą taśmą. Panel wychodzący i wchodzący są liczone
> z tego samego znormalizowanego postępu, więc stopa jednego jest zawsze głową
> drugiego, **pod dowolną krzywą**: przy wyjściu −100·e i wejściu 100·(1−e) różnica
> to dokładnie jedna wysokość panelu, niezależnie od `e`. Dlatego zamiana nie ma
> ani szwu, ani dziury, ani dwóch zdjęć na pół krycia.
>
> Tekst schodzi ze sceny, **zanim** zdjęcia zaczną się wymieniać, i wchodzi, gdy
> skończą. To nie jest kosmetyka: biała kopia nazwy jest przycięta do kadru, nie do
> zdjęcia, więc nad pustym kadrem byłaby bielą na bieli — i jeszcze zasłaniałaby
> ciemną kopię, która akurat tam jest czytelna.
>
> Pierwsza wersja tej sekcji była do wyrzucenia i warto wiedzieć dlaczego, bo to
> jedna przyczyna, nie cztery. `overflow: clip` i `scale(1.08)` siedziały na tym
> samym elemencie — czyli skalowała się apertura razem ze zdjęciem. Zmierzone
> 18 px wycieku na stronę: zdjęcie wchodziło pod kwadracik z numerem, uciekało
> z lewej krawędzi opisu, a granica biel/ciemność przestawała trafiać w krawędź
> fotografii, przez co „H" w „Data-Heavy" było przecięte w złym miejscu. Trzy
> zasady, które z tego wynikły, są w spec-u; klasa błędu w `PLAYBOOK.md` `P-026`.
>
> Zamiast snapshotu — **przemiatanie**: 101 pozycji scrolla przez całe przypięcie,
> a na każdej **dziesięć** niezmienników (jedna cyfra w płytce, jeden opis w oknie,
> jedna połowa nazwy w aperturze, kadr w pełni pokryty, płytka nie przed zdjęciem,
> skala znaku wodnego nie pełznie po 24%, ostatni krok nie cofa się na końcu, środek
> członu na krawędzi ±0,6 px, karta i napis wyśrodkowane na ekranie ±1 px, żaden
> namalowany glif nie ląduje na niezakrytej części kadru). Wszystkie przechodzą na
> wszystkich czterech szerokościach — 1440, 1024, 768, 390. **Cztery** z tych testów
> powstały dlatego, że przemiatanie złapało usterkę pierwsze.
>
> Jedenasty niezmiennik dotyczy stanu **przed** przypięciem, gdzie każda animacja
> kroku trzyma swoją klatkę 0%: opis i zdjęcie mają być całkowicie poza swoimi
> aperturami. Nie były — opis wystawał 18 px przy 483–900 px, czyli od pierwszej
> klatki strony. `.step__caption` był gridem z `align-content: start`, a `start`
> wymiaruje ścieżkę treścią, więc `block-size: 100%` linii rozwiązywało się do
> wysokości **tekstu** (40 px), nie okna (60 px) — i 105% z 40 nie wychodzi z 60.
> Teraz to zwykły blok. Panel zdjęcia dostał 2 px nadmiaru nad aperturę, żeby
> krawędź zaparkowana dokładnie na granicy przycięcia nie malowała włosa przy
> ułamkowej wysokości kadru; wszystkie panele mają ten sam nadmiar, więc taśma nadal
> styka się co do piksela. Klasa błędu dopisana do `P-026`.
>
> Zdjęcia są wyjęte z natywnego drag-and-drop przeglądarki (`draggable={false}`
> plus `-webkit-user-drag: none` na długie przytrzymanie w WebKicie, do którego
> atrybut nie sięga). `Picture.astro` dostał ten prop w innej sesji — sekcja tylko
> z niego korzysta, nie zmienia tamtego pliku.
>
> Dwie pułapki pomiarowe z tej sekcji poszły do `PLAYBOOK.md` (`P-028`), bo obie
> dały pewną i błędną liczbę: `getBoundingClientRect()` nie wie nic o `clip-path`
> ani o `overflow` przodka, a keyframe'y wstrzyknięte do strony w trakcie testu nie
> muszą nadpisać tych ze scoped CSS — cztery różne warianty dały bajt w bajt te same
> liczby, co jest sygnaturą nadpisania, które nigdy nie weszło.
> Statyczny zrzut z tej sekcji nie mówi nic — pokazuje jedną dowolną klatkę funkcji
> scrolla.
>
> Poziome ustawienie obu członów nazwy to **reguła, nie wcięcie**: środek członu
> leży na krawędzi zdjęcia, którą ten człon przecina. Pierwsza wersja miała dwa
> stałe wcięcia (180 i 288 px) — czytanie, przy którym `AI` trzeba uznać za pomyłkę
> grafika, bo siedzi na 57 px zamiast 163–193. Zbudowane z wcięcia `AI` ląduje
> w całości na zdjęciu, całe białe, bez czego przeciąć. Przemierzone: środek każdego
> z dziewięciu członów leży w ±32 px od swojej krawędzi, bez wyjątków. Reguła jest
> też jedyną wersją, która **gwarantuje** efekt dla wyrazu dowolnej długości.
>
> Zmierzone w realnym renderze przy 1440: kadr 460,00 × 540,00 i apertura zdjęcia
> **co do piksela w tym samym miejscu** (575,34 / 148,00), środek każdego członu na
> swojej krawędzi z dokładnością 0,6 px na wszystkich 101 pozycjach scrolla, opis
> 24,00 px pod kadrem, kwadracik 36,00 px w odstępie 8,00 px, nazwa 72,00 px.
> Zdjęcia mają 920 × 1080, czyli **dokładnie 2 ×** rozmiar rysowany.
>
> Okno opisu jest tokenem, nie wysokością treści — cztery kroki leżą na sobie, więc
> krok z dłuższym opisem przesuwałby całą kartę. Wartość jest zmierzona, nie wzięta
> z projektu: dwie linie od 1024 w górę, trzy poniżej. Najgorszy przypadek to 768,
> nie najwęższy ekran, bo poniżej 768 kadr przełącza się na 72vw i robi się szerszy
> niż 44vw tuż powyżej. Sprawdzone na ośmiu szerokościach.
>
> Trzy rzeczy do grafika, każda z zaimplementowaną odpowiedzią domyślną: wypełnienie
> kwadracika z numerem (brief podaje Lime-Dark dla samej cyfry, zrzuty pokazują
> jasną zieleń, której nie ma w palecie — zbudowane na `--color-green`, 4,6 : 1 pod
> cyfrą, czyli ledwo nad progiem), odstęp zdjęcie → opis (zmierzone ~31, wysłane 24)
> i to, czy znak wodny ma zostać za kartą do końca sekcji, czy zniknąć od razu po
> wjeździe kafla. Pełna lista w spec-u.
>
> Po przeglądzie klienta sekcja ma 300 vh zamiast 560: aktywne przypięcie skróciło
> się z 460 do 200 vh. Globalny Lenis wygładza skokowe impulsy kółka, a sama
> `view-timeline` jest liniowa — ponowne `ease-in-out` zwalniało początek i koniec
> każdej zmiany slajdu. Zamiana zdjęć nadal ma około 33 vh i zachowuje szczelną
> taśmę, ale nieruchomy odcinek pomiędzy zmianami spadł z około 33 do 8 vh.
>
> Lot obu członów nazwy pokrywa się teraz **dokładnie** z lotem zdjęcia i jest jedną
> monotoniczną drogą, nie wejściem–pauzą–wyjściem: człon prowadzący jedzie w górę
> przez całe okno, drugi w dół, szybko na końcach i wolno w środku. Dlatego się
> mijają, a nie zmieniają na zmianę. To samo zamknęło martwy czas: **41% czasu na
> scenie bez tekstu spadło do 1,1%**. Przyczyna była arytmetyczna, nie estetyczna —
> okna sąsiednich kroków zachodzą na siebie o pół rozpiętości i tylko w tym paśmie
> oba kroki w ogóle istnieją, a cały przekaz odbywał się **poza** nim.
>
> Kafel **nigdy nie był wyśrodkowany** — od pierwszej wersji, na każdej szerokości,
> o 85 px w prawo. Ścieżka `auto` w gridzie wymiaruje się do `max-content`
> najszerszego elementu, a znak wodny to 1611 px linii `nowrap` w scenie 1440 px;
> `place-items: center` centrowało więc wszystko w ścieżce, nie na ekranie. Środek
> treści równał się połowie szerokości napisu na każdej szerokości okna (805,3 /
> 715,3 / 571,3 / 427,4 / 214,8). `minmax(0, 1fr)` przykleja ścieżkę do sceny i napis
> wychodzi symetrycznie poza obie krawędzie — czyli dokładnie tak, jak jest w Figmie.
> Klasa błędu: `PLAYBOOK.md` `P-027`.
>
> Na mobile numer przenosi się **nad zdjęcie**. Obok mieści się (54 px marginesu na
> 44 px płytki z odstępem), ale mieści się kosztem gutteru strony i czyta się jak coś
> przyklejonego do krawędzi, a nie jak etykieta karty.
>
> Poniżej 768 px oba człony nazwy są **wyśrodkowane na zdjęciu** zamiast stać na
> zmierzonych wcięciach: przy 390 px kadr ma ~281 px, a „Relationship" składa się na
> ~250, więc człon dosunięty do wcięcia 180 zaczyna się poza ekranem. Odstępstwo
> świadome i opisane w spec-u.
>
> Copy dwóch ostatnich kroków jest w projekcie placeholderem i krok 03 ma to samo
> zdanie co 04 — przeniesione do `home.json` tak, jak stoi w pliku.

> `AudienceTabs` ma zamknięte: geometrię odtworzoną z kadru, przełączanie,
> klawiaturę, animację wejścia, wariant mobilny i `pnpm verify` (typecheck, lint
> i build czyste). Do `done` brakuje snapshotów i Lighthouse'a.
>
> Skala kadru jest policzona, nie założona: kadr ma 645 px szerokości, pasmo w nim
> 223 px przy podanych 500 — czyli 2,2321 px projektu na piksel kadru, a 1440 / 645
> to 2,2326. Zgadzają się co do jednej piątej procenta, więc wszystkie odczyty
> poniżej idą tą jedną liczbą.
>
> Dwie wartości są wyprowadzone, a nie wzięte ze skali. Światło międzyliterowe
> pytania: ink trzech etykiet mierzy 200,9 / 419,7 / 408,5 przy szerokościach
> awansu 213,0 / 439,4 / 433,0 w Aeonik Medium 40 — po odjęciu bocznych łożysk
> wychodzi -0,017 / -0,015 / -0,020 em na znak, czyli -0,02 ze skali mieści się
> w rozrzucie. Rytm pytań: zmierzone 78,1 (35 px kadru między wierzchołkami
> wersalików, ±2,2 na rozdzielczość kadru), zbudowane 80 = 40 linii + 2 × 20
> paddingu — ta sama czterdziestka, co wcięcie, i jedyna wartość ze skali
> w granicy błędu. Padding zamiast `gap`, żeby trzy pola dotyku stykały się bez
> martwego pasa między nimi.
>
> Jedna usterka była realna i złapało ją dopiero mierzenie zbudowanej strony:
> etykiety miały `.reveal`, a `.reveal` animuje `opacity` z `fill-mode: both`.
> Klatka końcowa animacji bije deklarację na tej samej właściwości **na stałe**,
> a stan nieaktywnego pytania **jest** `opacity` — czyli po wejściu wszystkie trzy
> pytania świeciły pełną mocą i przełącznik nie miał czego pokazywać. Zmierzone
> 0,94 i wciąż rosnące. Naprawione maską (`.reveal-mask` rusza wyłącznie
> `transform`), więc obie rzeczy nigdy się nie spotykają. Klasa błędu poszła do
> `PLAYBOOK.md` `P-029`.
>
> Kontrast nieaktywnego pytania **nie przechodzi i to jest pytanie do grafika, nie
> usterka kodu**: Lime-Dark przy 0,2 na `#F1F2EB` to **1,47 : 1** przy progu 3 : 1
> dla tekstu ≥ 24 px. Ship jak w projekcie, ale w odróżnieniu od poprzednich dwóch
> odstępstw to nie jest podpis — to przełącznik, który trzeba przeczytać, żeby
> wiedzieć, że istnieje. Pierwsza alfa nad progiem to 0,51 (3,03 : 1); nawet stan
> hover przy 0,5 ląduje tuż pod nim, na 2,95.
>
> Zdjęcia: wszystkie trzy mają 500 px wysokości przy paśmie 500, czyli 1× —
> a `Interesting in investing` ma 400 px szerokości przy połowie 675, więc jest
> rozciągane 1,7× **zanim** zostanie przycięte, i to widać. Pliki ≥ 1350 × 1000
> zamykają obie sprawy bez zmiany kodu.
>
> Trzy zdjęcia to trzy requesty i 51 KB AVIF, ale **żaden nie startuje przy
> wczytaniu strony** — zmierzone: zero, dopóki sekcja nie dojedzie do okna.
> `visibility: hidden` chowa panel, ale nie wstrzymuje pobrania jego obrazka, więc
> po dojechaniu lecą wszystkie trzy naraz. To cena przełącznika, który zmienia
> zdjęcie bez rundy po sieci.
>
> Copy przycisków dla pytania 1 i 3 jest zbudowane wzorem — kadr pokazuje wyłącznie
> „Call with M&A Lead" na pytaniu 2. Trzecie pytanie w projekcie brzmi
> „Interesting in investing?"; znormalizowane na „Interested". Wszystkie trzy
> celują w `/contact/`, które jeszcze nie istnieje.


---

## Kolejność prac (AGENT-RULES §3)

1. 🟢 **Tokeny** — `packages/tokens/tokens.css`. Kolory, typografia, przestrzeń,
   ruch i tokeny komponentowe wyprowadzone z klatki hero. Domyślne skale
   Tailwinda są wyzerowane (`DECISIONS.md`).
2. 🟢 **Fonty** — Aeonik 400 + 500, subset latin / latin-ext przez
   `scripts/build-fonts.sh`, `size-adjust` na foncie zastępczym policzony
   z metryk. 11,2 + 11,4 KB nad foldem. Ostatnia pozycja ⬜ w `PLAYBOOK.md` §1
   „Wizualia" jest domknięta.
3. 🟢 **Prymitywy** — `Link`, `MediaImage`, `MediaVideo` (+ `loop`), `SiteSettings`,
   `HeroStat`. Pokrycie wystarczające; `RichText` jeszcze nieużywany.
4. 🟡 **Layout** — `Header` gotowy, `Footer` czeka na projekt.
5. 🟡 **Bloki strony głównej** — `Hero` i `LogoWall` gotowe, `ServiceCards`,
   `OurProcess` i `TeamGrid` zakodowane i czekają na snapshoty, reszta nieznana.
6. ⚪ **Pozostałe strony.** Linki w nawigacji celują w `/about-us/`,
   `/brokerage/`, `/industry-insights/`, `/join-us/` i `/contact/` — żadna z tych
   stron jeszcze nie istnieje.

## Budżety strony (AGENT-RULES §5)

Egzekwuje `lighthouserc.json`; `pnpm lighthouse` failuje przy przekroczeniu.

| Metryka | Budżet |
|---|---|
| LCP (mobile, 4G) | < 2,5 s |
| TBT | < 200 ms |
| CLS | < 0,1 |
| JS łącznie na stronę | < 150 KB |
| CSS | < 50 KB |
| Requesty przy starcie | < 30 |

Budżety są przeniesione z pilota bez zmian, z jednym jawnym odstępstwem: limit
czasu wideo tła podniesiony z 10 s do 12,04 s przy niezmienionym limicie wagi
(`DECISIONS.md`).

Stan po `LogoWall` — mediana z trzech przebiegów, `staticDistDir`. W nawiasie stan
po `Hero`, dla porównania:

| Metryka | Budżet | Mobile | Desktop |
|---|---|---|---|
| Performance / A11y / Best practices / SEO | ≥ 90 / 95 / 95 / 100 | **100 / 100 / 100 / 100** | **100 / 100 / 100 / 100** |
| LCP | < 2,5 s | 1,51 s (1,35) | 0,39 s (0,36) |
| TBT | < 200 ms | 0 ms | 0 ms |
| CLS | < 0,1 | 0,000 | 0,000 |
| JS łącznie | < 150 KB | **0 B zewnętrznego** (1 779 B inline; 1 427) | — |
| CSS | < 50 KB | 5,67 KB gz / 23,9 KB raw (5,5 / 23,0) | — |
| Requesty przy starcie | < 30 | **14** (8) | — |

Sześć logotypów to sześć requestów i 12,9 KB AVIF (z 44 KB źródłowych PNG).
Ładują się leniwie, ale na 390 px sekcja startuje ~300 px pod foldem, czyli
w progu, przy którym Chrome i tak je pobiera — stąd +0,15 s na LCP. Mieści się
w budżecie z dużym zapasem; jeśli kiedyś przestanie, pierwszym ruchem jest
zamiana PNG-ów na SVG, nie kombinowanie z `loading`.

> `MarketSlider` ma zamknięte: geometrię, slider, gest, klawiaturę, animacje,
> kontrast i `pnpm verify`. Do `done` brakuje snapshotów i Lighthouse'a
> (odłożone na prośbę klienta) oraz **treści slajdów 2 i 3** — schemat jest na nią
> gotowy (`slides[].description`, `slides[].cta`), a komponent animuje to, co mówi
> aktywny slajd; do czasu dosłania wszystkie trzy pożyczają zdanie bloku.
>
> Jedyny skrypt w bloku to 470 B (gz) na gest przeciągania. Sam slider jest bez
> JS — skrypt tylko zaznacza radio i podaje `--drag`; usunięty, zablokowany albo
> jeszcze niepobrany nie zmienia niczego poza tym, że nie da się machnąć palcem.
>
> Dwie pułapki złapane w tej sekcji, obie już opisane w tym repo przy innych
> blokach i obie powtórzone tutaj mimo to: apertura musi być na **panelu**, nie na
> ramce (inaczej zdjęcie stoi widoczne od pierwszej klatki, a przesuwa się pusty
> panel), oraz `animation: var(--x, none) … both` parsuje się z zamienionymi
> polami — `none` jest legalne i dla `animation-name`, i dla `animation-fill-mode`,
> więc przeglądarka bierze `both` jako nazwę. Zmierzone, nie przeczuwane.
>
> Dwie liczby są sporne i obie są zapisane, nie przemilczane: wcięcie wewnątrz
> skrzynki jest **podane jako 20**, a ramka mierzy 28,3 od lewej linii i 30 od
> stopki — ships podane 20. Ilustracja jest rysowana w **640** (natywny rozmiar
> masterów), a kadr sugeruje 653; to ta sama 2-procentowa rozbieżność między
> szerokością rzędu w ramce a siatką 1360, którą zgłosiły już `LogoWall` i
> `TeamGrid`.
>
> Mastery mają 640 px przy zdjęciu rysowanym w 640 — na ekranie 2× ilustracja
> jest miękka. Pliki ≥ 1280 px naprawiłyby to bez zmiany kodu.
