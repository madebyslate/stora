# DECISIONS

Log decyzji architektonicznych. Format: data — decyzja — powód.
Dopisujesz każdą decyzję niestandardową (AGENT-RULES §9.7).

---

## 2026-08-31 — Pas logotypów ma jeden stały odstęp 64 px zamiast rozstawu z ramki

**Kontekst.** Ramka rozstawia sześć znaków ręcznie: pięć przerw mierzy 98,1 /
103,0 / 94,4 / 101,7 / 95,7 px. Blok odtwarzał ten rozkład rozciągając zestaw do
1360 px kontenera przez `justify-content: space-between`. To działa dla jednego
zestawu, ale marquee powtarza zestaw, a szew między dwoma zestawami nie jest
przerwą między elementami — jest stykiem dwóch flex-itemów toru i miał zero px.
Raz na obieg jedno logo przyklejało się do poprzedniego, reszta stała ~108 px od
siebie.

**Decyzja.** Zestawy mają szerokość własnej treści, a każda przerwa w pasie —
łącznie ze szwem — to literalne `--logo-marquee-gap: var(--space-11)`, czyli
64 px. Odstęp szwu niesie `padding-inline-end` zestawu, dzięki czemu szerokość
toru i okres pętli są tą samą liczbą z konstrukcji. Zestawy są trzy, nie dwa, bo
okres (885 px) jest węższy od kontenera. Czas trwania spada z 32 s na 21 s, co
utrzymuje dotychczasowe 42,5 px/s.

**Powód.** Klient poprosił o ciaśniejszy pas i o naprawę nierównego przewijania.
Rozstaw w pasie, który się zapętla, musi być wartością, a nie resztą z podziału —
`space-between` rozdziela nadmiar lokalnie, w obrębie jednego zestawu, a pętla
jest globalna. 64 px to jednocześnie krok w dół od średniej z ramki, o który
klient prosił.

**Konsekwencja.** Odstęp nie jest już zgodny z ramką co do piksela i wymaga
potwierdzenia grafika (otwarte pytanie w `LogoWall.spec.md`). Regresja jest
pilnowana przez test mierzący **wszystkie** przerwy toru po kolei, szwy włącznie
— pomiar wewnątrz jednego zestawu przepuściłby ją. Mechanizm i reguła kciuka
trafiły do `PLAYBOOK.md` P-039.

## 2026-08-31 — Header i stopka mają osobne etykiety tej samej nawigacji

**Decyzja.** `site.navigation` pozostaje źródłem etykiet nagłówka, a
`site.footer.navigation` przechowuje osobne etykiety stopki. Obie listy prowadzą
do tych samych pięciu adresów, ale klient zatwierdził `IPP Portfolio` w nagłówku
i `IPP Pipeline` w stopce dla `/develop-to-hold/`.

**Powód.** Jedna współdzielona tablica nie jest w stanie wiernie odwzorować dwóch
zaakceptowanych nazw bez ukrytego mapowania tekstu w komponencie. Jawne pola
utrzymują treść w `content/globals/site.json` i pozwalają przyszłemu CMS-owi
walidować oba miejsca tym samym typem `Link`.

**Koszt.** Edycja celu nawigacji wymaga zmiany w dwóch listach. Ich zgodność
adresowa jest sprawdzana przez test nagłówka i build; etykiety celowo mogą się
różnić.

## 2026-08-31 — `AboutStory` płynie w czterech torach bez pinowania

**Decyzja.** Po morfowaniu `PageHero` sekcja nie przechodzi już w przypiętą
scenę. Ma naturalną wysokość około 190 svh i dwanaście rozmieszczeń z sześciu
dostarczonych fotografii. Zewnętrzne tory dostają większą transformację sterowaną
natywną `view-timeline` niż wewnętrzne, więc kadry wyraźnie jadą do góry wraz ze
stroną. Drugie użycie każdego źródła jest dekoracyjne i ma pusty `alt`.

**Powód.** Klient odrzucił odczuwalne zatrzymanie drugiej sekcji i wskazał Waabi
jako referencję: tam gęste pionowe tory zdjęć przechodzą przez viewport w różnym
tempie, ale tekst i dokument pozostają w naturalnym przepływie. Powtórzenia
istniejących źródeł dają podobny rytm bez nowych assetów i bez zmiany modelu CMS.

**Fallback.** Bez obsługi scroll-driven animations wszystkie zdjęcia nadal są
widoczne i przewijają się naturalnie. Przy `prefers-reduced-motion: reduce`
dodatkowa różnica prędkości oraz morfowanie hero są wyłączone.

**Korekta po review.** Sam tekst jest przytrzymany na środku viewportu, ale nie
tworzy dodatkowego dystansu scrolla i nie zatrzymuje zdjęć. Dostaje białą
powierzchnię w kolorze tła, która niewidocznie maskuje kadry przechodzące pod
literami. Hero kończy morfowanie już po 45% pierwszego ekranu scrolla i zarówno
ono, jak i statyczny kadr docelowy, są rysowane nad pozostałymi fotografiami.

## 2026-08-25 — Userback działa globalnie na wszystkich stronach stagingu

**Decyzja.** `BaseLayout` ładuje asynchronicznie publiczny widget Userback na
każdej stronie. Token dostępu widgetu jest identyfikatorem klientowym i celowo
znajduje się w wygenerowanym HTML; skrypt pochodzi z oficjalnego CDN Userback.

**Powód.** Osoby oceniające staging mają móc zostawić feedback kontekstowy na
dowolnej podstronie bez powielania integracji w blokach ani fixtures.

**Koszt i odwracalność.** Jest to zewnętrzny skrypt ładowany po stronie klienta,
więc jego transfer i dostępność nie są kontrolowane przez aplikację. Loader jest
asynchroniczny i nie blokuje renderowania; usunięcie jednego bloku z
`BaseLayout` całkowicie wyłącza integrację. Budżet skryptów Lighthouse wynosi
180 KiB: obejmuje dotychczasowe 150 KiB aplikacji oraz zmierzony koszt widgetu,
z niewielkim marginesem, ale nie otwiera budżetu na kolejne integracje.

## 2026-08-25 — Drugi staging ma osobny stack, port i wolumen

**Decyzja.** `stora2.madebyslate.dev` korzysta z
`docker-compose.staging2.yml`, ale z tego samego targetu `website-builder` i
konfiguracji Nginx co pierwszy staging. Stack ma nazwę `stora2-staging`, port
hosta `18084` i wolumen `stora2-staging-website-dist`.

**Powód.** Sama zmiana `PUBLIC_SITE_URL` wystarcza do zbudowania canonicali,
sitemapy i metadanych dla nowej domeny, ale nie izoluje zasobów Compose. Osobna
nazwa projektu, port i wolumen pozwalają uruchomić oba preview równolegle na
tym samym hoście bez nadpisania opublikowanego katalogu ani kolizji routerów.
`Dockerfile` nie wymaga wariantu zależnego od domeny.

**Odwracalność.** Usunięcie drugiego środowiska wymaga zatrzymania wyłącznie
stacka `stora2-staging`; pierwszy staging i pełny stack pozostają bez zmian.

## 2026-08-24 — Lenis wygładza kółko globalnie, a `OurProcess` nie wygładza go drugi raz

**Kontekst.** Animacje sterowane bezpośrednio pozycją scrolla były płynne na
touchpadzie, ale ujawniały skokowe impulsy kółka Logitech MX Master. Najbardziej
uciążliwy był `OurProcess`: 560 vh sekcji dawało 460 vh aktywnego przypięcia,
a `--ease-in-out` dodatkowo zwalniało początek i koniec każdej zmiany slajdu.

**Decyzja.** Oficjalny `lenis` 1.3.26 wygładza wyłącznie wejście `wheel` dla całej
strony (`lerp: 0.1`, mnożnik 1). Dotyk pozostaje natywny, a przy
`prefers-reduced-motion: reduce` silnik nie jest pobierany ani uruchamiany. Menu
kompaktowe zatrzymuje i wznawia instancję tym samym stanem, którym blokuje scroll.
`OurProcess` pozostaje jedną CSS-ową `view-timeline`, ale jego czterokrokowa
wysokość spada do 300 vh, udział intro do 18%, a wszystkie odcinki osi są liniowe.
Okna kroków nachodzą na siebie w 80% rozpiętości kroku: sama wymiana nadal
zajmuje około 33 vh, a nieruchomy odcinek pomiędzy wymianami tylko około 8 vh.

**Powód.** Lenis normalizuje kółko, kotwice, cykl klatek i natywną pozycję scrolla
w kilku kilobajtach bez zależności runtime; własny globalny silnik powielałby tę
obsługę i jej przypadki brzegowe. Liniowy scrub czyta już wygładzoną pozycję
przeglądarki — druga krzywa dawała podwójne hamowanie zamiast dodatkowej płynności.
Skrócenie pin-distance o 57% rozwiązuje wysiłek przewijania niezależnie od myszy,
a szersze nakładanie okien usuwa wyczuwalne przestoje bez przyspieszania wymiany.

**Koszt i odwracalność.** Bootstrap ma 1,06 KB gzip, a osobny, dynamicznie
ładowany chunk Lenisa 5,39 KB gzip (razem 6,45 KB gzip). CSS `OurProcess` nadal
działa bez niego i ma ten sam statyczny fallback przy ograniczeniu ruchu.
Usunięcie importu przywraca natywny scroll bez zmian w blokach.

## 2026-08-24 — Mobile `AudienceTabs` pokazuje wszystkie opcje jako listę

**Kontekst.** Poziomy pasek ze snapowaniem przyjęty 2026-08-21 ukrywał kolejne
opcje poza viewportem, nie miał widocznego wskaźnika przewijania, a ich krycie
0,2 utrudniało rozpoznanie, że są sterowaniem. Klient poprosił o bardziej
intuicyjne przełączanie na mobile.

**Decyzja.** Poniżej 1024 px trzy opcje są jednocześnie widoczne jako kompaktowe
wiersze nad zdjęciem. Każdy wiersz ma licznik `0N/0T` i dolną regułę, aktywny
dostaje strzałkę, a nieaktywne mają krycie 0,65 — 4,71 : 1 na białym tle.
Mechanizm pozostaje natywną grupą radio bez JS. Ta decyzja zastępuje mobilną
część wpisu z 2026-08-21; desktop pozostaje bez zmian.

**Powód.** Wszystkie możliwe działania i aktualny stan są widoczne bez gestu
odkrywania. Wzorzec strzałki, licznika i reguły jest już używany przez
`TechnicalDepthTabs`, więc nie tworzy drugiego języka przełączników.

## 2026-08-24 — Sticky header nie opuszcza viewportu podczas zmiany tonu

**Decyzja.** Globalny nagłówek jest przypięty od pierwszej klatki. Na hero
zaczyna jako przezroczysty wariant `on-media`, a przy pierwszym scrollu
natychmiast przechodzi w białą powierzchnię z ciemnym tekstem i CTA. Nie ma
progu wejścia, zanikania ani translacji samego nagłówka.

