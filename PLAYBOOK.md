# PLAYBOOK — workflow Astro + Payload

> Ten plik przyszedł z pilota (`adstic-astro`). Kod rozwiązuje problem klienta,
> **ten plik rozwiązuje problem następnego projektu** — a Stora jest tym
> następnym projektem, czyli pierwszym sprawdzianem playbooka w boju.
>
> Kryterium wpisu jest jedno: czy to się przyda, gdy za trzy miesiące ktoś
> zakłada nowe repo i chce mieć działający stack w godzinę, a nie w tydzień.
> Docelowo sekcje 1 i 4 stają się `README` startera, a sekcja 2 — jego testami.

---

## 0. Pochodzenie i synchronizacja

Ta kopia powstała 2026-08-20 przez przeniesienie scaffoldu z `adstic-astro`.
Od tego momentu istnieją **dwie** kopie tego pliku i będą się rozjeżdżać.

Reguła na czas, gdy nie ma jeszcze wydzielonego startera:

- wpis, który jest przenośny (przechodzi test przynależności niżej), dopisujesz
  tutaj **i** w `adstic-astro/PLAYBOOK.md` — w tym samym commicie po obu
  stronach, z tym samym ID `P-0XX`;
- ID są **wspólne dla obu repo**. Zanim nadasz nowe, sprawdzasz najwyższe
  zajęte w obu plikach. Kolizja ID jest gorsza niż dziura w numeracji.

To jest obejście, nie rozwiązanie. Docelowo playbook mieszka w jednym miejscu
(repo startera) i projekty go tylko czytają — patrz `DECISIONS.md`,
wpis „PLAYBOOK duplikowany, nie współdzielony".

---

## Podział ról między dokumentami

| Plik | Odpowiada na pytanie | Zakres | Żyje po projekcie |
|---|---|---|---|
| `AGENTS.md` | jak pracuję w tym repo | reguły obowiązujące teraz | ✅ jako szablon |
| `DECISIONS.md` | dlaczego **Stora** wygląda tak | ten projekt, chronologicznie | ❌ |
| `BLOCKS.md` | co jest zrobione | stan prac | ❌ |
| `PLAYBOOK.md` | co zabieramy do **następnego** projektu | przenośne, bezczasowe | ✅ **to jest cel** |

**Test przynależności.** Podmień w zdaniu słowo „Stora" na dowolną inną nazwę.
Jeśli zdanie traci sens — to wpis do `DECISIONS.md`. Jeśli nie traci — tutaj.

Wpisy mogą się parować: decyzja w `DECISIONS.md` opisuje **wybór**, pułapka tutaj
opisuje **koszt niewiedzy**. Linkujemy przez ID (`P-003`) i datę.

---

## Kiedy dopisujesz

Reguła, nie sugestia. Dopisujesz **w tym samym commicie**, w którym problem
został rozwiązany — nie „przy okazji później", bo wtedy zostaje sam fix bez
powodu, a powód jest jedyną częścią wartą przechowywania.

Wyzwalacze:

- straciłeś **> 15 min** na coś, czego nie widać w kodzie → **pułapka** (§2);
- coś działa lokalnie i pada w kontenerze, albo odwrotnie → **pułapka, zawsze**,
  niezależnie od straconego czasu — to najdroższa klasa błędów w tym stacku;
- musiałeś sięgnąć do zewnętrznej dokumentacji, żeby zrozumieć, *dlaczego*
  narzędzie zachowuje się wbrew intuicji → **pułapka**;
- dodałeś plik, skrypt albo konfig, którego brak wywróciłby projekt → **kanon** (§1);
- pomyślałeś „następnym razem zrobiłbym to inaczej", ale nie zmieniasz tego
  teraz → **otwarty wątek** (§3).

Nie dopisujesz rzeczy, które i tak wyłapie `typecheck`, `lint`, test wizualny
albo Lighthouse. Automat jest lepszym nośnikiem wiedzy niż proza — jeśli da się
napisać test zamiast wpisu, piszesz test i wspominasz o nim w polu `Wyłapuje`.

---

## 1. Kanon — co MUSI być, zanim ktokolwiek napisze pierwszy komponent

Legenda: ✅ sprawdzone w pilocie (`adstic-astro`) · 🟡 jest, ale nieprzetestowane
bojowo · ⬜ brak

### Kontrakt danych

- ✅ `packages/shared` jako **jedyne** miejsce definicji kształtu danych; schemat
  zod = źródło, model CMS = jego odwzorowanie, nigdy odwrotnie.
- ✅ Prymitywy (`Link`, `MediaImage`, `MediaVideo`, `RichText`, `Seo`) z nazwami
  pól takimi, jakie będą w CMS — inaczej etap 2 przepisuje komponenty.
- ✅ `MediaImage` z obowiązkowymi `width`/`height`. Bez nich CLS jest nie do
  uratowania później.
- ✅ Decyzja `RichText` = HTML czy AST podjęta i zapisana **przed** pierwszym
  blokiem. Zmiana w trakcie kosztuje każdy komponent tekstowy.
- ✅ Loader treści z przełącznikiem `CONTENT_SOURCE` (`fixtures` | `payload`),
  oba adaptery walidowane tym samym schematem. To jest cała istota etapowania.

### Wizualia

- ✅ Tokeny w **jednym** bloku `@theme` (Tailwind v4), nie `:root` + most.
- ✅ Aliasy nazw tam, gdzie przestrzenie Tailwinda rozjeżdżają się z konwencją
  projektu (`--text-*` vs `--font-size-*`).
- ⬜ Fonty self-hosted, subset, `size-adjust` na foncie zastępczym.
- ✅ Zakaz literałów kolor/px/cień w komponentach — egzekwowany w review.

### Treść i materiały

- ✅ `content/pages/*.json` jest **manifestem** materiałów: ścieżka + `alt` +
  wymiary. Cokolwiek ma kiedyś trafić do CMS, musi być stąd osiągalne — import
  hurtowy czyta ten plik, nie katalog.
- ✅ `_inbox/` — gitignorowana skrzynka na materiały od klienta, z README
  opisującym nazewnictwo i wymagane `alt`. Zdejmuje najczęstsze tarcie:
  „wysłałem ci pliki" bez opisu, gdzie i co.
- ✅ Rozdział: co jest **designem** (`apps/web/src/assets/`, nigdy w CMS) a co
  **treścią** (`content/media/`, docelowo upload). Robiony raz, na starcie.
- ✅ Wideo poza repo; do repo wchodzi tylko wynik `scripts/encode-video.sh`.

### Wdrożenie

- ✅ `Dockerfile` wielotargetowy: `payload-runtime` + `website-builder`.
- ✅ Migracje Payloada w repo, w tym samym commicie co zmiana schematu.
- ✅ Nginx jako jedyny publiczny serwer; CMS w sieci prywatnej.
- ✅ Osobny `docker-compose.dev.yml` z **własną nazwą projektu**.
- ✅ Polityka trailing slash ustalona raz i spójna w pięciu miejscach (patrz `P-007`).
- ✅ Sekrety przez schemat env z rozróżnieniem `client`/`server` — mechanizm,
  nie dyscyplina.

### Weryfikacja

- ✅ `pnpm verify` = typecheck + lint + build, jedna komenda.
- ✅ Budżety perf w `lighthouserc.json`, build failuje przy przekroczeniu.
- ✅ Testy wizualne Playwright, desktop + mobile — z jawnym krokiem
  `playwright install` w README (bez niego pierwszy przebieg pada na brakującej
  przeglądarce) i z portem projektowym (`P-012`).
- ✅ Każdy blok ma obok snapshotu asercję strukturalną — snapshot sam w sobie
  nie odróżnia „bez zmian" od „testuję nie tę stronę" (`P-012`).
- ✅ Test, że w wygenerowanym HTML nie ma prywatnego adresu (patrz `P-006`).
- ⬜ Test, że w kliencki bundle nie wyciekł sekret (dziś tylko konwencja).
- ⬜ Smoke test pełnego stacku w kontenerze uruchamiany jedną komendą.

---

## 2. Pułapki — błędy, które powtórzą się w następnym projekcie

Format wpisu:

```
### P-0XX — jednozdaniowa nazwa
**Objaw.**    Co widzisz. Dosłowny komunikat, jeśli jest.
**Przyczyna.** Dlaczego tak się dzieje. To jest najważniejsze pole.
**Fix.**      Co konkretnie zrobić.
**Wyłapuje.** Test / lint / nic — wtedy zostaje ten wpis.
**Do startera.** Co przenieść, żeby problem nie miał jak wystąpić.
```

---

### P-001 — pnpm w kontenerze odtwarza cały workspace przy każdym starcie
**Objaw.** `ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY`; start kontenera ~21 s
zamiast ~2 s; ruch sieciowy przy każdym `docker run`.
**Przyczyna.** Obraz zawiera celowo niepełny workspace (runtime CMS nie ma
`apps/web`). pnpm wykrywa projekty zadeklarowane w `pnpm-workspace.yaml`, których
nie widzi na dysku, i „naprawia" `node_modules` — bez TTY kończy się to abortem.
Nie wyłącza tego ani `verify-deps-before-run=false`, ani `CI=true` (oba sprawdzone).
**Fix.** W kontenerze wołasz binarki bezpośrednio: `node_modules/.bin/next start`,
`node_modules/.bin/astro build`, `node_modules/.bin/payload migrate`. Skrypty
`pnpm` zostają do pracy lokalnej, gdzie workspace jest kompletny.
**Wyłapuje.** Nic. Lokalnie niewidoczne z definicji.
**Do startera.** `Dockerfile` i entrypointy z gotowymi ścieżkami `.bin` +
komentarz „dlaczego", bo bez niego pierwszy refaktor to cofnie.

### P-002 — plik konfiguracyjny z korzenia monorepo nie trafia do obrazu
**Objaw.** Build w kontenerze przerywa się na `Tsconfig not found /app/tsconfig.base.json`.
Lokalnie build przechodzi.
**Przyczyna.** `Dockerfile` kopiuje manifesty workspace'u selektywnie, dla cache.
`tsconfig.base.json` nie jest manifestem, więc wypada — a Vite czyta tsconfig
pakietów źródłowych podczas builda.
**Fix.** Kopiować go razem z `package.json`-ami.
**Wyłapuje.** Wyłącznie build w kontenerze. Stąd reguła: **każda zmiana w
warstwie build musi być zweryfikowana `docker build`, nie `pnpm build`.**
**Do startera.** Lista plików korzenia kopiowanych do obrazu, jawna i skomentowana.