**Powód.** Klient odrzucił sekwencję, w której nagłówek przewijał się poza
ekran, a po 192 px wracał z góry. Stała geometria zachowuje ciągłość
nawigacji; scroll zmienia wyłącznie jej wariant kolorystyczny.

**Odwracalność.** Próg i animacja zostały usunięte, a stan jest izolowany
w atrybucie `data-scrolled`; ewentualna korekta momentu zmiany nie wymaga zmian
w strukturze nagłówka.

## 2026-08-21 — Staging etapu 1 działa bez Payloada

**Decyzja.** `stora.madebyslate.dev` korzysta z osobnego
`docker-compose.staging.yml`: jednorazowy builder Astro czyta fixtures, publikuje
wynik do trwałego wolumenu, a Nginx serwuje wyłącznie statyczną stronę. Payload,
PostgreSQL i ich sekrety nie są częścią tego środowiska. Planowane CTA do
`/contact/`, `/industry-insights/` i `/join-us/` pozostają widoczne dla oceny
projektu, ale mają jawne `disabled: true` i nie renderują `href`.

**Powód.** Model treści powstaje dopiero po zamknięciu bloków. Uruchomienie CMS-a
teraz dodałoby bazę, migracje i publiczny panel bez źródła treści, a produkcyjny
Nginx nie może wystartować bez hosta `payload` zdefiniowanego w upstreamie.
Osobny, mały stack pozwala pokazywać bieżący front i nie rozluźnia zależności
pełnego wdrożenia, które w etapie 2 mają pozostać obowiązkowe.

**Odwracalność.** Pełny stack pozostaje bez zmian w `docker-compose.yml`.
Przełączenie stagingu na Payload wymaga wskazania tego pliku w xCloud i wykonania
migracji opisanych w `DEPLOYMENT.md`, bez zmian w komponentach.

## 2026-08-21 — Wszystkie przyciski odsłaniają dostępny Green w jednym kierunku

**Decyzja.** Biały i Lime-Dark wariant wspólnego `Button` dochodzą na hoverze
i fokusie do tego samego stanu: zielona warstwa odmaskowuje się od lewej przez
`scaleX`, a tekst i obie strzałki stają się białe. Wyjście domyka warstwę w prawo.
Ruch trwa 450 ms na istniejącej krzywej expo-out, nie dodaje JavaScriptu i przy
`prefers-reduced-motion` zapada się do natychmiastowej zmiany stanu.

**Powód.** Zwykła zmiana koloru nie daje gestu, o który chodzi w tym interfejsie,
a osobne hovery dla jasnego i ciemnego przycisku rozdzielałyby jeden komponent na
dwa zachowania. Surowy Green `#18A85B` daje tylko 3,09:1 z białym tekstem 14 px,
więc warstwa używa 70% Green zmieszanego w sRGB z Lime-Dark. Wynik zachowuje
charakter jaśniejszej zieleni i mierzy 4,79:1 z bielą.

**Odwracalność.** Kierunek, czas i barwa są tokenami albo pojedynczymi regułami
w `Button.astro`; kształt komponentu i wszystkie wywołania pozostają bez zmian.

## 2026-08-21 — Favicon używa znaku z końcowego CTA na kontrastowym tle

**Decyzja.** Ikona witryny powtarza ścieżkę znaku z `Mark.astro`, ale odwraca
jej kolor: jasny `Lime Mist` stoi na pełnym tle `Lime Dark`. Źródłem nowoczesnym
jest SVG, a z niego powstają statyczne fallbacki ICO oraz Apple Touch Icon.

**Powód.** Sam ciemny znak z CTA znikałby w ciemnym interfejsie przeglądarki.
Stałe tło zachowuje czytelność w obu motywach i pozwala utrzymać jeden wygląd
we wszystkich miejscach bez skryptu, manifestu ani nowej zależności projektu.

## 2026-08-21 — `GrowthTimeline` obraca oś na mobile i nie udaje interaktywnej kontrolki

**Decyzja.** Cztery etapy stoją na jednej poziomej osi od 768 px, a poniżej niej
oś obraca się pionowo. Ostatni punkt jest domyślnie aktywny; na urządzeniu z
precyzyjnym wskaźnikiem hover chwilowo przekazuje wyróżnienie innemu etapowi.
Elementy pozostają semantyczną listą, bez `tabindex`, przycisków i stanu ARIA.

**Powód.** Projekt pokazuje tylko desktop. Cztery tytuły 28 px i opisy 16 px nie
mieszczą się czytelnie w czterech kolumnach telefonu, a pionowa chronologia
zachowuje kolejność i wszystkie relacje. Hover nie odkrywa treści ani nie wykonuje
akcji, więc sztuczny fokus sugerowałby kontrolkę, której blok nie ma.

**Koszt.** Mobile jest świadomym wariantem bez pokrycia w Figmie. Ruch wejścia
korzysta ze wspólnego obserwatora sekcji i istniejących klas reveal; blok nie
dokłada lokalnego JavaScriptu ani zależności.

## 2026-08-21 — `AboutStory` morfuje istniejący `PageHero`, a nie jego atrapę

**Decyzja.** Skrypt lokalny sekcji mierzy rzeczywisty prostokąt miejsca
docelowego i steruje transformacją wcześniejszego `PageHero`. Hero skaluje się
niejednolicie do kwadratu 156 × 156, a fotografia wewnątrz dostaje kontrskalę
obu osi wyliczoną od większej skali. Dzięki temu na desktopie i pionowym telefonie
kadr wypełnia kwadrat bez rozciągnięcia i bez czarnych pasów. W ostatnich 4%
ruchu zdjęcie przejmuje identyczny, zwykły `<Picture>` osadzony w sekcji.
Po zakończeniu morfowania kompozycja zostaje przypięta na `100svh`; ten osobny
postęp steruje wejściami sześciu zdjęć i odkrywaniem słów, aż ostatnie osiągnie
pełne krycie. Wewnątrz przypiętego ekranu osobna scena zachowuje projektową
wysokość i jest centrowana pionowo; dopiero na niższym ekranie ogranicza się do
jego wysokości. Bez JavaScriptu i przy ograniczeniu ruchu dodatkowa wysokość
znika, a blok od razu pokazuje stan końcowy.

**Powód.** Kopia pełnoekranowego hero w nowym bloku zasłoniłaby tekst w chwili
startu albo wymagała odtworzenia całej zawartości i scrimów w dwóch komponentach.
Transformacja istniejącego elementu zachowuje ciągłość dokładnie tego, co
użytkownik przed chwilą widział. Statyczny następca jest potrzebny, żeby po
zakończeniu przejścia zdjęcie przewijało się dalej razem z sekcją, zamiast zostać
przypięte do całej reszty `<main>`.

**Koszt.** 717 B gzip skryptu inline, jeden pasywny listener scrolla spięty przez
`requestAnimationFrame`; na klatkę zmieniają się wyłącznie `transform` i
`opacity`. Przy `prefers-reduced-motion` morfowanie znika, a oba bloki renderują
od razu swoje statyczne stany.

## 2026-08-21 — Współdzielone bloki fixtures przez referencje rozwiązywane w adapterze

**Decyzja.** Sekcje używane bez zmian na kilku stronach mieszkają w
`content/blocks/shared.json`. Fixture strony wskazuje je przez `blockRef` i może
płytko nadpisać wyłącznie pola różniące wariant, np. nagłówek zespołu albo
`theme: dark`. Adapter fixtures rozwiązuje referencję i ponownie waliduje gotowy
blok oraz całą stronę schematami z `packages/shared`.

**Powód.** About Us powtarza skład zespołu, logotypy, etapy developmentu i blok
„Store energy at large scale”. Kopie w kilku plikach JSON rozjechałyby się przy
pierwszej edycji. Referencja zachowuje jedno miejsce edycji na etapie 1, a poza
adapter nie wychodzi żaden nowy kształt danych: komponenty i przyszły Payload
nadal otrzymują zwykłe `Page` z tablicą pełnych bloków.

**Ograniczenie.** `overrides` są celowo płytkie i nie mogą zmieniać `blockType`.
Głębokie składanie tablic lub części obiektów byłoby ukrytym językiem szablonów;
jeśli wariant różni się aż tak mocno, dostaje osobny blok treści.

## 2026-08-20 — Setup przeniesiony ze scaffoldu `adstic-astro`

**Decyzja.** Repo powstało jako kopia pilota, nie od `pnpm create astro`.
Przeniesione zostało wszystko z „listy wywozowej" `PLAYBOOK.md` §4: `Dockerfile`,
`docker/`, oba pliki compose, `lighthouserc.json`, `turbo.json`,
`tsconfig.base.json`, `scripts/encode-video.sh`, warstwa `apps/web/src/lib/`
(content + media + preload), `packages/shared` z prymitywami, `packages/tokens`,
kolekcje `Users` i `Media`, testy z §2, `_inbox/README.md`, `AGENTS.md`,
`_TEMPLATE.spec.md` i sam `PLAYBOOK.md`. Od zera powstają: bloki i ich schematy,
`content/pages/*.json`, ten plik i `BLOCKS.md`.

**Powód.** To jest dokładnie scenariusz, pod który playbook był pisany —
„za trzy miesiące ktoś zakłada nowe repo i chce mieć działający stack w godzinę".
Odtwarzanie tych plików ręcznie oznaczałoby powtórzenie pułapek `P-001`…`P-010`,
z których żadnej nie wyłapuje ani typecheck, ani lint, ani lokalny build.

**Konsekwencja.** Decyzje pilota obowiązują tutaj bez ponownego uzasadniania,
dopóki któraś nie zostanie w tym pliku jawnie odwołana:

| Decyzja przeniesiona z pilota | Gdzie widać w kodzie |
|---|---|
| monorepo `apps/*` + `packages/*`, jeden lockfile | `pnpm-workspace.yaml` |
| Payload scaffoldowany, ale **bez** kolekcji treściowych | `apps/cms/src/payload.config.ts` |
| `RichText` = string HTML na obu etapach | `packages/shared/src/primitives.ts` |
| loader treści z przełącznikiem `CONTENT_SOURCE` | `apps/web/src/lib/content/` |
| tokeny w jednym bloku `@theme`, nie `:root` + most | `packages/tokens/tokens.css` |
| `trailingSlash: 'always'` | `astro.config.mjs`, `pagePath()`, `docker/nginx.conf` |
| `outputFileTracingRoot` i `turbopack.root` przypięte do roota | `apps/cms/next.config.ts` |
| TypeScript przypięty na 5.9.3 | wszystkie `package.json` |
| kontenery wołają binarki z `node_modules/.bin`, nie `pnpm` | `Dockerfile`, `docker/*.sh` |
| `docker-compose.dev.yml` z własną nazwą projektu | `name: stora-dev` |
| `tsconfig.base.json` kopiowany do obrazów | `Dockerfile`, etap `workspace-manifests` |
| `robots.txt` generowany, nie statyczny | `apps/web/src/pages/robots.txt.ts` |