### P-003 — `--remove-orphans` kasuje lokalną bazę danych
**Objaw.** Po deployu lokalny CMS przestaje się łączyć z PostgreSQL. Kontener bazy
zniknął.
**Przyczyna.** Compose bierze nazwę projektu z nazwy katalogu. Plik `dev` i plik
produkcyjny dzielą katalog, więc dzielą nazwę projektu — a `up --remove-orphans`
z deploy scriptu traktuje kontener zdefiniowany w drugim pliku jako osierocony.
**Fix.** `name: <projekt>-dev` w `docker-compose.dev.yml`.
**Wyłapuje.** Nic. Objawia się dopiero przy pierwszym prawdziwym deployu.
**Do startera.** Jawne `name:` w **każdym** pliku compose, także produkcyjnym.

### P-004 — Next.js traceuje cały dysk
**Objaw.** Build CMS wisi > 10 min zamiast kończyć się w ~30 s.
**Przyczyna.** Bez jawnego `outputFileTracingRoot` Next wnioskuje korzeń po
lockfile'ach. Przy kilkudziesięciu projektach w jednym katalogu nadrzędnym
(typowy `~/Projekty/`) wnioskuje katalog nadrzędny i traceuje sąsiadów.
**Fix.** `outputFileTracingRoot` **i** `turbopack.root` przypięte do korzenia
repo. Muszą być identyczne.
**Wyłapuje.** Nic — build „działa", tylko trwa absurdalnie długo, co łatwo zrzucić
na wolną maszynę.
**Do startera.** Oba ustawione w `next.config.ts` od pierwszego commita.

### P-005 — samoreferencyjna zmienna CSS w Tailwind v4
**Objaw.** Token wygląda poprawnie w `:root`, ale klasa nic nie robi.
**Przyczyna.** Wzorzec `:root { --color-bg: #fff }` + `@theme inline
{ --color-bg: var(--color-bg) }` produkuje `--color-bg: var(--color-bg)` —
własność nieważną w czasie obliczania wartości. W v4 `@theme` sam emituje do
`:root` i generuje klasy; most z v3 jest nie tylko zbędny, ale szkodliwy.
**Fix.** Jeden blok `@theme`. Tokeny bez odpowiednika w przestrzeniach Tailwinda
(czasy trwania, warstwy z-index) idą do osobnego `:root` i używa się ich przez `var()`.
**Wyłapuje.** Nic — brak błędu, po prostu brak stylu.
**Do startera.** `tokens.css` z gotowym podziałem `@theme` / `:root`.

### P-006 — prywatny adres kontenera w wygenerowanym HTML
**Objaw.** Obrazy nie ładują się na produkcji; w źródle strony `http://payload:3000/...`
albo `localhost`.
**Przyczyna.** Build statyczny gada z CMS-em po sieci prywatnej i URL-e z API
przychodzą z prywatnym originem. Przeglądarka użytkownika nie ma jak ich rozwiązać.
**Fix.** Adapter CMS przepisuje URL-e na publiczny origin **zanim** dane wyjdą
z warstwy content. Reszta aplikacji nigdy nie widzi adresu prywatnego.
**Wyłapuje.** ✅ Test wizualny skanujący HTML na `payload:`, `localhost`, `:8080`.
**Do startera.** Ten test. Kosztuje pięć linii i ratuje przed klasą błędów
widoczną wyłącznie po wdrożeniu.

### P-007 — trailing slash rozjeżdża się między warstwami
**Objaw.** Przekierowanie 301 przy każdym wejściu, duplikaty w Search Console,
canonical niezgodny z rzeczywistym URL-em.
**Przyczyna.** Politykę trzeba zadeklarować w pięciu niezależnych miejscach.
Wystarczy, że jedno zostanie na domyślnej.
**Fix.** Ustalasz raz i sprawdzasz wszystkie: konfig Astro, helper ścieżek
w `shared`, canonical, sitemapa, blok `location /` w Nginx.
**Wyłapuje.** Częściowo test wizualny (nawigacja). Docelowo: ⬜ test sprawdzający
zgodność canonicala z URL-em wygenerowanego pliku.
**Do startera.** Ten test + komentarz z listą pięciu miejsc przy konfigu Astro.

### P-008 — zmiana schematu CMS bez migracji w tym samym commicie
**Objaw.** Deploy przechodzi, panel wywala się na pierwszym zapisie; rollback
kodu nie cofa stanu bazy.
**Przyczyna.** Schemat żyje w TypeScripcie, stan bazy w migracjach. Rozjazd nie
jest widoczny w developmentcie, bo lokalna baza była już „naprawiona" ręcznie.
**Fix.** Migracja w tym samym commicie. Bez wyjątków.
**Wyłapuje.** ⬜ Do zrobienia: krok CI porównujący schemat z sumą migracji.
**Do startera.** Ten krok CI — to jedyna pułapka z tej listy, która potrafi
uszkodzić dane, a nie tylko wdrożenie.

### P-009 — zmiana `imageSizes` nie dotyka istniejących plików
**Objaw.** Nowe uploady mają nowe warianty, stare nie. Front żąda wariantu,
którego nie ma → 404 na części obrazów.
**Przyczyna.** Payload generuje warianty przy uploadzie, nie przy odczycie.
Konfiguracja opisuje przyszłość, nie przeszłość.
**Fix.** Idempotentna komenda regeneracji, uruchamiana świadomie po zmianie listy.
**Wyłapuje.** Nic. Ujawnia się na najstarszych, czyli najczęściej używanych plikach.
**Do startera.** Gotowa komenda regeneracji + notatka przy `imageSizes`, że lista
jest sprzężona z `widths` na froncie.

### P-010 — sekret w bundlu klienckim
**Objaw.** Token widoczny w `view-source` po deployu.
**Przyczyna.** Import stałej „tylko do buildu" w pliku, który okazał się częścią
grafu modułu komponentu hydratowanego.
**Fix.** Schemat env z rozróżnieniem `context: 'server' | 'client'` i
`access: 'secret'` — bundler odmawia wtedy wciągnięcia zmiennej do klienta.
Mechanizm zamiast dyscypliny.
**Wyłapuje.** Częściowo bundler. ⬜ Docelowo test grepujący `dist/**/*.js`.
**Do startera.** Schemat env + ten test.

### P-011 — drugi projekt na tej samej maszynie celuje w bazę pierwszego
**Objaw.** Payload w nowym projekcie widzi tabele, których nie zakładał, albo
`docker compose -f docker-compose.dev.yml up -d` kończy się „port is already
allocated". W gorszym wariancie migracja przechodzi — na cudzej bazie.
**Przyczyna.** Scaffold przeniesiony z poprzedniego projektu niesie jego port
hosta: `5433` dla lokalnego PostgreSQL i `APP_PORT` dla routera. Kontener nazywa
się inaczej, `name:` compose'a jest inne, więc kolizja nie rzuca się w oczy —
ale `DATABASE_URL=…@127.0.0.1:5433/<nowa-nazwa>` trafia do serwera poprzedniego
projektu. Baza o takiej nazwie tam nie istnieje, więc zwykle dostaniesz błąd
połączenia; jeśli jednak nazwy się pokrywają (a pokrywają się, gdy oba projekty
biorą nazwę bazy z tego samego szablonu) — piszesz do cudzych danych.
**Fix.** Przy zakładaniu projektu ze scaffoldu zmieniasz **wszystkie** porty
hosta w jednym kroku: `APP_PORT` w `.env.example`, mapowanie portu w
`docker-compose.dev.yml`, `DATABASE_URL` w `.env.example` i w komentarzu
compose'a, oraz porty w `DEPLOYMENT.md` i `README.md`.
**Wyłapuje.** Nic. Compose nie ma pojęcia, że port należy do innego projektu.
**Do startera.** Porty jako jawna lista „do sparametryzowania" w §4 + skrypt
zakładania projektu, który je podmienia i sprawdza, czy są wolne
(`lsof -i :<port>`).

### P-012 — Playwright adoptuje serwer sąsiedniego projektu
**Objaw.** Testy wizualne przechodzą na zielono, ale snapshoty przedstawiają
**inną stronę**. Albo: `toBeVisible()` nie znajduje sekcji, która w `dist/`
bezspornie jest.
**Przyczyna.** `webServer.reuseExistingServer: true` (domyślne poza CI) sprawdza
wyłącznie, czy port odpowiada — nie sprawdza, CO odpowiada. Wystarczy dev server
innego projektu Astro na tym samym domyślnym porcie `4321`. Playwright pomija
wtedy `pnpm build && pnpm preview` i testuje cudzą aplikację. Najgorszy wariant
to pierwszy przebieg: brakujące baseline'y zostają **utworzone** z cudzej strony
i od tej chwili suite jest zielony, pilnując nie tego, co trzeba.
**Fix.** Dwa niezależne zabezpieczenia, bo każde z osobna zawodzi:
1. `reuseExistingServer: false` — zajęty port daje głośne „port is already used"
   zamiast cichej adopcji; koszt to jeden build na uruchomienie;
2. port projektowy zamiast domyślnego (`server.port` w `astro.config.mjs`,
   `preview --port`, `baseURL` i `webServer.url` w `playwright.config.ts`).
**Wyłapuje.** Nic — objaw jest odwrotnością błędu: testy stają się *zielone*.
Jedynym sygnałem jest test niesnapshotowy, który zna strukturę własnej strony
(u nas: `section:has(#hero-heading)`), więc każdy blok powinien mieć obok
snapshotu jedną asercję strukturalną.
**Do startera.** `reuseExistingServer: false` + port w jednym miejscu konfiguracji
+ reguła „każdy blok ma asercję strukturalną, nie sam snapshot".

### P-013 — `astro preview` demonizuje się i Playwright uznaje to za crash
**Objaw.** `Error: Process from config.webServer exited early.` Uruchomiony
ręcznie `pnpm preview` wypisuje „Preview server running (pid …)" i wraca do
promptu, a serwer **działa**.
**Przyczyna.** W Astro 7 `astro preview` startuje serwer jako proces w tle
i kończy proces wywołujący (`--background` jest opcją, ale tryb w tle włącza się
też bez TTY). Playwright oczekuje od `webServer.command` procesu, który żyje przez
cały przebieg, więc natychmiastowy exit 0 czyta jako awarię.
**Fix.** Wyprowadzić serwer z `webServer` do `globalSetup`/`globalTeardown`
i sterować demonem jego własnymi komendami: `astro build`, `astro preview
--port <port>`, poll na `fetch` aż odpowie, `astro preview stop` w teardownie.
Bez teardownu demon przeżywa przebieg i następny start pada na zajętym porcie.
**Wyłapuje.** Sam przebieg testów — ale **tylko** wtedy, gdy nic innego nie stoi
na porcie. Przy `reuseExistingServer: true` i sąsiedzie na tym samym porcie ten
błąd nigdy się nie ujawnia, bo `webServer` w ogóle nie jest uruchamiany (`P-012`).
Te dwie pułapki maskują się nawzajem i dlatego wyszły dopiero razem.
**Do startera.** `tests/preview.ts` z jawnym cyklem życia + `globalSetup` /
`globalTeardown` zamiast `webServer`.