Powody każdej z nich są w `adstic-astro/DECISIONS.md`. Tutaj nie są kopiowane,
bo to log **tego** projektu — jeśli któraś decyzja okaże się dla Story błędna,
wpis odwołujący ją idzie poniżej, z datą.

## 2026-08-20 — Własne porty hosta: `APP_PORT=18083`, dev PostgreSQL na `5434`

**Decyzja.** Stora nie dziedziczy portów pilota. `APP_PORT` to `18083`
(adstic: `18082`), lokalna baza słucha na `5434` (adstic: `5433`).

**Powód.** Oba projekty stoją na tej samej maszynie i mają być uruchamiane
równolegle. Kolizja na porcie routera jest głośna, kolizja na porcie bazy —
nie zawsze: `DATABASE_URL` wskazujący `127.0.0.1:5433` trafia do serwera
poprzedniego projektu. Opisane jako `PLAYBOOK.md` `P-011`.

**Dopisane po pierwszym `pnpm test:visual`:** Astro dev/preview też dostało
własny port — `4322`. Założenie „kolizja na porcie dev jest natychmiast
widoczna" okazało się fałszywe: `4321` zajmował dev server sąsiedniego projektu,
a Playwright z `reuseExistingServer: true` obsłużył go bez słowa i wygenerował
baseline **cudzej strony**, na zielono. Opisane jako `PLAYBOOK.md` `P-012`.
Port Payloada (`3000`) zostaje domyślny — tam adopcja cudzego serwera nie ma jak
przejść niezauważona, bo panel wymaga logowania do własnej bazy.

Zmiana portu Astro dotyka czterech miejsc naraz: `astro.config.mjs` (`server.port`
i default `PUBLIC_SITE_URL`), `apps/web/package.json` (`preview`),
`playwright.config.ts` (`baseURL` + `webServer.url`) i `.env`.

## 2026-08-20 — Migracja początkowa przeniesiona, nie wygenerowana od nowa

**Decyzja.** `apps/cms/src/migrations/20260820_000000_initial_schema.{ts,json}`
to migracja pilota z nowym znacznikiem czasu.

**Powód.** Zestaw kolekcji jest identyczny (`Users` + `Media`), więc wygenerowane
SQL byłoby co do znaku takie samo, a generowanie wymaga postawionej bazy.
Znacznik czasu został przesunięty, bo nazwa migracji jest zapisywana w bazie i ma
odpowiadać historii tego projektu, nie tamtego.

**Ryzyko.** Ta migracja **nie została jeszcze uruchomiona na żadnej bazie Story** —
pierwszy `payload migrate` jest jednocześnie jej testem. Zaznaczone
w `DEPLOYMENT.md` §3.2.

## 2026-08-20 — `PLAYBOOK.md` duplikowany, nie współdzielony

**Decyzja.** Playbook został skopiowany do tego repo. Wpisy przenośne dopisuje
się w obu kopiach naraz, z tym samym ID (`PLAYBOOK.md` §0).

**Powód.** Alternatywy — submoduł, pakiet npm, osobne repo startera — wymagają
decyzji o kształcie startera, a ta jeszcze nie zapadła; playbook ma dopiero
otwarte wątki w §3. Duplikat z jawną regułą synchronizacji jest tańszy niż
przedwczesna infrastruktura, ale ma termin ważności: **przy trzecim projekcie
kopiowanie przestaje działać** i wtedy powstaje repo startera.

**Wyłapuje.** Nic. To jest dyscyplina, nie mechanizm — i dlatego jest tu zapisany
termin, po którym trzeba ją zastąpić mechanizmem.

## 2026-08-20 — Kod i komentarze po angielsku, dokumenty sterujące po polsku

**Decyzja.** Wszystko w `apps/`, `packages/`, `content/`, `tests/` i `scripts/` —
kod, nazwy, komentarze, teksty testów — jest po angielsku. `AGENTS.md`,
`DECISIONS.md`, `BLOCKS.md` i `PLAYBOOK.md` zostają po polsku. Komentarze
przeniesione ze scaffoldu zostały przetłumaczone przy pierwszym dotknięciu pliku,
nie hurtem.

**Powód.** Projekt idzie na awards i do portfolio; kod czyta komisja, a mieszany
polsko-angielski w komentarzach obok angielskiej treści strony wygląda na
niedokończony. Dokumenty sterujące czyta zespół i agent, nie komisja — i to one
mają być wygodne w codziennej pracy.

**Konsekwencja.** `<html lang="en">`, `og:locale` = `en_GB`, skip link i teksty
UI po angielsku. Strona jest anglojęzyczna, więc `lang="pl"` ze scaffoldu było
zwyczajnym błędem dostępności, nie kwestią gustu.

## 2026-08-20 — Tokeny kasują domyślne skale Tailwinda

**Decyzja.** `packages/tokens/tokens.css` otwiera się listą `--color-*: initial`,
`--text-*: initial`, `--spacing-*: initial`, `--radius-*: initial`,
`--shadow-*: initial`, `--ease-*: initial`, `--breakpoint-*: initial`. Skala
typografii jest nazwana rolą (`--text-display`, `--text-metric`, `--text-lead`,
`--text-unit`, `--text-body`, `--text-ui`), a każdy krok niesie własny
line-height, tracking i grubość przez pary `--text-<nazwa>--*` z Tailwinda v4.

**Powód.** AGENTS.md zakazuje literałów w komponentach, ale zakaz jest
dyscypliną. Wyzerowanie przestrzeni nazw zamienia go w mechanizm: `text-2xl`,
`bg-red-500`, `rounded-xl` i `shadow-lg` **nie istnieją**, więc wartość spoza
projektu nie ma jak wejść przez przypadek. Cieni nie ma w ogóle — w tym projekcie
nie występują, więc `shadow-*` jest niedostępne, a nie „umownie zabronione".

**Konsekwencja.** Jedna klasa (`text-display`) odtwarza cały krok z projektu, więc
nie da się sparować rozmiaru z cudzą interlinią. Koszt: każdy nowy rozmiar wymaga
wpisu w tokenach — co jest celem, nie efektem ubocznym.

## 2026-08-20 — Hero wyrównane do siatki nagłówka (−15 px względem Figmy)

**Decyzja.** Treść hero startuje na x = 40, tam gdzie logo, a nie na x ≈ 55 jak
w eksporcie z Figmy. Jeden kontener 1360 dla całej strony.

**Powód.** Grupa treści hero ma w Figmie 1360 px szerokości i prawą krawędź na
≈ 1415 — czyli jest poprawnie wymiarowana, tylko przesunięta. To pomyłka
w pozycjonowaniu grupy, nie druga siatka. Odtworzenie jej dałoby widoczne
rozjechanie logo i nagłówka na przeglądzie portfolio.

**Odwołanie.** Jeśli offset okaże się zamierzony, wraca przez własny gutter na
`.hero__inner` — jedna reguła, bez ruszania czegokolwiek innego.

## 2026-08-20 — Scrimy hero odchodzą od wartości z Figmy

**Decyzja.** Zamiast pasa 145 px / 350 px z pikami 0,50 i 0,60: górny scrim
zostaje na 145 px z pikiem 0,64, dolny jest **wymiarowany blokiem treści**, ma
osobny wariant dla < 1024 px i piki 0,66 / 0,78.

**Powód.** Gradienty z Figmy były dobrane pod jedną klatkę. Materiał trwa 12 s
i **kończy się białymi kontenerami dokładnie pod nagłówkiem**: na ostatniej klatce
nagłówek schodził do 2,9:1, a lead do 3,4:1. Niezależnie od tego stały pas 350 px
zakrywa treść tylko przy 1440 — poniżej nagłówek wchodzi w jasną część kadru
i na 390 px miał 2,3:1 nawet na posterze. Oba przypadki łamią WCAG 1.4.3 i widać
je gołym okiem.

**Wyłapuje.** `tests/a11y/hero-contrast.spec.ts` — mierzy realne piksele pod
glifami na najgorszej klatce, przy trzech szerokościach. Pomiary przed i po są
w `Hero.spec.md`. Uogólnienie poszło do `PLAYBOOK.md` jako `P-018`.

## 2026-08-20 — Bez GSAP-a; animacje wejścia to czysty CSS

**Decyzja.** Wejście hero i hovery są w CSS, sekwencjonowane liczbą
`--reveal-index` w markupie. Zero zależności animacyjnych, zero JS na tej
ścieżce. GSAP nie wchodzi do projektu „na zapas".

**Powód.** TBT to 30 % wyniku Lighthouse na mobile, a GSAP + ScrollTrigger to
~50 KB gz i 150–300 ms pracy CPU przy throttlingu 4×, zanim cokolwiek się ruszy.
Wejście hero musi startować przed hydracją czegokolwiek — CSS startuje przy
pierwszym malowaniu, biblioteka nie.

**Furtka.** Gdy któraś **dalsza** sekcja będzie naprawdę potrzebowała timeline'u
albo scruba (zapowiadane odsłanianie/odmaskowywanie zdjęć), ładujemy silnik
dynamicznym importem wyłącznie dla tej sekcji i poniżej folda — z wpisem tutaj
i rozliczeniem w budżecie JS. Domyślnie: `transform` + `opacity`, jeden wspólny
`IntersectionObserver` na scroll-reveal.

## 2026-08-20 — Poster hero jako `<picture>`, nie atrybut `poster`

**Decyzja.** Element LCP to responsywny `<picture>` (AVIF → WebP → JPEG) pod
`<video preload="none">`, przezroczystym do startu odtwarzania. Poster to klatka 0
enkodu, więc przejęcie obrazu przez wideo nie zmienia ani piksela.

**Powód.** `poster` przyjmuje jeden URL — telefon pobierałby plik 1920 px. Jako
`<picture>` ekran 390 px bierze 32 KB zamiast 65 KB. Preload dostaje
`type="image/avif"`, więc przeglądarki bez AVIF go pomijają.

**Wyłapuje.** `tests/visual/hero.spec.ts` porównuje `imagesrcset` preloadu
z `srcset` renderowanego `<source>` — rozjazd powoduje **dwukrotne** pobranie
elementu LCP i jest niewidoczny na ekranie.

## 2026-08-20 — Budżet czasu wideo: 10 s → 12,04 s, waga bez zmian

**Decyzja.** `BLOCKS.md` mówił ≤ 10 s. Materiał ma 12,04 s i zostaje w całości.
Budżet wagi (≤ 2 MB desktop, ≤ 1 MB mobile) obowiązuje bez zmian i jest spełniony:
1,76 MB / 0,91 MB w AV1.