Uwaga na pułapkę drugiego rzędu: pliki `globalSetup` leżące poza pakietem ESM
Playwright kompiluje do CommonJS, więc `import.meta.url` w nich **nie działa**
(`SyntaxError: Cannot use 'import.meta' outside a module`). Ścieżkę do aplikacji
bierzesz z `config.configFile`, które setup dostaje w argumencie.

### P-014 — zakodowane wideo w `.gitignore`, więc obraz dockerowy buduje hero bez tła
**Objaw.** Lokalnie hero gra. Po `docker build` i deployu tło jest czarne albo
zostaje sam poster, a w logach nginxa lecą 404 na `/video/*.mp4`.
**Przyczyna.** Scaffold ignoruje `apps/web/public/video/*` z założeniem, że media
trzyma wolumin dockerowy. Dla wideo tła to założenie jest fałszywe: to nie jest
upload z CMS-a, tylko **wejście builda statycznego**. Master leży w `_inbox/`
(też ignorowanym), więc po klonie repo nie ma czym odtworzyć wyniku
`scripts/encode-video.sh`.
**Fix.** Zakodowane pliki wchodzą do repo. Ignorujesz master, nie wynik.
**Wyłapuje.** Nic lokalnie — plik jest na dysku i dev, i preview, i `pnpm build`
działają. Widać dopiero w kontenerze albo przez `git status --ignored`.
**Do startera.** W `.gitignore` komentarz przy tej linii: „ignorujemy master,
nie wynik enkodowania", i wpis w checklistcie odbioru: `git ls-files
apps/web/public/video` musi coś zwrócić.

### P-015 — maska linii tekstu: padding + ujemny margines znika przez kolaps
**Objaw.** Nagłówek z animacją „linia wjeżdża z dołu" jest o kilkanaście pikseli
wyższy niż suma jego linii, a cały blok treści siedzi za wysoko.
**Przyczyna.** Przy `line-height: 1` descendery wychodzą poza line box, więc
`overflow: hidden` je ucina; standardowy fix to `padding-bottom: .16em` plus
`margin-bottom: -.16em`. Ujemne marginesy pierwszego i ostatniego dziecka
**kolapsują z marginesami rodzica** i uciekają na zewnątrz zamiast skasować
padding — rodzic rośnie o pełny padding, a sąsiednie maski dodatkowo kolapsują
między sobą do wartości najbardziej ujemnej.
**Fix.** `clip-path: inset(0 -0.05em -0.16em)` zamiast `overflow` + marginesów.
Ujemny inset rozszerza obszar widoczny bez dotykania layoutu.
**Wyłapuje.** Asercja na wysokość elementu (`h1` = liczba linii × line-height)
albo porównanie pozycji z Figmą — sam snapshot pokaże różnicę dopiero, gdy ktoś
ma z czym porównać.

### P-016 — `display: none` na elemencie gridu przesuwa sąsiadów o kolumnę
**Objaw.** Nagłówek `1fr auto 1fr` z logo / nawigacją / CTA: po zejściu poniżej
breakpointu, gdzie nawigacja jest chowana, CTA ląduje **na środku** zamiast po
prawej, mimo `justify-self: end`.
**Przyczyna.** `display: none` nie zostawia pustej ścieżki — element przestaje
być grid itemem, więc auto-placement wsuwa następne dziecko do kolumny 2.
`justify-self: end` działa poprawnie, tyle że w złej kolumnie.
**Fix.** Przypisać kolumny jawnie (`grid-column: 1 / 2 / 3`) wszędzie, gdzie
któryś item bywa chowany. Alternatywa (`visibility: hidden`) zostawia ścieżkę,
ale i szerokość.
**Wyłapuje.** Snapshot mobilny — o ile w ogóle istnieje dla tego breakpointu.

### P-017 — `test.use({ reducedMotion })` nie dociera do strony, a wideo psuje snapshoty
**Objaw dwuczęściowy.** (1) `toHaveScreenshot` pada z „Failed to take two
consecutive stable screenshots" na projekcie desktopowym, przy zielonym mobilnym.
(2) Po dodaniu `test.use({ reducedMotion: 'reduce' })` nic się nie zmienia.
**Przyczyna.** (1) `animations: 'disabled'` zatrzymuje animacje CSS i WAAPI, ale
**nie** odtwarzanie `<video>`; tło przesuwa się o kilka klatek między dwoma
zdjęciami i nigdy się nie ustabilizuje. (2) Przy projektach zbudowanych ze
spreadu `devices[...]` opcja `reducedMotion` z `test.use` nie trafia do kontekstu —
`window.matchMedia('(prefers-reduced-motion: reduce)').matches` zwraca `false`.
**Fix.** `await page.emulateMedia({ reducedMotion: 'reduce' })` w `beforeEach`.
Działa zawsze i jest sprawdzalne jednym `page.evaluate`. Przy okazji wyłącza
skrypt startujący wideo, więc baseline to zawsze poster.
**Wyłapuje.** Sam przebieg — ale komunikat wskazuje na „niestabilny zrzut", nie
na wideo, więc bez obejrzenia `*-diff.png` łatwo szukać nie tam.

### P-018 — Lighthouse 100 za dostępność nie mówi nic o tekście na wideo
**Objaw.** Kategoria „Accessibility" 100/100, axe czysty, a biały nagłówek na
tle wideo jest w praktyce nieczytelny — u nas 2,9:1 na ostatniej klatce
i 2,3:1 na 390 px.
**Przyczyna.** Automaty liczą kontrast z **zadeklarowanych kolorów CSS**. Pod
tekstem jest obraz, więc nie mają czego z czym porównać i audyt jest po prostu
pomijany. Gradient przyciemniający projektuje się zwykle pod jedną klatkę —
a klatka, która psuje kontrast, to zwykle nie ta, którą widać w Figmie.
**Fix.** Zmierzyć realnie: zrzut z tekstem, zrzut z ukrytym tekstem, różnica daje
maskę pikseli glifów, kontrast liczysz między **zadeklarowanym** kolorem tekstu
złożonym na tych pikselach a nimi samymi. Piksele antyaliasingu wykluczasz —
wliczone zaniżają każdy wynik o połowę i test przestaje cokolwiek znaczyć.
Sprawdzasz najjaśniejszą klatkę materiału, nie poster.
**Wyłapuje.** `tests/a11y/hero-contrast.spec.ts` — przenośny, wymaga tylko
`sharp` (i tak jest w zależnościach Astro) i selektorów bloku.
**Do startera.** Ten test jako wzorzec dla każdej sekcji z tekstem na medium.

### P-019 — `.container` koliduje z utility Tailwinda i psuje layout MIĘDZY breakpointami
**Objaw.** Layout jest idealny przy 1440 i przy 390, a między nimi kontener nagle
się zwęża, treść dostaje kilkadziesiąt pikseli marginesu znikąd i tekst wychodzi
poza swój box. Snapshoty wizualne są **zielone**.
**Przyczyna.** Tailwind v4 generuje własną utility `.container` z `--breakpoint-*`:
`@media (width>=1024px){.container{max-width:1024px}}` itd. Utilities są
w kaskadzie **po** components, więc własna klasa o tej samej nazwie przegrywa
i przy 1410 px kontener dostaje `max-width: 1024px`. Wygląda poprawnie dokładnie
tam, gdzie wartość breakpointu równa się zamierzonej szerokości — czyli przy 1440
i 390. Testy sprawdzały te dwie szerokości, bo to są szerokości z projektu.
**Fix.** Nie nazywać własnej klasy `container`. U nas `.container-page`. Nazwy
kolidujące z rdzeniem Tailwinda: `container`, `grid`, `flex`, `block`, `table`,
`ring`, `filter`, `transform`, `visible`, `transition`, `border`.
**Wyłapuje.** Nie snapshot — snapshot robi się w szerokościach z projektu, a bug
mieszka między nimi. Wyłapuje przemiatanie geometrii co 20 px z asercjami
`element.scrollWidth <= element.clientWidth` i „kontener trzyma własny wzór na
szerokość" (`tests/visual/responsive.spec.ts`). Uwaga: `overflow: clip` na sekcji
ukrywa przelew przed `document.scrollWidth`, więc asercja **musi** być na elemencie.
**Do startera.** Ten test + reguła nazewnicza: klasy layoutowe z prefiksem
projektu, nigdy gołe rzeczowniki, które Tailwind może zająć.

Pułapka drugiego rzędu przy pisaniu tego testu: `page.setViewportSize()` wraca,
zanim renderer przeliczy `vw`, a `getBoundingClientRect()` wymusza layout na
**starej** wartości. W ciasnej pętli resize'ów gutter zostaje zamrożony na tym,
co wyszło przy pierwszej szerokości, i test zgłasza nieistniejący błąd. Po każdym
resize czekasz na dwa `requestAnimationFrame`.

**Dopisane 2026-08-20, po dołożeniu `LogoWall`:** dwa `requestAnimationFrame` to
za mało. Same klatki lecą także wtedy, gdy renderer nie dostał jeszcze nowej
szerokości — pod obciążeniem (cały suite równolegle) pierwszy pomiar po resize
czytał poprzedni viewport i przemiatanie typografii raportowało „heading shrank
by 32" na pierwszym kroku, czyli H1 zmierzone przy 1440, a zaraz potem przy 360.
Osobno test przechodził, w suite padał — klasyczny fałszywy alarm, który kosztuje
pół godziny szukania błędu w CSS-ie. Kolejność jest: najpierw
`waitForFunction(() => innerWidth === target)`, potem dwie klatki.

### P-020 — animacja wstrzymana zamiast opóźnionej znika przy `prefers-reduced-motion`
**Objaw.** Sekcja poniżej folda jest pusta — nie „bez animacji", tylko całkowicie
niewidoczna — u części użytkowników i w niektórych przebiegach testów. Snapshoty
robione po przescrollowaniu są zielone.
**Przyczyna.** Reveal na scrollu robi się najtaniej przez `animation-play-state:
paused` na grupie i zdjęcie pauzy, gdy IntersectionObserver ją zauważy: przy
`animation-fill-mode: both` wstrzymana animacja renderuje swoją pierwszą klatkę,
czyli `opacity: 0`. To jest zaleta — dopóki ktoś nie zderzy tego z globalnym
blokiem `prefers-reduced-motion`, który wygasza ruch przez skrócenie czasu
(`animation-duration: 0.01ms`). Skrócony czas nic nie daje animacji, która stoi:
wstrzymana animacja nie posuwa się o żaden milimetr, więc element zostaje na
`opacity: 0` na zawsze. Ta sama pułapka dotyczy karty w tle — obserwator bywa
dławiony i callback nie przychodzi.
**Fix.** W bloku `prefers-reduced-motion` obok skrócenia czasów **musi** stać
`animation-play-state: running !important`. Drugi warunek: bramka pauzy musi być
gatowana klasą `.js` (ustawianą inline w `<head>`), bo bez skryptu nikt pauzy nie
zdejmie i strona jest pusta dla czytnika, który JS-a nie wykonał.
**Wyłapuje.** Test asercji na `getComputedStyle(el).opacity === '1'` **bez**
scrollowania (`tests/visual/logo-wall.spec.ts`, „ends up visible even if the
observer never fires") plus snapshot robiony pod `reducedMotion: 'reduce'` — ten
drugi łapie regresję w linii `running`.
**Do startera.** Mechanizm „in view" z `global.css` razem z obiema asercjami.
Zawsze kompletem: sam mechanizm bez tych dwóch testów jest bombą z opóźnionym
zapłonem.

### P-021 — plik dodany przy działającym `pnpm dev` nie istnieje dla `import.meta.glob`
**Objaw.** `Missing image file "content/media/logos/nextera-energy.png". The fixture
points at a file that is not in content/media/.` — a plik **jest** w katalogu,
`pnpm build` przechodzi, `pnpm test:visual` jest zielony. Tylko dev server się
wywraca.
**Przyczyna.** Warstwa treści i warstwa mediów stoją na `import.meta.glob(...,
{ eager: true })`. Glob jest rozwijany, gdy moduł wchodzi do grafu — czyli raz,
przy starcie serwera. Nowy plik nie unieważnia tego modułu, bo w niczyim
`importerze` go nie ma; HMR nie ma czego przeładować. Astro 7 dokłada swoje:
`astro dev` demonizuje się, więc kolejne `pnpm dev` melduje „already running"
i **nie** startuje nic nowego — można trzy razy „zrestartować" serwer i trzy razy
trafić w ten sam stary proces.
**Prawdziwa przyczyna — i ona się usuwa.** Vite **umie** unieważnić eager glob,
gdy pasujący plik się pojawi albo zniknie. Robi to jednak tylko dla plików, które
obserwuje, a `content/` leży **poza rootem** (`apps/web`) — chokidar nigdy nie
dostawał stamtąd zdarzeń. To nie jest ograniczenie globa, tylko nieobserwowany
katalog.
**Fix (trwały).** Wtyczka `stora:watch-content-sources` w `astro.config.mjs`:
`server.watcher.add(<repo>/content)` plus unieważnienie na `add`/`unlink` modułów,
które cokolwiek z `content/` importują. Właścicieli globów nie wypisuje z nazwy,
więc kolejny glob nad tym katalogiem działa bez dotykania konfiguracji. Do tego
`vite.server.fs.allow` na root repo, bo inaczej Vite odmówi serwowania spoza roota.
**Fix (doraźny, gdy trafisz na starą konfigurację).** `astro dev stop`, potem
`astro dev`. Nie `pnpm dev` na innym porcie — demon zignoruje port i odeśle stary.
Sprawdzenie, że to naprawdę restart: `astro dev status` musi pokazać **inny** pid.
**Uwaga przy diagnozie.** Ten błąd leci **w trakcie streamowania odpowiedzi**,
więc status to `200`, a w treści nie ma komunikatu — jest tylko ucięty HTML
(`<main>` otwarty i niezamknięty). `curl -w '%{http_code}'` powie, że jest dobrze.
Sprawdza się domknięcie `</main>` albo `astro dev logs`.
**Wyłapuje.** Sama wtyczka. Zweryfikowane doświadczeniem z kontrolą: bez niej plik
dodany przy żywym dev serverze daje `Missing image file` i ucięty render, z nią
dodanie **i** usunięcie pliku przechodzi bez restartu.
**Do startera.** Wtyczka watchera — zawsze, gdy katalog treści leży poza rootem
buildera. Plus komunikat błędu z obiema przyczynami w `media.ts` i wszędzie, gdzie
eager glob rzuca na brak wpisu; komunikat zostaje jako siatka bezpieczeństwa na
wypadek konfiguracji bez wtyczki.

### P-022 — `minmax(0, X)` plus nierozrywalny łańcuch znaków = ciche nachodzenie kolumn
**Objaw.** Dwukolumnowa siatka danych kontaktowych na wąskim ekranie: adresy e-mail
z lewej kolumny wchodzą pod tekst prawej. Nic się nie „psuje" — pudełka mają
poprawne rozmiary, `scrollWidth === clientWidth`, snapshot pełnej strony przechodzi,
bo różnica mieści się w progu. Widać to dopiero okiem, na zrzucie.
**Przyczyna.** Tor `minmax(0, 208px)` nie ma dolnej granicy, więc przy zwężaniu
schodzi poniżej najdłuższego słowa w środku. Adres e-mail to jedno słowo bez miejsca
na złamanie: `contact@storaenergy.pl` składa się na 200 px i albo dostanie 200 px,
albo wyleje się poza swój tor. Zwykły tekst w tej sytuacji się zawija i problem sam
znika — dlatego łapie się to tylko tam, gdzie treścią są maile, URL-e albo numery.
**Fix.** Punkt złamania siatki liczony z najdłuższego nierozrywalnego łańcucha,
nie z „mniej więcej połowy ekranu". Tutaj: 480, bo przy nim tory mają 212 px przy
wymaganych 200. Nie `overflow-wrap: anywhere` — łamie adres w losowym miejscu.
**Wyłapuje.** `tests/visual/footer.spec.ts`, „never lets a contact line run into the
column beside it": przemiatanie szerokości z porównaniem prawej krawędzi każdej
linii z krawędzią jej grupy. Zweryfikowane kontrolą — przesunięcie punktu złamania
na 360 wywraca test na 360 px. Snapshot tego nie łapie i nie ma jak: ta różnica
schodzi poniżej `maxDiffPixelRatio`.
**Do startera.** Sam test przemiatający, dla każdej siatki o stałej mierze, w której
treścią bywają maile, URL-e albo numery.

---

## 3. Otwarte wątki — do rozstrzygnięcia zanim powstanie starter

Rzeczy, o których wiemy, że wrócą, ale nie zmieniamy ich teraz.

- **SVG w kolekcji `Media`.** `formatOptions: webp` zrasteryzuje wektor. Do
  wyboru: przepuszczenie SVG bez konwersji, albo reguła „loga są designem, z CMS
  idzie tylko wybór, które pokazać". Decyzja wpływa na to, co redaktor może zmienić
  bez developera — czyli na obietnicę składaną klientowi.
- **Konwersja rich textu.** Adapter Lexical → HTML przy buildzie działa, ale nie
  był jeszcze użyty na prawdziwej treści z zagnieżdżeniami, linkami i mediami
  inline. To najbardziej prawdopodobne źródło niespodzianki w etapie 2.
- **Podgląd wersji roboczych.** Statyczny front nie ma jak pokazać drafta.
  Redaktorzy o to zapytają w każdym projekcie. Rozwiązanie musi być w starterze,
  bo doklejane później wymaga zmiany modelu deploymentu.
- **Czas builda vs liczba stron.** Statyczny build rośnie liniowo. Nie wiemy,
  gdzie jest próg bólu ani czy potrzebny jest build inkrementalny.
- **Wielojęzyczność.** Nie ma jej ani w pilocie, ani tutaj. Dołożona po fakcie dotyka schematów,
  routingu, sitemapy i modelu CMS naraz — czyli wszystkiego.
- **Kto trzyma tokeny.** Dziś Figma → `tokens.css` ręcznie. Do rozważenia
  automat, ale dopiero gdy zobaczymy, jak często tokeny realnie się zmieniają.

---

## 4. Lista wywozowa — co konkretnie idzie do startera

### Kopiowalne prawie bez zmian

`Dockerfile` · `docker/` (nginx, entrypointy, skrypt builda) · `docker-compose*.yml` ·
`lighthouserc.json` · `turbo.json` · `tsconfig.base.json` · `scripts/encode-video.sh` ·
`packages/shared/src/primitives.ts` · warstwa `lib/content/` z przełącznikiem źródła ·
`lib/media.ts` · `lib/preload.ts` · kolekcje `Users` i `Media` · testy z §2 ·
`tests/preview.ts` z cyklem życia serwera podglądu (`P-012`, `P-013`) ·
`_inbox/README.md` · `AGENTS.md` · `_TEMPLATE.spec.md` · ten plik, wyczyszczony
z sekcji 3.

### Wymaga parametryzacji przy zakładaniu projektu

Nazwa projektu (compose, obrazy, wolumeny) · **porty hosta** (`APP_PORT`,
lokalny PostgreSQL — patrz `P-011`) · domena i `PUBLIC_SITE_URL` ·
polityka trailing slash · wartości w `tokens.css` · rodziny fontów ·
lista stron · budżety perf, jeśli projekt ma inny charakter niż landing.

### Powstaje od zera w każdym projekcie

Bloki i ich schematy · `content/pages/*.json` · `DECISIONS.md` · `BLOCKS.md`.

### Cel — jak mierzymy, że starter działa

Od `git init` do zdeployowanego szkieletu z jednym blokiem, przechodzącym
`verify` + Lighthouse w kontenerze: **jedna sesja**. Dziś, licząc od zera, jest
to kilka dni — i to jest liczba, którą starter ma zbić.

### Pomiar 1 — Stora, 2026-08-20

Pierwsze realne przeniesienie scaffoldu (kopia z pilota + parametryzacja).
Wynik lokalnie, bez kontenera i bez deployu:

| Etap | Czas / wynik |
|---|---|
| kopia + parametryzacja nazw i portów | ~20 min |
| `pnpm install --frozen-lockfile` | 9,3 s |
| `pnpm verify` (typecheck + lint + build) | 21,9 s, 0 błędów / 0 warningów |
| `pnpm lighthouse` | perf 100 · a11y 100 · BP 96 · SEO 100; LCP 0,9 s, TBT 0 ms, CLS 0 |
| `pnpm test:visual` | 10/10, po naprawie `P-012` i `P-013` |

Koszt ukryty: trzy nowe pułapki (`P-011`…`P-013`), wszystkie z jednej rodziny —
**scaffold niesie stan maszyny poprzedniego projektu** (porty, uruchomione
serwery, zainstalowane przeglądarki). Żadnej nie wyłapał typecheck, lint ani
build; dwie z nich dawały wynik *zielony*, nie czerwony. To jest kierunek,
w którym starter musi być twardszy niż kopia katalogu.

---

### P-023 — Zdjęcie zmieniające rozmiar: `width`/`height` to ślepa uliczka, a `scale()` w górę rozmywa

**Objaw.** Kafel ma pokazać zdjęcie w dwóch rozmiarach — małe w spoczynku, na całe
tło po najechaniu. Odruchowe rozwiązania: animować `width`/`height`, `inset` albo
`clip-path`. Pierwsze dwa to layout na każdej klatce, trzecie nie jest na szybkiej
ścieżce kompozytora. Zostaje `transform: scale()` — ale jednolita skala trafia
w oba wymiary tylko wtedy, gdy oba pudełka mają **tę samą proporcję**. Jeśli nie
mają, skala niejednolita spłaszcza zdjęcie, a ratowanie tego drugim elementem
skalowanym odwrotnie to dwa elementy i mnożenie ułamków.

**Rozwiązanie.** Nadaj **kontenerowi proporcję zdjęcia**. Wtedy pudełko małe
i pudełko duże różnią się jedną liczbą, ta liczba jest stała przy każdej
szerokości okna (bo obie skalują się z tą samą siatką), a stan to jedno
`scale: <n>` → `scale: 1`. Rozmiar w px podany przez projekt zamienia się na
`scale = mały / duży` policzone przy szerokości projektowej.

**Druga połowa, którą łatwo przegapić.** Skala musi biec **w dół**. Jeśli
elementem bazowym jest mały portret i powiększasz go do 1,85×, przeglądarka
rasteryzuje przy małym rozmiarze i skaluje bitmapę — obraz jest miękki w trakcie
animacji, a w części przypadków zostaje miękki po niej. Element bazowy ma być
duży, a stan spoczynku to `scale` mniejsze od 1. Ta sama animacja, odwrotny znak,
inna ostrość.

**Cena.** Kontener przejmuje proporcję zdjęcia, więc jeśli projekt podaje osobno
wysokość kontenera i proporcję zdjęcia, a siatka nie zgadza się z ramką co do
piksela — jedna z tych liczb musi ustąpić. To jest decyzja projektowa i idzie do
`DECISIONS.md` z arytmetyką, a nie do komponentu jako magiczna liczba.

**Co ją wyłapuje.** Nic automatycznego. Pomiar `getBoundingClientRect()` na
`<img>` w obu stanach, na kilku szerokościach — jeśli proporcja portretu
wędruje między breakpointami, kontener ma złą proporcję i zdjęcie jest kadrowane
coraz węziej, im węższy rząd.

### P-024 — Kurtyna, która nic nie zasłania: `overflow` na złym elemencie

**Objaw.** Animacja wejścia „odsłaniania" wygląda, jakby jej nie było. Zdjęcie
jest widoczne od pierwszej klatki; rusza się tylko gradient nad nim. Kod wygląda
poprawnie, `getAnimations()` potwierdza, że animacja leci.

**Przyczyna.** Kurtyna to dwa elementy: przesłona jedzie o 100%, a dziecko wraca
o −100%, dzięki czemu obraz stoi w miejscu, a rusza się tylko otwór. To działa
**tylko wtedy, gdy przycina sama przesłona**. Jeżeli `overflow: clip` siedzi
poziom wyżej (na karcie), to dziecko po skontrowaniu ląduje dokładnie w obrysie
karty — czyli w obszarze widocznym — i widać je cały czas. Przycina się coś, co
i tak nigdy nie wychodzi poza kadr.

**Co ją wyłapuje.** Nic automatycznego. Zrzut w połowie animacji — ale **nie**
przez `page.locator(...).screenshot()` z zapauzowanym timeline'em, bo przy
zatrzymanym kompozytorze niedomalowane obszary wychodzą białe i myli to jeszcze
bardziej. Wiarygodna kolejność jest taka:

1. `getAnimations({subtree:true})` → czy animacja w ogóle istnieje i jakie ma
   `delay`/`duration`. Brak wpisu = keyframes nie istnieją (patrz niżej).
2. `a.pause(); a.currentTime = t` na wszystkich naraz → zrzut całej strony.

**Drugi wariant tej samej pułapki.** `animation-name` wskazujący na `@keyframes`,
którego nie ma, **nie jest błędem** — przeglądarka po cichu nic nie animuje,
a element zostaje w stanie docelowym. Wygląda to identycznie jak „animacja jest,
tylko za szybka". Dlatego krok 1 wyżej jest pierwszy: element bez wpisu w
`getAnimations()` to brakujące keyframes, nie zła krzywa.

**Skąd się wzięło.** Skryptowa podmiana w CSS (`str.replace` bez asercji) nie
trafiła w kotwicę i cicho nic nie zrobiła. Klasa i lista pauzowania się
zaktualizowały, keyframes nie. **Każda podmiana w pliku robiona skryptem musi
mieć `assert anchor in source`** — inaczej połowa zmiany wchodzi, a połowa nie,
i szuka się potem błędu w logice.

### P-025 — Sekcja przypięta na scroll bez ani jednej linii JS

**Objaw (którego nie ma).** „Zpinowana" sekcja — kafel stoi, a scroll przewija
przez niego cztery slajdy — odruchowo woła o bibliotekę: ScrollTrigger, Lenis,
własny `IntersectionObserver` z ręcznym mapowaniem `scrollY` na postęp. Każde
z tych rozwiązań to kilkadziesiąt KB JS, listener na `scroll` i praca na wątku
głównym przy każdej klatce — czyli TBT i budżet JS z `AGENT-RULES §5`.

**Rozwiązanie.** Sekcja wyższa od okna + `position: sticky` na scenie + **jedna**
`view-timeline` na sekcji, czytana w zakresie `contain`. Dla elementu wyższego
niż okno zakres `contain` to **dokładnie** okno, w którym scena jest przypięta —
nie trzeba niczego mierzyć, bo „jak daleko jesteśmy w przypięciu" to po prostu
postęp tej osi czasu. Każdy ruch to potem `animation-range: contain X% contain Y%`
na tej samej osi: kolejność slajdów da się przeczytać z trzech liczb, nic nie
trzeba synchronizować, koszt to 0 B JavaScriptu i animacje na kompozytorze.

Nazwana oś czasu (`view-timeline-name: --foo`) jest widoczna dla **potomków**
elementu, który ją definiuje — `timeline-scope` jest potrzebny dopiero, gdy
animowany element nie jest potomkiem. Zakres per element wygodnie podać przez
dziedziczone custom property (`--step-from`/`--step-to` w markupie), bo
`animation-range` samo się nie dziedziczy.

**Pułapka w środku.** Jeśli sekcja musi przycinać w poziomie (tekst wychodzący
poza kadr), to **`overflow-x: clip`, nigdy `hidden`**. `hidden` robi z elementu
kontener przewijania, a kontener przewijania między `sticky` a oknem to scena,
która nigdy się nie przypina. `clip` nie tworzy kontenera przewijania i sticky
działa dalej. To ta sama rodzina co `P-024`: `overflow` na złym elemencie albo
o złej wartości i mechanizm cicho przestaje istnieć.

**Zapasowy układ za darmo.** `@supports (animation-timeline: view())` i
`@media (prefers-reduced-motion: no-preference)` opakowane razem dają **jeden**
układ zapasowy zamiast dwóch: przeglądarka bez scroll-driven animations i osoba,
która wyłączyła ruch, dostają ten sam statyczny stos slajdów. Jeden układ do
zbudowania i jeden do obejrzenia. Warunek: stan bazowy (poza `@supports`) musi
być tym statycznym stosem, a przypięcie ma być tym, co się *dokłada* — odwrotnie
się nie da, bo `@supports not (...)` nie cofnie już nadanej wysokości 500vh.

**Uwaga na `prefers-reduced-motion` z globalnego killa ruchu.** Reguła z
`global.css` (`animation-duration: 0.01ms !important`) jest napisana pod animacje
czasowe. Przy animacji sterowanej scrollem `duration` znaczy „ile osi czasu
zajmuje" i skrócenie go daje przeskok, nie wyłączenie — dlatego ta sekcja
wyłącza się z ruchu **układem**, nie długością trwania.

**Co ją wyłapuje.** Skrypt Playwrighta, który przewija na kilka ułamków zakresu
przypięcia (`top + (height - innerHeight) * f`) i robi zrzut. Statyczny zrzut
sekcji nie pokaże nic — cała sekwencja jest funkcją pozycji scrolla.

### P-026 — Przycinacz, który sam się rusza; i podróż, która nie wychodzi z apertury

**Objaw.** Sekcja z aperturą (kadr, przez który przewijają się zdjęcia, cyfry,
linie tekstu) wygląda „krzywo" na kilka niepowiązanych z pozoru sposobów naraz:
coś nachodzi na sąsiedni element, granica koloru nie trafia w krawędź zdjęcia,
w okienku widać dwie treści jednocześnie, opis nie trzyma lewej krawędzi kadru.
Każdy z tych objawów wygląda na osobną literówkę w CSS. To są trzy przyczyny, nie
dziesięć.

**Przyczyna 1 — przycinacz z transformacją.** `overflow: clip` i `transform` na
**tym samym** elemencie to skalowanie apertury razem z treścią. Zdjęcie
powiększone o 8% wychodzi wtedy poza kadr, do którego rzekomo jest przycięte.
Zmierzone: 18 px wycieku na każdą stronę przy kadrze 460 × 540. Wszystko, co było
ustawione **względem kadru** — sąsiedni znacznik, podpis pod spodem, druga
warstwa tekstu przycięta do tej samej krawędzi — nagle przestaje się zgadzać ze
zdjęciem, choć samo w sobie stoi idealnie.

**Zasada:** pudełko, które przycina, nigdy się nie rusza. Rusza się wyłącznie
treść w środku. Jeśli treść ma się skalować, dostaje własny element wewnątrz.

**Przyczyna 2 — treść wyższa od panelu, która wystaje górą.** Zdjęcie
o wysokości 140% panelu, zaczepione ponad jego górną krawędzią (parallaks), sięga
189 px nad panel. Panel odjechany **pod** aperturę wciąż pokazuje w niej czubek
swojego zdjęcia. Przycina dziadek, nie ojciec — a przycinać musi ojciec.

**Zasada:** każdy poziom, który niesie treść większą od siebie, przycina sam.

**Przyczyna 3 — podróż liczona od złej wysokości.** Element wyjeżdża z apertury
przez `translateY(105%)`, ale procent liczy się od **jego własnej** wysokości.
16-pikselowa cyfra wyśrodkowana w płytce 36 px przesuwa się o 17 px i zostaje
w kadrze — w okienku widać `01` nad `02`. To samo dotyczy jednolinijkowego opisu
w dwulinijkowym oknie.

**Zasada:** element, który podróżuje, ma być tak wysoki jak apertura, przez którą
podróżuje. Wtedy 105% to 105% właściwej liczby i nie trzeba tego pamiętać przy
każdym nowym elemencie.

**I sprawdź, czy naprawdę jest.** `block-size: 100%` na elemencie gridu rozwiązuje
się względem **jego ścieżki**, a `align-content: start` wymiaruje ścieżkę treścią,
nie kontenerem. Element z `block-size: 100%` w takim gridzie ma więc wysokość
tekstu, nie okna — u nas 40 px zamiast 60 — i 105% z tego zostawia 18 px treści
widocznej w aperturze **od pierwszej klatki strony**. Zwykły blok w pudełku
o definitywnej wysokości nie ma tego problemu; grid ma go po cichu.

**Trzecia, drobna.** Element zaparkowany dokładnie na `translateY(100%)` ma górną
krawędź **na** granicy przycięcia. Przy pudełku o ułamkowej wysokości granica
wypada w połowie piksela i rasteryzator maluje włos treści. Panel wyższy od
apertury o 2 px kasuje to i nic nie psuje, o ile **wszystkie** panele mają ten sam
nadmiar — wtedy stopa jednego nadal jest głową drugiego.

**Czwarta, pokrewna.** Apertura współdzielona przez kilka nałożonych na siebie
stanów musi mieć **stałą** wysokość, nie wysokość treści — inaczej stan z dłuższym
tekstem przesuwa całą kartę pod spodem. A skoro stała, to jej wartość jest
**zmierzoną** najdłuższą treścią przy tej szerokości, nie liczbą z projektu wziętą
na wiarę. U nas ten sam tekst składa się na dwie linie przy 1440 i na trzy przy
768 — i najgorszym przypadkiem nie jest najwęższy ekran, tylko 768, bo poniżej
kadr przełącza się na inną jednostkę i robi się szerszy.

**Co je wyłapuje.** Nic z typecheck / lint / build i **żaden statyczny zrzut** —
cała sekwencja jest funkcją pozycji scrolla, więc zrzut pokazuje jedną dowolną
klatkę. Wyłapuje je przemiatanie: skrypt Playwrighta przewija po ~1% zakresu
przypięcia i na każdej pozycji sprawdza niezmienniki w `getBoundingClientRect()`:

1. w każdej aperturze widać **co najwyżej jedną** treść (przecięcie prostokąta
   treści z prostokątem apertury > 1,5 px liczone dla wszystkich stanów),
2. apertura zdjęcia jest **w pełni** pokryta (suma pokrycia paneli = wysokość
   kadru) od momentu, w którym karta jest na scenie,
3. element dekoracyjny nie jest na scenie, zanim wejdzie karta.

Sto jeden pozycji, pięć niezmienników, kilkanaście sekund. Uwaga na metrykę,
która nic nie mierzy: porównywanie prostokąta treści z prostokątem panelu **nie
wykrywa** przycięcia, bo `getBoundingClientRect()` zwraca pudełko układu, nie to,
co widać. Wykrywa je dopiero pytanie „czy ten punkt jest zajęty przez ten
element" (`elementsFromPoint`) albo pokrycie liczone na prostokątach paneli, a nie
zdjęć.

### P-027 — Wyśrodkowane w ścieżce gridu, nie na ekranie

**Objaw.** Sekcja z `display: grid; place-items: center` jest przesunięta w prawo.
Nie o losową wartość — o **dokładnie połowę nadmiaru** najszerszego elementu.
Wygląda jak błąd marginesu albo scrollbara i sprawdza się w pierwszej kolejności
jedno i drugie, bez skutku.

**Przyczyna.** Ścieżka `auto` w gridzie jest wymiarowana do `max-content`
najszerszego elementu. Jeśli któryś element jest szerszy od kontenera — u nas
`white-space: nowrap` w rozmiarze 300 px, czyli 1611 px linii w 1440-pikselowej
scenie — ścieżka rozdyma się do 1611 px, a `place-items: center` **uczciwie**
centruje wszystko w ścieżce. Środek treści ląduje na 805 px zamiast na 720.
Sprawdzian jest natychmiastowy: jeżeli środek treści równa się połowie szerokości
tego jednego szerokiego elementu, to jest ta pułapka.

**Rozwiązanie.** `grid-template-columns: minmax(0, 1fr)`. Ścieżka przykleja się do
kontenera, element szerszy od niej wychodzi **symetrycznie** poza obie krawędzie —
czyli dokładnie to, co w projekcie znaczy „napis przycięty z lewej i prawej" — a
reszta jest wyśrodkowana na ekranie. To ta sama rodzina co `minmax(0, 1fr)` przy
elementach gridu, które nie chcą się kurczyć; różnica jest taka, że tam objawem
jest rozjechany layout, a tutaj layout wygląda poprawnie, tylko stoi w złym
miejscu.

**Co ją wyłapuje.** Jedna asercja w przemiataniu: `|środek elementu − szerokość
okna / 2| ≤ 1 px`, sprawdzana na kilku szerokościach. Ta sekcja przez trzy iteracje
wyglądała dobrze na zrzutach i przez cały ten czas była przesunięta o 85 px, bo
zrzut z wyciętym marginesem nie pokazuje, gdzie jest środek ekranu.

### P-028 — `getBoundingClientRect()` nie wie nic o tym, co widać

**Objaw.** Metryka w teście wizualnym daje pewną, powtarzalną, **błędną** liczbę.
Nie rzuca błędem, nie jest zerem — jest po prostu nieprawdziwa, więc wnioski
z niej są odwrotne do rzeczywistości.

**Przyczyna.** `getBoundingClientRect()` zwraca pudełko układu. Nie wie
o `clip-path`, nie wie o `overflow` przodka, nie wie o `opacity: 0`. Dwa realne
przypadki z jednej sekcji:

1. „Czy zdjęcie wycieka poza panel" liczone jako porównanie prostokątów —
   **nigdy** nie wykryje przycięcia, bo prostokąt zdjęcia zawsze jest większy.
   Wyciek trzeba mierzyć pokryciem prostokątami **paneli**, albo pytaniem
   `elementsFromPoint`, które respektuje przycinanie.
2. „Czy ten wyraz jest widoczny" liczone względem pudełka linii — przy aperturze
   `clip-path` rozszerzonej o 0,75em zaniża widoczność tak bardzo, że wyszło 41%
   martwego czasu tam, gdzie realnie było kilkanaście. Aperturę trzeba odtworzyć
   w mierze: pudełko linii **powiększone o bleed**.

**Druga połowa.** Podmiana keyframe'ów wstrzyknięta do strony w trakcie testu
(`document.head.appendChild(style)`) nie musi nadpisać reguły ze scoped CSS.
Cztery różne warianty czasowe dały **bajt w bajt identyczne** liczby — a to nie
jest sygnatura czterech wariantów, które działają tak samo, tylko nadpisania,
które nigdy nie weszło. Wynik identyczny co do miejsca po przecinku dla różnych
wejść jest podejrzany zawsze, nie tylko tutaj.

**Co je wyłapuje.** Kontrola zdrowia metryki, zanim się jej zaufa: zmień jedną
rzecz, o której **wiesz**, że musi ruszyć liczbę, i sprawdź, czy ruszyła. Jeśli
nie — mierzysz co innego, niż myślisz.


### P-029 — Animacja z `fill-mode: both` zjada stan, którym steruje CSS

**Objaw.** Element ma zadeklarowany stan spoczynku (`opacity: .2` na nieaktywnej
zakładce, wyszarzenie, wyciszenie) i **po wejściu sekcji w kadr stan znika**.
Nie miga, nie wraca — po prostu przestaje istnieć. Statyczny zrzut zrobiony
wcześniej pokazuje poprawny stan, więc łatwo uznać sprawę za zamkniętą.

**Przyczyna.** Klatka końcowa animacji z `animation-fill-mode: both` bije
deklarację na tej samej właściwości i robi to **na stałe** — to nie jest kwestia
specyficzności selektora, tylko kaskady: wypełniona animacja leży w warstwie nad
regułami autora. Wspólna klasa wejścia (`.reveal`) animuje `opacity` od 0 do 1,
więc każdy element, którego **stan** też jest `opacity`, kończy wejście na 1
i traci swój stan bezpowrotnie. To samo dotyczy `transform` — element sterowany
`translate`/`scale` pod `.reveal` skończy na wartości z keyframe'u.

**Naprawa.** Rozdzielić właściwości: element niosący stan dostaje wejście, które
rusza **inną** właściwość niż stan. W praktyce `.reveal-mask` (sam `transform` na
dziecku) zamiast `.reveal`, albo opakowanie: wrapper animowany, dziecko ze stanem.

**Jak to złapać.** Nie zrzutem — zrzut końcowy pokazuje dokładnie ten zły stan,
a zrzut pośredni pokazuje animację, która wygląda dobrze. Trzeba **odczytać
`getComputedStyle` po zakończeniu wejścia** i porównać z wartością zadeklarowaną.
Sygnatura jest charakterystyczna: wartość wisi tuż pod 1 i wciąż rośnie (0,94),
zamiast stać na swoim 0,2.

**Wyłapuje.** Dziś nic automatycznego — sekcja `AudienceTabs` ma testy odłożone na
prośbę klienta. Test, który to zamyka, jest jednozdaniowy i wart napisania przy
pierwszym podejściu do snapshotów: po `waitForTimeout` dłuższym niż wejście
odczytać `opacity` każdej etykiety i sprawdzić, że dokładnie jedna ma 1.

### P-030 — `fullPage: true` gubi warstwy kompozytora; „linia się nie renderuje", a renderuje

**Objaw.** Element jest w DOM-ie, `getComputedStyle` mówi 1 × 584 px, tło z alfą
0,14, `transform` tożsamościowy, `animation-play-state: running`, animacja
`finished` — a na zrzucie go nie ma. Piksel odczytany z pliku PNG jest czysto
biały. Wygląda to jak błąd w CSS-ie i idzie się szukać go tam, gdzie go nie ma.

**Przyczyna.** Zrzut `page.screenshot({ fullPage: true })` na długiej stronie
(u nas 10 892 px) składany jest inaczej niż zrzut kadru i **potrafi pominąć
warstwy, które trafiły na kompozytor** — czyli dokładnie te elementy, które mają
animowany `transform`. Cienka kreska 1 px na własnej warstwie znika w całości;
tekst, którego animacja skończyła się na tyle wcześnie, że warstwa została
zwinięta, jest widoczny. Efekt jest więc **wybiórczy**, co utwierdza w tym, że
problem leży w tym jednym elemencie.

**Naprawa.** Weryfikacja wizualna cienkich elementów idzie zrzutem **kadru**
(`screenshot()` bez `fullPage`), po `scrollIntoView`, przy oknie na tyle wysokim,
żeby sekcja się zmieściła. Kontrolą, która rozstrzyga w 30 sekund, jest
`addStyleTag` z `animation: none !important; background: red !important` na
podejrzanym selektorze: jeśli czerwień jest, CSS jest dobry, a kłamie zrzut.

**Wyłapuje.** Dziś nic — snapshoty tej sekcji są odłożone. Gdy powstaną, mają
robić zrzuty kadru, nie `fullPage`; inaczej złapią różnicę tam, gdzie jej nie ma,
albo przepuszczą ją tam, gdzie jest.

---

### P-031 — ujemny `z-index` wewnątrz ujemnego `z-index`: zdjęcie znika, a DOM twierdzi, że jest

**Objaw.** Sekcja z fotografią w tle renderuje samo tło koloru i tekst. `<img>`
jest w DOM-ie, `naturalWidth` = 1440, `getBoundingClientRect()` daje 1440 × 900
w punkcie (0, 0), `currentSrc` wskazuje istniejący plik, `opacity` = 1. Każda
asercja o DOM-ie przechodzi. Na zrzucie ekranu zdjęcia nie ma.

**Przyczyna.** Sekcja miała `position: sticky` + `z-index: -1` (efekt „następna
sekcja najeżdża na hero"), a jej warstwa tła — `z-index: -1` jeszcze raz.
Zewnętrzny ujemny indeks czyni z sekcji kontekst stackingu; zagnieżdżona w nim
druga warstwa ujemna nie jest w Chromium malowana. Zmierzone na macierzy czterech
kombinacji: `sekcja -1 / tło -1` → 48 kB zrzutu (płaski kolor), `sekcja -1 / tło
auto` → 1,6 MB (zdjęcie). Sam `z-index` na wewnętrznej warstwie nie był do niczego
potrzebny — scrimy (1) i treść (2) i tak są nad elementem gridu bez indeksu.

**Fix.** Ujemny indeks trzymać w jednym miejscu — na elemencie, który ma zejść
pod resztę strony. Wszystko w środku układać dodatnimi indeksami względem niego.

**Wyłapuje.** `tests/visual/page-hero.spec.ts` — snapshot bloku (to jedyne, co
widzi różnicę) plus asercja wprost, że sekcja ma `-1`, a jej tło `auto`, żeby
awaria nazywała swoją przyczynę zamiast pokazywać czarny prostokąt.

**Do startera.** Nic do skopiowania — to wpis do przeczytania, zanim ktoś napisze
drugi taki efekt. Ale zasada „snapshot bloku, nie tylko pomiar DOM-u" jest
dokładnie tym, co ten przypadek uzasadnia.

---

### P-032 — `quality` w jednym miejscu, a nie w drugim: preload ładuje drugi komplet plików

**Objaw.** LCP rośnie z 1,95 s do 2,55 s po zmianie, która miała je zmniejszyć —
obniżeniu jakości enkodera dla zdjęcia hero. W `dist/_astro/` leży **osiem**
plików AVIF zamiast czterech, a w HTML-u są dwa różne `srcset`-y na to samo
zdjęcie.

**Przyczyna.** `quality` wchodzi do klucza, z którego Astro liczy nazwę pliku.
Komponent dostał `quality={45}`, a `getLcpPreload()` — nie, więc `getImage()`
wygenerował własny, pełnowymiarowy komplet. Przeglądarka pobiera oba: preload
z jednego kompletu i `<source>` z drugiego. To ta sama klasa błędu, przed którą
ostrzega komentarz w `apps/web/src/lib/images.ts` („preload i render muszą się
zgadzać co do kandydata"), tylko przez parametr, którego wtedy nie było.

**Fix.** Każdy parametr wpływający na nazwę pliku — `widths`, `sizes`, `format`,
`quality` — trzyma się w jednym obiekcie obok siebie i jest przekazywany do obu
stron. W `preload.ts` jest to jeden literał na blok.

**Wyłapuje.** `tests/visual/page-hero.spec.ts` → „preloads exactly the AVIF
candidates the picture renders": porównuje `imagesrcset` preloadu ze `srcset`
renderowanego `<source>`. Test dla hero istniał wcześniej — brakowało go dla
drugiego bloku, który też jest LCP.

**Do startera.** Ten test kopiuje się razem z każdym blokiem otwierającym stronę.
Jeden na blok, nie jeden na projekt.

---

### P-033 — pomiar layoutu przed `document.fonts.ready` kłamie o kilkanaście pikseli

**Objaw.** Skrypt mierzący zbudowaną stronę zwraca odstępy 40 zamiast 20 i 56
zamiast 36 — konsekwentnie, powtarzalnie, o jedną i tę samą wartość za dużo.
Wygląda jak błąd w CSS-ie. Drugi przebieg tego samego skryptu daje wartości
dokładne.

**Przyczyna.** `waitUntil: 'load'` nie czeka na webfont. Do czasu podmiany fontu
wysokości pudełek liniowych liczą się z metryk fallbacku, a że skala ma leadingi
podane wprost (`--text-display` 72/72), różnica ląduje w odstępach między
elementami, nie w ich wysokościach — czyli w dokładnie tych liczbach, które się
porównuje z projektem.

**Fix.** `await page.evaluate(() => document.fonts.ready)` przed każdym odczytem
geometrii. `toHaveScreenshot()` robi to samo od siebie, dlatego snapshoty tego
nie widziały.

**Wyłapuje.** Nic — to pułapka narzędzia pomiarowego, nie kodu. Stąd ten wpis.

**Do startera.** Jedna linia w skrypcie pomiarowym, ale kosztuje przebieg
pomiaru za każdym razem, kiedy się o niej zapomni.


### P-034 — odmaskowanie animuje pustą ramkę albo niczego nie maskuje

**Objaw.** Zdjęcie w sekcji jest poprawnie widoczne w stanie końcowym, ale nie
widać jego animacji wejścia. Odczyt `getAnimations()` pokazuje działający czas
i zmieniający się `transform`, więc wygląda to jak problem obserwatora lub HMR.

**Przyczyna 1 — przycina nie ten element.** Ruchomy panel i obraz jadący w
przeciwną stronę dają nieruchomy obraz. Jeśli `overflow: clip` ma tylko
nieruchoma ramka zewnętrzna, obraz mieści się w niej przez całą animację i jest
widoczny w całości. Przycinanie musi być na **ruchomym panelu**, którego szerokość
widoczna faktycznie rośnie.

**Przyczyna 2 — deadlock lazy-loadingu.** Całkowicie przycięty `loading="lazy"`
może nie zostać kandydatem do pobrania, bo przeglądarka nie widzi malowanych
pikseli. Animacja czeka wtedy na `decode()`, a pobranie czeka na odsłonięcie.
Po wejściu samej ramki w viewport trzeba ustawić `img.loading = "eager"`,
poczekać na `load` i `decode()`, a dopiero potem zwolnić animację. Request
nadal nie startuje przy wejściu na stronę — dopiero przy przecięciu ramki.

**Dlaczego stan końcowy kłamie.** Zrzut po 1,5 s pokazuje całe zdjęcie zarówno
dla poprawnej, jak i błędnej wersji. Rozstrzyga dopiero klatka pośrednia:
prostokąt ruchomego panelu musi pokrywać tylko część stałej ramki, a zrzut ma
pokazywać dokładnie ten sam fragment.

**Wyłapuje.** Docelowo test klatki pośredniej po spełnieniu warunków
`intersection + decode`. W tym wdrożeniu testy odłożono na prośbę klienta;
usterkę potwierdzono odczytem prostokątów i zrzutem w trakcie animacji.


### P-035 — moduł odpala się przed gotowym CSS-em i zapisuje próg scrolla równy zero

**Objaw.** Header ma wejść po 192 px, ale w WebKicie sporadycznie staje się sticky
po pierwszym pikselu scrolla. Ten sam test pojedynczo przechodzi, a przy kilku
równoległych stronach konsekwentnie łapie błąd. Późniejszy odczyt DOM-u pokazuje
poprawne `offsetTop = 192`, więc próg wygląda na dobry.

**Przyczyna.** Moduł czytał `offsetTop` CSS-owo pozycjonowanego znacznika podczas
inicjalizacji. Przy wolniejszym ładowaniu WebKit wykonał skrypt, zanim zastosował
arkusz, i zapisał `0` na całe życie strony. Późniejsze inspekcje widziały już
gotowy layout, nie wartość zamkniętą wcześniej w zmiennej.

**Fix.** Do zdarzenia `load` próg ma wartość `Infinity`. Dopiero wtedy jest
mierzony i od razu synchronizowany ze scrollem; `resize` powtarza pomiar. Użytkownik
może przewijać podczas ładowania, ale header pojawi się najwcześniej po gotowym
layoucie, nigdy na podstawie fałszywego zera.

**Wyłapuje.** Test zachowania uruchamiany równolegle w Chromium i WebKit: mierzy
rzeczywisty próg, sprawdza stan tuż przed i tuż po nim. Sam pojedynczy przebieg
nie odtwarzał wyścigu.

**Do startera.** Pomiar zależny od CSS-u robi się po `load` (a od fontu dodatkowo
po `document.fonts.ready`, patrz P-033) albo liczy na bieżąco, jeśli koszt reflow
jest świadomie zaakceptowany.


### P-036 — statyczny staging nie jest pełnym stackiem z wyłączonym CMS-em

**Objaw.** Astro buduje się z fixtures bez CMS-a, ale router stagingowy nie
startuje albo Compose czeka bez końca na usługę Payload. Samo
`CONTENT_SOURCE=fixtures` nie wystarcza.

**Przyczyna.** Pełny stack ma poprawne dla produkcji twarde zależności:
`depends_on` czeka na zdrowy CMS, a Nginx rozwiązuje host upstreamu `payload`
już przy starcie, nawet jeśli nikt nie odwiedza `/admin` ani `/api`. Próba
uczynienia tych zależności opcjonalnymi osłabia wdrożenie etapu 2 i mnoży
warunki w jednym pliku.

**Fix.** Osobny `docker-compose.staging.yml` zawiera tylko jednorazowy builder
Astro i statyczny Nginx z własnym konfigiem bez upstreamu CMS. Router zależy od
buildera przez `condition: service_completed_successfully`, więc nie publikuje
pustego wolumenu i nie potrzebuje własnego skryptu deployu.

**Wyłapuje.** `docker compose config`, build obu obrazów oraz smoke test HTTP
pełnego stagingowego Compose.

**Do startera.** Oba pliki stagingowe i krótka instrukcja przejścia na pełny
stack. Staging etapu 1 i produkcja etapu 2 mają wspólny Dockerfile, ale osobne
grafy usług.


### P-037 — dwie animacje scroll-driven na jednym elemencie kasują się nawzajem

**Objaw.** Element ma osobne wejście i wyjście na `view()` — jedno wygasa, drugie
nie wchodzi. Albo wejście w ogóle nie gra: przez cały czas widać stan początkowy
animacji wyjścia. Każda z nich osobno jest poprawna.

**Przyczyna.** Dwie rzeczy naraz. Po pierwsze, animacje **nie komponują**
`transform`: kilka animacji ruszających tę samą własność rozstrzyga się przez
kolejność, ostatnia wygrywa całość — nie sumują się jak w oprogramowaniu do
montażu. Po drugie, `animation-fill-mode: both` na animacji wyjścia oznacza
wypełnienie **wstecz**: poza swoim zakresem, czyli przez całe wejście, trzyma
własną klatkę `from` i nadpisuje to, co robi wejście.

**Fix.** Jedna własność na animację: `transform` dla jednej, `translate` (oraz
`rotate`, `scale`) dla drugiej — to osobne własności i mnożą się w podanej
kolejności, więc mogą pracować równolegle. Kiedy to nie wystarcza, rozbij ruch na
dwa elementy (ramka i jej `<img>`) zamiast układać wszystko na jednym. Do tego
`animation-fill-mode: both, forwards` — wejście wypełnia w obie strony, wyjście
wyłącznie w przód.

**Wyłapuje.** Nic automatycznego; różnica jest czysto wizualna. Objaw jest za to
charakterystyczny: własność animowana przez dwie reguły stoi na wartości tej
zapisanej **później** w `animation-name`.

**Do startera.** Notatka przy wzorcu scroll-driven. Reguła kciuka: policz
własności, nie animacje — jeśli dwie animacje trafiają w tę samą własność,
jedna z nich jest do przepisania.


### P-038 — `inset-inline-start: 50%` na `position: sticky` centruje tylko przypadkiem

**Objaw.** Wyśrodkowany element jest na środku na desktopie i wyjeżdża poza lewą
krawędź na telefonie — o kilkadziesiąt do stu kilkudziesięciu pikseli, bez
poziomego scrolla, przy poprawnej szerokości elementu. Żaden breakpoint nie tłumaczy
przesunięcia, bo żaden go nie wprowadza.

**Przyczyna.** Klasyczna para `left: 50%` + `translate(-50%)` jest wzorcem dla
`position: absolute`, gdzie inset ustawia pozycję. Dla `sticky` inset jest
**ograniczeniem przyklejenia** i przesunięcie, o które prosi, jest przycinane do
krawędzi bloku zawierającego — element nigdy nie wyjeżdża poza swojego rodzica.
Dopóki element jest wąski względem rodzica, limit nie dotyka i wygląda to na
poprawne centrowanie. Gdy element rośnie do prawie pełnej szerokości rodzica,
limit obcina przesunięcie prawie do zera, a `translate(-50%)` i tak odejmuje pełne
pół szerokości. Im węższy ekran, tym większy błąd — czyli dokładnie odwrotnie niż
podpowiada intuicja „zepsuło się na mobile".

**Fix.** `margin-inline: auto` do centrowania w poziomie, inset tylko na tej osi,
na której faktycznie ma się kleić (`inset-block-start`), i `translate` wyłącznie
z częścią pionową. Jeśli element naprawdę potrzebuje inline-owego insetu, nie
może być `sticky` — potrzebuje `absolute` w warstwie wewnętrznej.

**Wyłapuje.** Nic — jeszcze. Właściwym nośnikiem jest asercja geometrii, nie
snapshot: `getBoundingClientRect().left` elementu vs `(viewport - width) / 2` na
najwęższym breakpoincie. Snapshot łapie to dopiero wtedy, gdy ktoś na niego
popatrzy, a diff jest zielony tak długo, jak zepsuty stan jest tym
zaakceptowanym — a właśnie tak ta usterka przeżyła cały poprzedni przebieg.

**Do startera.** Reguła kciuka: `left/right` przy `sticky` czytaj jak
`min-width` — to podłoga, nie współrzędna.


### P-039 — marquee z `space-between`: pięć odstępów równych, szósty zerowy

**Objaw.** Nieskończenie przewijający się pas logotypów wygląda równo przez
większość cyklu, ale raz na obieg jedno logo przykleja się do poprzedniego bez
odstępu, podczas gdy reszta stoi daleko od siebie. Nic w kodzie nie mówi „zero" —
wszystkie odstępy pochodzą z jednego tokenu.

**Przyczyna.** Wzorzec marquee to N identycznych grup w jednym `flex`-owym torze
przesuwanym o `translateX`. Jeśli grupa dostaje `min-inline-size: 100%` +
`justify-content: space-between`, żeby trafić w rozstaw z projektu, to
`space-between` rozdziela nadmiar **tylko wewnątrz grupy** — a szew między
ostatnim elementem grupy A i pierwszym grupy B nie jest odstępem elementów, tylko
stykiem dwóch flex-itemów toru. Wewnątrz: pięć odstępów po ~108 px. Na szwie:
zero. Pomiar wykonany na jednej grupie pokazuje idealną równość i niczego nie
wykrywa.

Drugi, pokrewny błąd tej samej rodziny: `gap` na torze naprawia szew, ale psuje
pętlę. Tor ma wtedy szerokość `N*W + (N-1)*g`, a okres pętli to `W + g` — te dwie
liczby nie są już swoimi wielokrotnościami i `translateX(-100%/N)` zaczyna
dryfować.

**Fix.** Rozstaw w pasie, który się powtarza, musi być **wartością**, a nie
resztą z podziału. Grupy o szerokości `max-content`, jeden literalny token na
`gap`, a odstęp szwu jako `padding-inline-end` **grupy** — wtedy grupa ma
dokładnie szerokość okresu, tor ma `N × okres` i `translateX(calc(-100% / N))`
jest dokładnie jednym okresem. Liczba grup wynika z geometrii, nie z nawyku:
potrzeba `N ≥ 1 + szerokość_kontenera / okres`, bo przy dwóch grupach i okresie
węższym od kontenera w połowie cyklu otwiera się dziura przy prawej krawędzi.
Prędkość jest w px/s, więc po zmianie okresu czas trwania trzeba przeliczyć —
inaczej pas nagle przyspiesza.

**Wyłapuje.** `tests/visual/logo-wall.spec.ts`, „spaces every mark in the row
identically, seams included": zatrzymuje animację, przechodzi po **wszystkich**
elementach toru po kolei i sprawdza każdą przerwę `left - poprzedni.right`, więc
szwy są w pomiarze na równi z odstępami wewnętrznymi. Liczba przerw jest
asercją samą w sobie — wypada z liczby grup.

**Do startera.** Reguła kciuka dla każdego pasa, który się zapętla: mierz odstępy
przez szew, nigdy w obrębie jednej grupy. I nie używaj `space-between` tam, gdzie
treść się powtarza — rozkład reszty jest lokalny, a pętla jest globalna.

---

### P-054 — `astro dev` serwuje stary scoped CSS komponentu, HTML jest już nowy

**Objaw.** Zmieniasz `<style>` w komponencie `.astro`, przeładowujesz stronę
i nic. Nowy **markup** jest na stronie, nowe reguły też są w źródle strony
(`curl | grep` je znajduje), ale przeglądarka ich nie stosuje: element ma
`data-astro-cid-…`, reguła ma ten sam `data-astro-cid-…`, a `getComputedStyle`
zwraca wartości sprzed zmiany. `el.matches(r.selectorText)` po wszystkich
`document.styleSheets` nie daje **żadnego** trafienia — arkusza z tymi regułami
po prostu nie ma w dokumencie.

**Przyczyna.** W dev Astro nie wstawia scoped CSS-u inline. Wstrzykuje go moduł
`/src/…/Komponent.astro?astro&type=style&index=0&lang.css`, a ten potrafi
zostać w cache'u transformacji Vite'a i nie unieważnić się przy edycji stylu.
Zapytanie o ten adres wprost pokazuje starą treść — i to jest test rozstrzygający.
Mylące jest to, że tokeny z `packages/tokens/tokens.css` **aktualizują się**
normalnie, bo to zwykły globalny arkusz: część efektu zmiany widać (bo przeszła
przez token), a część nie, więc wygląda to jak błąd w CSS-ie komponentu.

**Fix.** Restart dev servera. Zanim zaczniesz debugować własny selektor:
`curl -s "http://localhost:PORT/src/components/…/X.astro?astro&type=style&index=0&lang.css" | grep NOWA_KLASA`
— pusto znaczy, że problem jest w serwerze, nie w kodzie.

**Wyłapuje.** Nic automatycznego. Miarodajny jest build: `pnpm build` inline'uje
scoped CSS do HTML-a, więc pomiar na `dist/` (Playwright na statycznym serwerze)
pokazuje prawdę. Reguła: **geometrię mierzysz na zbudowanej stronie, nie na dev
serverze.**

**Do startera.** Skrypt pomiarowy celujący w `dist/`, nie w `:4321`.