**Powód.** Limit czasu był proxy dla wagi, a waga jest tym, co realnie boli.
Materiał jest narracją (puste pole → siatka → kontenery wireframe → gotowa
instalacja); cięcie psuje przekaz, przyspieszanie psuje ruch drona. CRF-y dobrane
z przemiatania VMAF, nie z nawyku — na tym materiale 38 → 40 kosztuje 0,45 VMAF
i oszczędza 12 % bajtów.

**Konsekwencja.** Wideo nie zapętla się: gra raz i zostaje na ostatniej klatce.
`MediaVideo` dostało jawne pole `loop`, żeby to była decyzja treści, nie domyślne
zachowanie komponentu.

## 2026-08-20 — Treści globalne przez ten sam adapter co strony

**Decyzja.** Nawigacja i CTA nagłówka to `SiteSettings` w `packages/shared`,
`content/globals/site.json` w etapie 1 i global Payloada o tym samym kształcie
w etapie 2. Adapter treści dostał trzecią metodę, `getSite()`.

**Powód.** Alternatywą było zakodowanie menu w `Header.astro` albo drugi,
równoległy sposób czytania treści. Pierwsze wywraca się przy pierwszej zmianie
menu przez klienta, drugie łamie jedyny mechanizm etapowania, jaki ten projekt ma.

## 2026-08-20 — Zakodowane wideo wchodzi do repozytorium

**Decyzja.** `.gitignore` przestaje ignorować `apps/web/public/video/*`.
Ignorowany jest master (`_inbox/`), nie wynik `scripts/encode-video.sh`.

**Powód.** Wideo tła nie jest uploadem z CMS-a, tylko wejściem statycznego builda.
Przy regule ze scaffoldu `docker build` po świeżym klonie zbudowałby hero bez tła,
i to bez żadnego sygnału lokalnie. Opisane jako `PLAYBOOK.md` `P-014`.

## 2026-08-20 — `.container-page`, nie `.container`; hero łamie się na 1360

**Decyzja.** Klasa kontenera nazywa się `.container-page`. Dwukolumnowy układ hero
włącza się od **1360 px**, nie od 1024; szyna statystyk idzie na cztery kolumny od
768 px, a poniżej jest 2 × 2.

**Powód (nazwa).** Tailwind v4 generuje własną utility `.container` z
`--breakpoint-*` i wygrywa w kaskadzie z warstwą `components`. Efekt: między 1024
a 1440 kontener dostawał `max-width: 1024px`, kolumna tekstu spadała do ~184 px
i nagłówek wychodził poza obrys — a przy 1440 i 390 wszystko wyglądało dobrze, bo
**to są wartości breakpointów**. Opisane jako `PLAYBOOK.md` `P-019`.

**Powód (1360).** Szyna ma sztywne 720 px, gap 40, a podtytuł mierzy 508 — układ
obok siebie potrzebuje 1268 px treści, czyli viewportu 1360. Próg jest wyliczony,
nie wybrany.

**Wyłapuje.** `tests/visual/responsive.spec.ts` — przemiatanie co 20 px od 360 do
1600 z asercjami na przelew elementów, wzór na szerokość kontenera, wyrównanie
szyny do prawej krawędzi treści i monotoniczność skali typografii. Poprzedni
zestaw testów sprawdzał 1440 i 390, czyli dokładnie te dwie szerokości, przy
których bug był niewidoczny.

## 2026-08-20 — `LogoWall`: Green jako drugi kolor systemu, kontrast ważniejszy od pliku

**Decyzja.** Do palety wchodzi `--color-green: #18a85b` (Figma: `Green`) i alias
semantyczny `--color-fg-accent`. Green jest dopuszczony **wyłącznie od 24 px
w górę**; nota o tym stoi przy tokenie, nie w tym pliku.

**Powód.** `#18a85b` mierzy **3,09:1** na bieli. WCAG 1.4.3 wymaga 3:1 dla dużego
tekstu i 4,5:1 dla reszty — czyli nagłówek 32/500 przechodzi z zapasem 0,09,
a to samo `color` na podpisie czy przycisku byłoby usterką dostępności. Ponieważ
oba kolory mają „przewijać się przez cały design", ograniczenie musi być
zapisane tam, gdzie ktoś sięga po wartość.

**Odstępstwa od Figmy w tym bloku** (komplet, z pomiarami, jest
w `apps/web/src/components/blocks/LogoWall.spec.md`):

| Figma | Build | Powód |
|---|---|---|
| podpis `opacity: 0.6` | 0,65 (`--color-fg-muted`) | 0,6 daje **4,04:1** przy 16 px regular, próg to 4,5. 0,65 daje **4,71:1** i jest najmniejszym krokiem, który przechodzi |
| loga 0,667 × eksport | 0,70 × eksport | rząd w projekcie ma 1270 px w ramce 1440, siatka strony daje sekcji 1360; znaki rozciągnięte o te same 3% co rząd trzymają przerwy na ~108 px zamiast rozjeżdżać je do 116 |
| lewa krawędź ~56 px | 40 px (`--container-gutter`) | cała strona stoi na jednej siatce, a hero był podpisany właśnie na 40. Krok o 16 px między pierwszą a drugą sekcją byłby widoczny; pytanie do grafika otwarte |

**Konsekwencja.** Skala typografii dostaje krok `--text-heading` (32/40/-2%/500).
Leading nie jest zmierzony — projekt stawia ten nagłówek w jednej linii — więc
40 jest wyprowadzone z metryk rodziny i wisi jako pytanie w spec-u.

## 2026-08-20 — Reveal poniżej folda: pauza animacji, nie druga ścieżka animacji

**Decyzja.** Sekcja, do której trzeba doscrollować, dostaje `data-reveal-group`.
Do momentu, w którym jeden obserwator (w `BaseLayout`, 352 B / 243 B gz) nada jej
`data-inview`, wszystkie animacje w środku stoją na `animation-play-state:
paused`. Klasy `.reveal*` i `--reveal-index` są dokładnie te same, co nad foldem.

**Powód.** Przy `animation-fill-mode: both` wstrzymana animacja renderuje swoją
pierwszą klatkę — czyli mechanizm „trzymania" jest już w kaskadzie i nie trzeba
dublować keyframe'ów, klas ani stanu. Alternatywa (druga rodzina klas
`.reveal-on-view` z własnymi `from`/`to`) to dwa opisy tej samej choreografii,
które rozjadą się przy pierwszej zmianie krzywej.

**Cena.** Wstrzymana animacja **nigdy** się nie posuwa, więc mechanizm ma dwa
tryby awarii, w których sekcja jest nie „bez ruchu", tylko niewidoczna: bez JS-a
(bramka `html.js`) i przy `prefers-reduced-motion`, gdzie globalny blok wygasza
ruch skróceniem czasu, co animacji stojącej nie robi nic. Oba są zamknięte
w `global.css` i pokryte testami; opis w `PLAYBOOK.md` `P-020`.

## 2026-08-20 — `BlockRenderer`: `block as never` przy drugim bloku w unii

**Decyzja.** Rejestr `blockType` → komponent dostaje typ
`{ [K in BlockType]: (props: { block: BlockOf<K> }) => unknown }`, a wywołanie
przekazuje `block as never`.

**Powód.** Indeksowanie rejestru kluczem z unii zwraca unię komponentów, a element
JSX o typie unii komponentów przyjmuje **przecięcie** ich propsów: `block` staje
się `HeroBlock & LogoWallBlock`, czyli `never`, bo `blockType` nie może być dwoma
literałami naraz. TypeScript nie ma zawężania unii skorelowanych — to nie jest
błąd w rejestrze, tylko brak w systemie typów. Sam rejestr sprawdza się dalej:
brakujący komponent i komponent podpięty do złego wariantu wciąż wywalają
`pnpm typecheck`. Alternatywa (`switch` z ręcznym zawężaniem) duplikuje rejestr
i psuje jego jedyną zaletę.

## 2026-08-20 — `ServiceCards`: rozwijanie na hover bez ani jednej linii JS

**Kontekst.** Kafel ma pokazywać sam tytuł, a po najechaniu odsłaniać opis
i przycisk. Odruchowe rozwiązanie to `<button aria-expanded>` plus skrypt, i ono
przynosi trzy problemy naraz: przycisk w kafelku, który sam jest linkiem, drugi
tab stop, oraz `aria-expanded`, które kłamie za każdym razem, gdy stan zmienił
wskaźnik, a nie kliknięcie.

**Decyzja.** Cały kafel jest `<a>`. Odsłonięcie wisi na `:hover` i `:focus-visible`
tego jednego elementu, przycisk w środku jest rysowany jako `<span>`
(`Button as="span"`), a plus/minus jest `aria-hidden` — to opis stanu wizualnego,
a wszystkie słowa, za które stoi, i tak są w nazwie dostępnej linku. Cała
choreografia zamykania siedzi w `@media (hover: hover)`; urządzenie dotykowe
dostaje trzy otwarte kafle, bo tam nie ma czym najechać.

**Konsekwencja.** 0 B JS, jeden tab stop na kafel, klawiatura widzi dokładnie to
samo co wskaźnik, i nie ma stanu ARIA, który mógłby się rozjechać z widokiem.
Kosztem jest to, że na dotyku nie da się kafla zwinąć — czyli zachowanie, którego
projekt i tak nie opisuje.

**Odwracalność.** Wysoka. Wersja z przyciskiem i skryptem dokłada się do tego,
nie zastępuje: `data-open` na kafelku i jedna reguła CSS więcej.

## 2026-08-20 — Wysokość nagłówka sekcji odtworzona, nie zgadnięta

**Kontekst.** Ramka do `ServiceCards` przyszła jako zrzut bez linku do node'a
i bez wymiarów typografii nagłówka. Podana była wielkość tytułu kafla (28/500)
i opisu (16/400).

**Decyzja.** Skala zrzutu wyliczona z jedynej podanej liczby, która jest
mierzalna w pikselach — 600 px wysokości kafla mierzy 474 px w pliku, czyli
0,78958. Stosunek wersaliki-do-stopnia wzięty z **podanego** tytułu 28 px (0,678),
a potem zastosowany do wersalika nagłówka: 40,5 / 0,678 = 59,8. Interlinia to
odległość między liniami bazowymi, 64,6. Wynik: `--text-headline` 60 / 64 / −2%.

**Konsekwencja.** Metoda jest ta sama, którą `LogoWall` zamknął skalę eksportu
logotypów, i tak samo nie wymaga wiary. Przy następnym zrzucie bez linku idzie się
tą drogą: znajdź jedną podaną liczbę, wylicz skalę, resztę zmierz.

**Odwracalność.** Trywialna — jedna wartość w `tokens.css`, jeśli grafik poda
prawdziwą.

## 2026-08-20 — `ServiceCards`: scrim i krycie opisu w górę, bo para z Figmy jest nieczytelna

**Kontekst.** Projekt podaje scrim `0,48 / 0,48 / 0,56` i opis na
`rgba(255,255,255,0.70)`. Na prawdziwych zdjęciach, mierzone pod glifami (metoda
`P-018`), najgorszy przypadek to **3,21 : 1** przy 4,5 wymaganych przez WCAG 1.4.3
dla tekstu 16 px o zwykłej grubości.

**Co przesądziło.** Odruch mówi „podbij tekst i nie ruszaj fotografii". Nie działa:
przy **100% bieli** i nietkniętym scrimie najgorszy przypadek to 4,70, czyli ledwo
przechodzi — i tylko dlatego, że tekst jest już czysto biały, więc znika różnica
tonalna między tytułem a opisem, którą projekt wyraźnie robi. Tło jest po prostu
za jasne; żaden kolor tekstu sam tego nie naprawi.

**Decyzja.** Ruszają obie wartości, każda możliwie mało. Z siatki scrim × krycie
wybrana para, która przechodzi z ~10% zapasu i zostawia opis widocznie
delikatniejszy od tytułu: scrim `0,56 / 0,56 / 0,63`, opis `0,85`. Najgorszy
zmierzony przypadek: **5,01 : 1** (opis), **5,70 : 1** (tytuł).

Krycie opisu dostaje **własny token** (`--service-card-copy-color`), a nie
podniesione `--color-on-media-muted` — tamto jest dostrojone do scrimu hero i nie
może iść za tym.

**Konsekwencja.** Dwie wartości z Figmy nie zgadzają się z plikiem i obie są
wypisane w `ServiceCards.spec.md` z pomiarem. Liczby należą do **tych trzech
zdjęć** — wymiana fotografii wymaga powtórzenia pomiaru.

**Odwracalność.** Trywialna, i oba tańsze warianty są policzone: opis na 100%
bieli przy scrimie z Figmy (4,70) albo opis na 0,70 przy plateau 0,61 (4,54).
Jeden token każdy.

## 2026-08-20 — Hover przycisku odpalany z kafla: pomyłka, którą pokazało dopiero prawdziwe zdjęcie

**Kontekst.** `Button` renderowany jako `<span>` w kafelku-linku dostał regułę
`:global(a:hover) .button`, żeby stan hover działał, gdy wskaźnik jest gdziekolwiek
na kaflu.

**Dlaczego to było złe.** Kafel jest otwarty dokładnie wtedy, gdy jest najechany —
więc przycisk był **zawsze** przygaszony, kiedy w ogóle był widoczny. Na atrapach
zdjęć tego nie było widać; na prawdziwym kadrze rzuca się w oczy, bo projekt
pokazuje czystą biel.

**Decyzja.** Reguła hover usunięta. `:hover` łapie `<span>` tak samo jak wszystko
inne, więc przycisk sam obsługuje swój stan na własnych granicach. Z kafla sięga
się już tylko po `:focus-visible`, bo klawiatura ląduje na kaflu i nigdy na
przycisku.

**Do zapamiętania.** Atrapa zdjęcia weryfikuje układ, nie wygląd. Stany na tle
fotografii ogląda się dopiero na prawdziwym pliku.


## 2026-08-20 — `TeamGrid`: kafel dostaje proporcję portretu, żeby dwa stany były jednym `scale()`

**Kontekst.** Projekt podaje trzy liczby, które nie mogą być prawdziwe naraz na
siatce strony: kafel ma 390 px wysokości, portret w spoczynku 180 × 215, a jego
proporcja to 36/43. Rząd w ramce ma ~1331 px przy marginesach ~55 — i przy tej
szerokości wszystko się zgadza, bo kafel wychodzi ~325 × 390, czyli 0,834 wobec
36/43 = 0,8372. Siatka strony to jednak 1360/40 (`LogoWall.spec.md` zgłosił tę
samą rozbieżność). Poszerzenie rzędu o 29 px musi gdzieś oddać 1,8%.

**Rozważane.** Albo w wysokości kafla (397 zamiast 390, portret dokładnie
180 × 215), albo w proporcji portretu (kafel 390, ale portret 181,6 × 213,1
i proporcja 0,8526 zamiast 36/43, przy każdej szerokości).

**Decyzja.** Oddane w wysokości. Kafel niesie `aspect-ratio: 36/43`.

**Powód — i to nie jest wierność dla samej wierności.** Wspólna proporcja kafla
i portretu sprawia, że stan spoczynku i stan wyróżniony różnią się **jedną
jednolitą wartością `scale()` na jednym elemencie**. Żadnej szerokości, żadnej
wysokości, żadnego `clip-path`, żadnego drugiego elementu odkręcającego
zniekształcenie pierwszego — czyli `transform` i `opacity`, tak jak wymaga
AGENT-RULES §6. Dodatkowo skala biegnie **w dół** od pełnego rozmiaru portretu,
a nie w górę od małego, więc przeglądarka rasteryzuje przy dużym rozmiarze
i zdjęcie jest ostre w obu stanach; w drugą stronę nie jest.

Poza tym 36/43 zostało podane **wprost jako proporcja**, czyli jako coś, co ma
się utrzymać przy skalowaniu, a 390 odczytane z jednej klatki o węższym rzędzie.

**Zmierzone.** Przy 1440: kafel 332,50 × 397,14, portret w spoczynku
**180,02 × 215,01**. Przy każdej innej szerokości proporcja portretu jest ta sama.

**Odwracalność.** Jeden token. `--team-tile-ratio: 332.5 / 390` przywraca
wysokość 390 i przenosi te 1,8% na portret.

## 2026-08-20 — `--color-bg-subtle` przestaje być prowizoryczne

**Kontekst.** Token trzymał zgadywane `#f4f5f3` z komentarzem „prowizoryczne —
nie ma jeszcze zaprojektowanej jasnej sekcji". `TeamGrid` jest pierwszą taką
sekcją i podaje realną wartość: `#F1F2EB`.

**Decyzja.** Wartość podmieniona, komentarz „prowizoryczne" zdjęty. Token nie był
nigdzie używany, więc podmiana niczego nie rusza. Dołączają do niego
`--color-bg-muted` (`#E4E5DC`, tło kafla) i `--color-sage` (`#ABAD9E`, znacznik
LinkedIn w spoczynku) — żaden z tych dwóch nie jest Lime-Dark z kryciem,
sprawdzone kanał po kanale, więc obie są wartościami własnymi, nie odcieniami.

## 2026-08-20 — Kontrast wyszarzonej połowy nagłówka: 2,98 przy progu 3,0, świadomie wysłane jak jest

**Kontekst.** Druga linia nagłówka `TeamGrid` to `rgba(23,46,35,0.50)` na
`#F1F2EB`. Wychodzi **2,98 : 1** wobec 3,0 wymaganych przez WCAG 1.4.3 dla tekstu
≥ 24 px. Chybia o 0,02, czyli o błąd zaokrąglenia.

**Decyzja.** Zostaje wartość z projektu. Klient wprost odłożył mierzenie
kontrastu w tej sekcji na później i będzie ją oglądał na żywym organizmie.

**Odwracalność.** `0.51` zamiast `0.50` przechodzi próg. Jeden token
(`--color-fg-subtle`), zero zmian w komponencie.

**Otwarte.** Cała reszta kontrastu w tej sekcji — biel i `rgba(255,255,255,0.6)`
na fotografii pod 120-pikselowym przyciemnieniem — **nie została zmierzona**.
`ServiceCards` pokazał, że akurat ta klasa wartości potrafi nie przejść o 30%,
więc to jest dług, nie formalność.

## 2026-08-20 — Sekcja przypięta na scroll robiona w CSS, nie w JavaScripcie

**Kontekst.** `OurProcess` to sekcja zpinowana: napis rośnie i znika, a potem
cztery slajdy wymieniają się w miejscu, wszystko sterowane pozycją scrolla.
Standardowa odpowiedź na taki brief to GSAP ScrollTrigger albo własny obserwator
mapujący `scrollY` na postęp.

**Decyzja.** Mechanizmem jest `position: sticky` plus **jedna** `view-timeline` na
sekcji, czytana w zakresie `contain`; każdy ruch to zakres na tej samej osi.
Zero bajtów JavaScriptu, animacje na kompozytorze, `transform` i `opacity` tylko.
Metoda i jej pułapki są opisane w `PLAYBOOK.md` `P-025`, bo nie mają nic
wspólnego akurat z tym projektem.

**Cena.** Przeglądarka bez scroll-driven animations nie dostaje sekwencji.
Dostaje za to pełną treść: cztery slajdy jeden pod drugim, każdy element w stanie
docelowym, bez przypięcia. Ten sam układ dostaje osoba z
`prefers-reduced-motion: reduce` — jeden układ zapasowy zamiast dwóch, i to jest
połowa powodu, dla którego ta droga jest tańsza niż biblioteka.

**Odwracalność.** Cała sekwencja to jeden blok `@supports` w komponencie.

## 2026-08-20 — `Gray` (`#565D59`) wchodzi do palety jako wartość własna

**Kontekst.** Opis pod zdjęciem w `OurProcess` ma podany kolor `var(--Gray,
#565D59)`. Sprawdzone kanał po kanale, czy to nie Lime-Dark z kryciem: wychodzi
0,73 na czerwonym i 0,78 na zielonym, więc żadne jedno krycie tego nie
odtwarza.

**Decyzja.** `--color-gray` jako surowa wartość plus alias semantyczny
`--color-fg-note`. Osobno od `--color-fg-muted`, które **jest** odcieniem
Lime-Dark i ma iść za nim wszędzie tam, gdzie Lime-Dark się zmieni; ten kolor ma
zostać tam, gdzie postawił go projekt. 6,9 : 1 na bieli.

## 2026-08-20 — 300-pikselowy znak wodny nie jest nagłówkiem sekcji

**Kontekst.** `OurProcess` otwiera napis „Our process" w 300 px, Lime-Dark
z kryciem 0,1. To mierzy **1,16 : 1** na bieli. Naturalny odruch to zrobić z tego
`<h2>` — jest duży i mówi, o czym jest sekcja.

**Decyzja.** Napis jedzie z krycia 0,1 dokładnie tak, jak w projekcie, ale jest
`aria-hidden`, a nagłówkiem sekcji jest ukryta wizualnie kopia tych samych słów.
Powód: to jest znak wodny, nie nagłówek — wysłanie go jako `<h2>` byłoby
twierdzeniem, że tekst jest czytelny, czego projekt nie obiecuje. Drzewo
dostępności nie dostaje przy tym ani jednego słowa, którego nie widzi też osoba
patrząca na ekran.

**Otwarte.** Jeśli grafik chce, żeby ten napis był czytelny, wraca jako `<h2>`
przy kryciu ~0,30 (3,0 : 1 dla tekstu ≥ 24 px). To jedna liczba w tokenie
`--process-wordmark-color`.


## 2026-08-20 — Slider `MarketSlider` bez ani jednej linii JS: radio + `--active`

**Kontekst.** Sekcja „Poland is our first market" to slider: trzy ilustracje,
para strzałek w prawym górnym rogu. Odruch to biblioteka albo dwadzieścia linii
własnego skryptu i hydracja jednego komponentu.

**Decyzja.** Stan trzyma grupa `<input type="radio">` — po jednym na slajd,
`position: absolute`, widocznie schowane, ale nadal fokusowalne. Arkusz zamienia
„który radio jest zaznaczony" na `--active` (liczbę całkowitą na `.market__body`,
przez `:has()`), a obie ruchome części — taśma ze zdjęciami i taśma z parami
strzałek — czytają tę jedną liczbę. Widoczne strzałki to `<label for>`.

**Powód.** Trzy rzeczy za darmo, których skrypt musiałby się dorobić: stan
przeżywa bez hydracji, strzałki klawiatury przełączają slajdy, bo grupa radio już
tak działa, i przeglądarka sama ogłasza pozycję i liczbę slajdów bez ani jednego
atrybutu ARIA. Blok kosztuje **0 B**.

**Cena.** Wyprowadzenie `--active` to jedna statyczna reguła CSS na pozycję, więc
liczba slajdów jest ograniczona w schemacie (`max(5)`) i szósty slajd wymaga
szóstej reguły — inaczej po cichu pokaże piąty. Ograniczenie jest opisane
w schemacie i w komponencie, w obu miejscach z tym samym powodem.

**Druga cena.** `<label>` nie przyjmuje fokusu, a radio ma piksel szerokości —
pierścień fokusu jest więc rysowany na parze strzałek, nie na przycisku. Osoba
z czytnikiem ekranu dostaje grupę radio, a nie dwa przyciski „poprzedni/następny";
to jest znany kompromis slidera bez JS i jest wypisany w spec-u.

## 2026-08-20 — `--text-claim` (22/28/500) jako własny stopień skali

**Kontekst.** Opis w `MarketSlider` ma podane 22 px i grubość 500. W skali stoją
`--text-unit` (24) i `--text-body` (16), nic pomiędzy.

**Decyzja.** Nowy stopień `--text-claim`, 22/28/500. Interlinia zmierzona
z ramki: cztery wiersze opisu stoją co 17 px przy skali 0,6, czyli 28,3.

**Powód.** Ten sam, dla którego `--text-caption` i `--text-ui` są osobne mimo
identycznego rozmiaru: skala jest nazwana rolą, a nie rozmiarem. `--text-unit` to
przyrostek przy liczbie, `--text-lead` to lid pod 72-pikselowym nagłówkiem hero,
a to jest akapit, który ma się czytać jak teza obok obrazka. Dociągnięcie go do
24 zmieniłoby łamanie wierszy, które w ramce jest narysowane wprost.

## 2026-08-20 — Wcięcie w `MarketSlider` zostaje na podanych 20 px, mimo pomiaru 28

**Kontekst.** Podana wartość to 20 px. Ramka mierzy 28,3 px od lewej linii do
krawędzi przycisku i 30 px od jego stopki do dołu skrzynki (skala 0,6, błąd
odczytu ±1,7 px na każdą) — czyli dwa niezależne odczyty, oba przy 28, a nie przy
20. Na siatce 4 px obie lądują na 28.

**Decyzja.** Ships podana dwudziestka; rozbieżność jest zapisana w
`MarketSlider.spec.md` jako pytanie do grafika. Wartość podana wprost wygrywa
z odczytem z rastra, ale odczyt nie jest przemilczany.

**Odwracalność.** Jeden token: `--market-pad`.

## 2026-08-20 — Gest przeciągania w `MarketSlider`: 470 B, i ani bajta więcej

**Decyzja.** Slider dostaje przeciąganie palcem i myszą. Skrypt (470 B gz,
inline) robi dokładnie jedno: zaznacza radio, a w trakcie gestu ustawia jedną
liczbę `--drag`. Cała reszta — pozycja taśmy, animacje, stan — zostaje w CSS.

**Powód.** Machnięcia palcem nie da się wyrazić w CSS, a slider na telefonie,
którego nie da się machnąć, czyta się jako zepsuty. Granica jest przy tym
postawiona tak, żeby skrypt nie stał się drugim źródłem prawdy: usunięty,
zablokowany albo jeszcze niepobrany nie zmienia niczego poza brakiem gestu —
strzałki to `<label>`, klawiatura to grupa radio, animacje to CSS.

**Próg.** Jedna dziesiąta szerokości zdjęcia, nie więcej niż 60 px. Sam ułamek
kazałby na telefonie machać przez pół ekranu; sama liczba stała zmieniałaby
slajd przy 640-pikselowym zdjęciu od drgnięcia ręki.

**`touch-action: pan-y`** na scenie: ruch poziomy należy do slidera, pionowy
zostaje przy stronie. Bez tego przeglądarka czeka, w którą stronę pójdzie palec,
i pierwsze ~100 ms każdego machnięcia jest stracone.

## 2026-08-20 — Zdjęcia w sliderze nie wychodzą poza stronę: trzy zamknięte drzwi

**Kontekst.** Natywne drag-and-drop obrazka przechwytuje wskaźnik w połowie
machnięcia i zostawia widmo zdjęcia na kursorze — a przy okazji pozwala wyciągnąć
plik poza przeglądarkę.

**Decyzja.** `draggable="false"` w znaczniku (działa wszędzie i **nie wymaga
skryptu** — dlatego `Picture.astro` dostał ten prop, zamiast ustawiać atrybut
z JS), `-webkit-user-drag: none` w arkuszu na ścieżkę WebKita, i `dragstart`
z `preventDefault()` na scenie jako domknięcie.

**Powód.** Kolejność jest celowa: pierwsza droga jest standardowa i statyczna,
więc obowiązuje także wtedy, gdy skrypt nie wystartował. Trzecia jest ostatnia
i najtańsza, ale sama byłaby obietnicą zależną od JS.

## 2026-08-20 — Opis wjeżdża słowo po słowie, nie wierszami

**Kontekst.** Prośba brzmiała „linijki tekstu niech się animują osobno".

**Decyzja.** Animowane jest **słowo**, z opóźnieniem równym jego pozycji w
zdaniu (26 ms na słowo). Sąsiednie słowa mają sąsiednie opóźnienia, więc wiersz
i tak czyta się jako jeden ruch — fala przechodząca przez zdanie.

**Powód.** Gdzie łamie się wiersz, zależy od miary, kroju i szerokości okna —
żadna z tych rzeczy nie jest znana w czasie builda. Podział po realnych wierszach
oznacza mierzenie line boxów w przeglądarce i mierzenie ich ponownie przy każdej
zmianie rozmiaru okna, żeby animować tekst, który został już raz przeczytany.

**Mechanizm, i to jest ta niestandardowa część.** Animacja jest włączana
**nazwą** (`--market-line`, ustawiane tylko na aktywnym slajdzie), nie klasą ani
tranzycją. Właściwość, która wraca z nazwy na `none`, startuje od zera przy
następnym ustawieniu — dzięki temu tekst wjeżdża **za każdym razem**, gdy slajd
wraca. Tranzycja nie umie się powtórzyć.

**Pułapka po drodze.** `animation: var(--market-line, none) 900ms <ease> both`
parsuje się z zamienionymi polami: `none` jest legalne i dla `animation-name`,
i dla `animation-fill-mode`, więc przeglądarka bierze **`both` jako nazwę**
animacji. Zmierzone — computed `animation-name` zwracał `both`. Stąd longhandy
zamiast skrótu, w obu miejscach.

## 2026-08-20 — Opis i CTA należą do bloku, nie do slajdu

**Kontekst.** Materiały do sekcji to jedno zdanie, jeden przycisk i trzy rysunki
(mapa Polski, ta sama mapa na globusie, globus z mapą wyciągniętą obok).

**Decyzja.** `description` i `cta` są polami bloku, a taśma przesuwa wyłącznie
ilustrację. Slajdy 2 i 3 nie dostają wymyślonego tekstu i nie dostają kopii tego
samego zdania przenikającej samo w siebie.

**Powód.** Nie zmyślamy treści, a duplikat tego samego akapitu w trzech slajdach
wygląda na ekranie jak usterka, nie jak brak treści. Trzy rysunki są wariantami
jednej ilustracji, więc „jedno zdanie, trzy rysunki" jest spójnym czytaniem
materiałów.

**Zmienione tego samego dnia, po uwadze klienta („raczej będą inne teksty per
slajd").** `slides[].description` i `slides[].cta` istnieją jako pola
**opcjonalne**, a slajd bez własnego zdania pożycza zdanie bloku. Kopia jest
renderowana per slajd, przenika przy zmianie i wjeżdża słowo po słowie — więc
dosłanie treści dla slajdów 2 i 3 jest zmianą wyłącznie w JSON-ie. Nadal nie
zmyślamy tekstu i nadal nie ma w JSON-ie tego samego zdania trzy razy.

## 2026-08-21 — Nieaktywne pytanie w `AudienceTabs` idzie na ekran przy 1,47 : 1

**Kontekst.** Projekt podaje wprost: pytanie nieaktywne to ten sam Lime-Dark co
aktywne, przy `opacity: .2`. Na tle `#F1F2EB` to **1,47 : 1**, przy progu 3 : 1,
którego WCAG 1.4.3 wymaga od tekstu ≥ 24 px.

**Decyzja.** Ship jak w projekcie, z pytaniem do grafika i policzoną odpowiedzią
domyślną: pierwsza alfa nad progiem to **0,51** (3,03 : 1).

**Powód, i dlaczego to nie jest to samo co dwa poprzednie odstępstwa.** Przy
`Hero` i `ServiceCards` kontrast został podniesiony wbrew Figmie, bo chodziło
o tekst na fotografii — tam wartość z projektu nie działała w ogóle, a zmiana
była niewidoczna. Tutaj wartość jest **czytelnym elementem języka wizualnego**:
trzy pytania, z których jedno jest wybrane, a dwa są ledwo obecne. Podbicie do
0,51 zmienia tę kompozycję, a nie tylko ją naprawia — to jest decyzja grafika,
nie programisty.

**Czego to jednak nie usprawiedliwia.** To nie jest podpis pod zdjęciem, tylko
**przełącznik**, który trzeba przeczytać, żeby wiedzieć, że w ogóle istnieje. Stan
hover (0,5 — nasz, w Figmie go nie ma) łagodzi to myszą, ale nie dotykiem
i nie przy pierwszym spojrzeniu. Pytanie jest wypisane w `AudienceTabs.spec.md`
jako pierwsze i jest jedynym otwartym punktem tej sekcji, który dotyczy
użyteczności, a nie estetyki.

## 2026-08-21 — Na mobile pytania `AudienceTabs` stają się przewijanym paskiem

**Kontekst.** Sekcja ma jedną klatkę, przy 1440. Na wąskim ekranie dwie połowy
po 675 px nie istnieją, a najdłuższe pytanie („Buy or Selling a Project?") nie
mieści się w jednej linii w połowie węższej niż ~420 px.

**Decyzja.** Poniżej 1024 px pytania przenoszą się **nad** zdjęcie jako poziomy
pasek przewijany ze snapowaniem, wypuszczony poza gutter do krawędzi ekranu,
bez beżowego tła. Zdjęcie zostaje pod nim, na pełnej szerokości i z tą samą
wysokością 500 px.

**Powód.** Trzy pytania jedno pod drugim na telefonie to pół ekranu tekstu, który
w 2/3 jest wyszarzony — czyta się jak lista, a nie jak przełącznik. Pasek mówi
„jest tego więcej w bok" tym samym gestem, którym się go obsługuje. Tło znika,
bo prostokąt 350 × 48 z beżowym wypełnieniem nie jest już tą samą formą co
połowa pasma — jest ramką wokół trzech słów.

**Czego to nie rusza.** Mechanizm zostaje ten sam (grupa radio), więc klawiatura
działa identycznie na obu układach, a przeglądarka sama dowozi zafokusowane
pytanie do widoku — sprawdzone przy 390 px. Próg 1024 to zapas, nie granica:
układ z projektu trzyma się do ~940 px.

## 2026-08-21 — Domknięcie strony i stopka są treścią globalną, nie blokiem

**Kontekst.** CTA i stopka mają być na końcu strony głównej **i każdej innej**.
Do wyboru były dwie drogi: blok w `blocks` każdej strony albo treść globalna
w `content/globals/site.json`.

**Decyzja.** Globalna. `site.cta` i `site.footer` w `site.json`, wystawione przez
`SiteSettings`, renderowane przez `BaseLayout` — CTA wewnątrz `<main>`, stopka
poza nim. Tabela w `AGENTS.md` już mówi „treść globalna (menu, CTA) →
`content/globals/site.json`", więc to jest wykonanie tej reguły, a nie wyjątek
od niej.

**Powód.** Blok trzeba by dopisać do fixture'u każdej nowej strony i nikt tego
nie dopilnuje; treść globalna sprawia, że strony **nie da się opublikować bez
domknięcia**. Dodatkowo obie sekcje mają dokładnie jedno zdanie na całą witrynę —
to jest definicja treści globalnej, a nie bloku.

**Kiedy to przestanie być prawdą.** Gdy któraś strona będzie potrzebowała
własnego CTA. Wtedy powstaje blok `cta`, a globalny zostaje jako domyślny —
strona z własnym blokiem po prostu go nadpisuje. Dziś takiej strony nie ma.

**Czego to nie rusza.** CTA jest **w `<main>`**, bo jest treścią: ktoś, kto
skacze linkiem „Skip to content" i czyta do końca, ma dojść do wezwania, a nie
je przeskoczyć. Stopka zostaje poza `<main>`.

## 2026-08-21 — Etykiety grup w stopce zostają na 0,5, mimo 3,04 : 1

**Kontekst.** Sześć etykiet nad danymi kontaktowymi („Warsaw Office", „Company
details", …) jest w projekcie Lime-Dark na 0,5. Na bieli daje to **3,04 : 1**
przy 4,5 : 1 wymaganym dla tekstu 16 px (WCAG 1.4.3).

**Decyzja.** Ship jak w projekcie, z policzoną odpowiedzią domyślną: pierwsza
alfa nad progiem to **0,68** (4,52 : 1), i wciąż wyraźnie ciszej niż linie pod
spodem.

**Powód, i dlaczego tak samo jak przy `AudienceTabs`.** To nie jest tekst na
fotografii, gdzie wartość z Figmy po prostu nie działa i podbicie jest
niewidoczne. To jest **element języka wizualnego**: etykieta ma być cichsza od
danych, które opisuje. Zmiana alfy zmienia tę hierarchię, a nie ją naprawia —
i jest decyzją grafika.

**Czego to jednak nie usprawiedliwia.** Etykieta niesie sens („to jest adres
biura, a to dane rejestrowe"), więc różni się od podpisu ozdobnego. Pytanie jest
pierwszym punktem w `Footer.spec.md`.

## 2026-08-21 — Dwa nowe stopnie skali: `--text-standfirst` (20) i `--text-detail` (16/500)

**Kontekst.** Domknięcie strony podaje linię 20/500, a stopka listy 16/500.
W skali były 22 (`--text-claim`), 16/400 (`--text-body`) i 16/500 na 16 leading
(`--text-ui`, przycisk i nawigacja) — żaden nie jest tym, co podano.

**Decyzja.** Dwa nowe stopnie, nazwane rolą: `--text-standfirst` (20/28/500) —
zdanie pod nagłówkiem 72; `--text-detail` (16/24/500) — linia na liście: link
w stopce, adres, numer, copyright.

**Powód.** Ta sama zasada, która trzyma resztę skali: jeden stopień = jedna rola,
z własnym leadingiem i wagą, żeby żaden komponent nie sparował rozmiaru z cudzą
interlinią. `--text-detail` nie jest `--text-body` z podbitą wagą (proza kontra
lista) ani `--text-ui` z inną interlinią (kontrolka kontra tekst do czytania).
Leading 24 jest **zmierzony** (18,7 px kadru w skali 0,768); leading 28 przy 20 px
jest wyprowadzony — pytanie zostaje w `Cta.spec.md`.

## 2026-08-21 — `PageHero` jest osobnym blokiem, nie wariantem `Hero`

**Kontekst.** Cztery podstrony (`about-us`, `brokerage`, `develop-to-sell`,
`develop-to-hold`) otwierają się ekranem, który jest stosem tekstu z hero strony
głównej — 72 px nagłówka, 28 px linii pod nim, 72 px od stopy bloku — ale na
nieruchomym zdjęciu, wyśrodkowany, bez wideo, bez listwy liczb i bez przycisku.

**Decyzja.** Drugi blok (`pageHero`), a nie pola opcjonalne w `Hero`.

**Powód.** Gdyby to był wariant, `video`, `stats` i `cta` musiałyby stać się
opcjonalne — i w etapie 2 redaktor podstrony dostałby w Payloadzie cztery pola,
których żaden projekt podstrony nigdy nie narysował. Dwa bloki to dwie odpowiedzi
na dwa pytania. Wartości, które są wspólne (20 px nagłówek → linia, 72 px do
stopy), są wspólnymi tokenami, nie wspólnym komponentem.

**Konsekwencja.** `getLcpPreload()` i `headerTone` w `[...slug].astro` rozpoznają
teraz dwa typy bloku otwierającego stronę, każdy z własną drabinką `widths`.

## 2026-08-21 — Efekt „sekcja najeżdża na hero" to `sticky` + `z-index: -1`, i gaśnie przy `reduce`

**Decyzja.** Hero podstrony jest `position: sticky; top: 0; z-index: var(--z-media)`.
Reszta strony przewija się po nim, bo każda sekcja maluje własne nieprzezroczyste
tło, a tła elementów blokowych są malowane **nad** warstwą ujemnego indeksu.
Zero linii JavaScriptu, zero obserwatorów, zero `transform`.

**Powód.** Alternatywy — scroll listener, `view-timeline` z `translate`, wrapper
z `transform` — kosztują albo bajty, albo warstwę kompozytora na pełnoekranowym
zdjęciu. Ta wersja nie kosztuje nic, bo nie animuje niczego: pozycjonuje.

**Czego to wymaga, i to jest część decyzji.** Blok pod hero **musi** mieć
nieprzezroczyste tło (`.metric` deklaruje je wprost, z komentarzem dlaczego), a
między sekcją a `<main>` nie może powstać kontekst stackingu — dlatego `PageHero`
świadomie **nie** kopiuje `isolation: isolate` z `Hero`.

**Przy `prefers-reduced-motion: reduce` `sticky` znika.** Pełnoekranowe zdjęcie
trzymane w miejscu, gdy strona po nim jedzie, to paralaksa — a paralaksa jest
dokładnie tym, do czego to zapytanie służy. Reszta bloku nie zmienia ani jednej
wartości.

## 2026-08-21 — Podstrony mają własne scrimy, głębsze niż hero strony głównej

**Kontekst.** Hero strony głównej pilnuje jednego klipu i ma pod niego dobraną
parę gradientów. Podstrony mają cztery niezwiązane ze sobą fotografie, a jedna
z nich (Dev-to-Sell) ma białe kontenery bateryjne dokładnie pod tekstem i jasne
niebo dokładnie pod nawigacją.

**Decyzja.** Dwa własne tokeny: `--page-hero-scrim-top` (0,50 / 0,70 zamiast
0,44 / 0,64) i `--page-hero-scrim-bottom` (0,36 / 0,60 / 0,80 zamiast
0,28 / 0,48 / 0,66). Wysokość górnego pasma zostaje 145 px.

**Powód.** Na wartościach ze strony głównej zmierzone pod glifami wychodzi:
standfirst 3,56 : 1 przy wymaganych 4,5, nagłówek About us 2,91 : 1 przy 3,
nawigacja 4,28 : 1 przy 4,5. Obie pary są **najpłytszymi** punktami przemiatania,
które mieszczą się nad progiem z tym samym ~13% zapasu — każdy dodatkowy procent
alfy to wyrzucona fotografia.

**Czego to nie robi.** Nie rusza tokenów hero strony głównej. Dwa bloki, dwa
zestawy zdjęć, dwa pomiary — wspólna wartość musiałaby być głębsza z nich obu
i pociemniłaby klip, który nie ma z tym problemu.

## 2026-08-21 — Figura 300 px zostaje poza skalą typograficzną, i poza drzewem dostępności

**Kontekst.** Sekcja pod hero podstrony usługowej stawia liczbę (`140`, `700`,
`+500`) na 300 px w Lime-Dark z alfą 0,1, a obok niej zdanie, które tę liczbę
tłumaczy.

**Decyzja.** `--metric-figure-size` jest tokenem komponentu, nie stopniem skali.
Figura jest `aria-hidden`, a `description` **musi** podawać liczbę słowami.

**Powód.** Skala jest lista ról („jeden stopień = jedna rola"); 300 px nie jest
rolą, którą cokolwiek innego kiedykolwiek weźmie, a wstawienie go tam byłoby
zaproszeniem, żeby spróbować. Co do dostępności: Lime-Dark na 0,1 to **1,2 : 1**.
Ogłoszona czytnikowi ekranu byłaby treścią o kontraście 1,2; ukryta i powtórzona
w zdaniu obok jest tłem — i zdanie z projektu i tak zaczyna się od „With 140 MW
of…". Test pilnuje obu połówek tej decyzji naraz.

## 2026-08-21 — `quality` jako opcjonalny props `Picture`, ustawiony tylko tam, gdzie jest pomiar

**Decyzja.** `<Picture>` przyjmuje `quality`. Domyślnie nie jest przekazywany;
`PageHero` przekazuje `PAGE_HERO_QUALITY = 45`.

**Powód.** Przy domyślnej jakości kandydat 1280 px zdjęcia Dev-to-Sell waży
118 kB, co na profilu mobilnym Lighthouse'a (390 px, DPR 3, 1,5 Mb/s) daje LCP
1,95 s i **99** zamiast 100. Na 45 ten sam plik waży 96 kB, LCP schodzi do 1,80 s
i wszystkie pięć adresów ma 100/100/100/100. Różnicy nie widać na zrzucie —
sprawdzone.

**Czego to nie robi.** Nie zmienia wartości domyślnej dla całego projektu. Liczba
w wywołaniu `Picture` jest deklaracją „to zdjęcie porównano na dwóch ustawieniach
i niższe się obroniło" — miejsce na ten pomiar jest w spec-u bloku, a nie
w globalnym configu.

**Pułapka, którą to odsłoniło.** `quality` wchodzi do klucza nazwy pliku, więc
preload bez niego generuje drugi komplet plików i przeglądarka pobiera oba
(LCP 2,55 s). `PLAYBOOK.md` `P-032`.

## 2026-08-21 — Siatka sekcji na 40 px, mimo że ramka rysuje ~55 — i tym razem wiadomo, że to ramka

**Kontekst.** `LogoWall.spec.md` i `TeamGrid.spec.md` zgłaszały rozbieżność ~15 px
między lewą krawędzią sekcji w Figmie a siatką strony (1360/40) i **nie mogły
rozstrzygnąć**, czy to wina kadru rysowanego w nieznanej skali, czy projektu.

**Decyzja.** Wszystko na siatce strony (`container-page`), jak dotąd.

**Powód, i to jest nowa informacja.** Ramka podstron zawiera header i sekcję
w **jednym** kadrze: logo siedzi na 40,6 px, a nagłówek sekcji pod nim na 55,0
i figura na 54,5. Skala kadru jest ustalona dwiema niezależnymi drogami, które
zgadzają się co do ćwierci procenta. Rozbieżność jest więc **wewnątrz projektu**,
a nie w odczycie — pytanie do grafika przestaje być „jaka jest skala kadru?"
i staje się „która z tych dwóch krawędzi jest właściwa?”. Zapisane w
`PageHero.spec.md`.


## 2026-08-21 — Zdjęcie `ProcessIntroduction` startuje po `intersection + decode`

**Decyzja.** Fotografia ma własny mały obserwator. Po wejściu ramki w viewport
promuje jej `loading` do `eager`, czeka na `load` i `decode()`, a dopiero
potem zwalnia 1,3-sekundowe odmaskowanie. Teksty nadal używają wspólnego
obserwatora sekcji.

**Powód.** Zdjęcie leży około 470 px poniżej nagłówka, więc trigger całej sekcji
kończył ruch poza ekranem. Po przeniesieniu triggera na zdjęcie ujawnił się
deadlock: całkowicie przycięty obraz lazy nie zaczynał pobierania, a animacja
czekała na jego dekodowanie. Samo wymuszenie pobrania od początku strony
naprawiłoby ruch kosztem zbędnego requestu wiele sekcji poniżej folda.

**Koszt.** Poniżej 1 KB skryptu lokalnego dla bloku. To uzasadniony wyjątek od
0 B: synchronizuje realną gotowość pikseli, czego CSS nie potrafi odczytać.
Klasa pułapki i sposób sprawdzenia klatki pośredniej: `PLAYBOOK.md` `P-034`.

## 2026-08-21 — `ProofPoints` jest jednym blokiem, a kontakt na razie częścią strony

**Decyzja.** Trzy sekcje „Built…” korzystają z jednego bloku `proofPoints`.
Różnią się wyłącznie nagłówkiem, metrykami i grafiką. Wizytówka Michała ma ten
sam kształt danych w każdej instancji, ale w etapie 1 pozostaje jawnie powtórzona
w trzech fixture'ach zamiast rozszerzać `SiteSettings` o osobę kontaktową.

**Powód.** Wspólny komponent daje jedną edycję geometrii już teraz. Wspólna edycja
treści kontaktu jest osobnym problemem modelu CMS; dziś jedna osoba nie jest
jeszcze treścią globalną całej witryny, tylko kontaktem tych trzech produktów.
Przeniesienie jej przedwcześnie do `site.json` ukryłoby zależność podstron od
konkretnej osoby i utrudniło późniejszy wariant z innym opiekunem produktu.

**Furtka.** W etapie 2 `contact` może stać się relacją do kolekcji zespołu albo
globalem kontaktów produktowych bez zmiany komponentu — adapter nadal ma zwrócić
ten sam obiekt `{ name, role, email, portrait }`.

## 2026-08-21 — Zielony mail 14 px w `ProofPoints` jest wyjątkiem od palety

**Kontekst.** Brief podaje wprost Green, 14/400 i podkreślenie. Green na bieli ma
3,09 : 1, a normalny tekst 14 px wymaga 4,5 : 1. Dotychczasowy alias
`--color-fg-accent` dopuszcza Green tylko dla dużego tekstu.

**Decyzja.** Sekcja zachowuje wartość z briefu przez osobny, lokalny token
`--proof-contact-email-color`; nie rozszerzamy semantyki `--color-fg-accent` na
mały tekst. Podkreślenie zostaje stałe, więc link nie polega wyłącznie na kolorze.

**Konsekwencja.** To nadal nie spełnia WCAG 1.4.3 i jest otwartym pytaniem do
grafika, nie „naprawą” kontrastu. Najprostsza odpowiedź to ciemniejszy wariant
zieleni osiągający 4,5 : 1 albo Lime-Dark przy zachowaniu podkreślenia.

## 2026-08-21 — Porównanie Retained / Ad-Hoc zachowuje dwie wartości poniżej 4,5 : 1

**Kontekst.** Brief podaje wprost Lime-Dark 18/400 na `opacity: 0.6` dla wartości
w tabeli oraz biały opis 16/400 na Green w dołączonym CTA. Po skomponowaniu
kolorów tekst tabeli mierzy 3,88 : 1 na zielonym tle 0,1 i 3,89 : 1 na tle
Lime-Dark 0,05. Biały opis na Green mierzy 3,09 : 1. Wszystkie trzy przypadki
są zwykłym tekstem i wymagają 4,5 : 1.

**Decyzja.** Wartości zostają dokładnie jak w briefie na czas domknięcia etapu.
Nie ukrywamy odchylenia przez semantyczny alias: tabela ma lokalny token
`--engagement-value-color`, a CTA bierze jawnie biały kolor na Green.

**Konsekwencja.** Blok jest `in progress`, nie `done`. W odłożonym audycie trzeba
wrócić po decyzję grafika: podnieść alfę tabeli do wartości przechodzącej 4,5 : 1
i użyć ciemnego opisu w CTA albo ciemniejszego wariantu Green. Nagłówek CTA 40/500
przechodzi jako duży tekst przy progu 3 : 1.

## 2026-08-31 — Stopka jest niższa niż w Figmie: 584 → 504 px

**Kontekst.** Feedback klienta: „Footer is too tall, we need to thin it down height
wise". Zmierzona stopka miała 584 px na 1440 i **1666 px na 390** — prawie dwa
ekrany telefonu na blok, który jest nawigacją zapasową i sześcioma grupami danych
kontaktowych.

**Decyzja.** Wysokość schodzi wyłącznie z wartości, które są powietrzem, nie
treścią: padding bloku 64 → 48 i odstęp między grupami kontaktu 72 → 48. Nic poza
tym się nie rusza — stopnie typograficzne, trzy tory kolumn, rytm nawigacji 40 i
miara kontaktu 208 + 48 zostają jak narysowane. W układzie zwiniętym (< 1024) obie
wartości schodzą jeszcze raz, do 40, a nawigacja idzie na dwie kolumny; para
kontaktowa trzyma dwie kolumny do 480 zamiast do 560, bo razem z torami zwęża się
też jej przerwa.

**Powód.** Odchylenie od Figmy jest tu tańsze niż alternatywy. Zmiana stopni
typograficznych ruszyłaby skalę używaną w całej witrynie, a przerzucenie kontaktu
na trzy kolumny nie mieści miary 208, przy której najdłuższa linia adresu
(201,2 px) stoi w jednym wierszu.

**Konsekwencja.** Zmierzone: 1440 — 584 → 504, 390 — 1666 → 1282. Odchylenie jest
opisane jako punkt 6 w `Footer.spec.md` i wymaga potwierdzenia u grafika, tak samo
jak stojące tam wcześniej pytanie o dolny padding, którego crop nie obejmuje.

## 2026-09-03 — `TechnicalDepthTabs` przejmuje wygląd `HowWeDevelop`

**Kontekst.** Prośba klienta: sekcje „BESS revenue streams in Poland"
(Dev-to-Hold) i „Technical depth. Market access. Transaction experience."
(Brokerage) mają wyglądać tak samo jak „How We Develop" na About Us. Oba bloki
i tak dzieliły już strzałkę i przesunięcie etykiety o 38 px, ale różniły się
wszystkim innym: 18/500 na `opacity: 0.5` kontra 30/500 w pełnej sile, licznik
`01/03` kontra jego brak, opis dosunięty do stopy lewej kolumny kontra opis nad
medium w prawej.

**Decyzja.** `TechnicalDepthTabs` bierze z `HowWeDevelop` typografię wiersza,
kreskę `#E0E0E0`, zieloną etykietę aktywną, choreografię wejścia i stos
opis-nad-medium. Nie bierze ramki medium: zostaje 560 kwadrat w siatce
680/120/560. Liczniki `01/03` znikają.

**Powód.** Materiały są kwadratowe — trzy zdjęcia 560 × 560 i dwa wykresy SVG
590 × 590. Kadr 974:564 wymagałby nowych zdjęć poziomych i przerysowania obu
wykresów; przycięcie wykresu jest destrukcyjne, a nie kosmetyczne. Klient
wybrał wariant bez nowych materiałów.

**Konsekwencja.** Trzy rzeczy do domknięcia, wszystkie w
`TechnicalDepthTabs.spec.md`: (1) składanie do jednej kolumny przesunęło się
z 1024 na 1200 px, bo 30 px etykiety potrzebują ~360 px kolumny, a siatka daje
tyle dopiero od 1200; (2) lewa kolumna kończy się ~300 px nad stopą sekcji, bo
kwadrat 560 jest wyższy od kadru 394, który wyznacza tę samą pustkę w
`HowWeDevelop` — do decyzji grafika; (3) Dev-to-Hold łączy zakładkę „Ancillary
services" z plikiem `wholesale-arbitrage.svg`, którego grafika nosi tytuł
WHOLESALE ARBITRAGE — treści nie ruszaliśmy.
