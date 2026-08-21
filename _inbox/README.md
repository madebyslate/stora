# `_inbox/` — skrzynka na materiały źródłowe

Wrzucasz tu pliki „jak leci". Ja je sortuję do docelowych miejsc i tu nie
zostawiam nic na stałe. Katalog jest w `.gitignore` (poza tym plikiem) — surowe
źródła nie wchodzą do repozytorium (AGENT-RULES §5.1).

## Gdzie co wrzucić

| Katalog | Co | Trafia docelowo do | Czy wejdzie do Payloada |
|---|---|---|---|
| `svg-design/` | logo Stora, ikony UI, piktogramy, gwiazdki, strzałki | `apps/web/src/assets/` — inline SVG, 0 requestów | ❌ nigdy — to część designu, nie treść |
| `zdjecia/` | zdjęcia treściowe (produkty, realizacje, ludzie) | `content/media/` | ✅ etap 2 |
| `logotypy/` | loga marek/partnerów, avatary | `content/media/logos/` | ✅ etap 2 |
| `wideo/` | **surowe** źródło tła (ProRes/MOV/MP4, bez kompresji) | `scripts/encode-video.sh` → `apps/web/public/video/` | ❌ pliki statyczne, nie upload |
| `fonty/` | `.woff2` (albo `.ttf`/`.otf` — dokonam subsetu) | `apps/web/public/fonts/` | ❌ |
| `figma/` | eksporty PNG sekcji do porównania ±2 px | tylko do weryfikacji, nie do repo | ❌ |

## Nazewnictwo

Nazwa pliku = nazwa, pod którą materiał będzie żył do końca projektu, także po
imporcie do Payloada. Dlatego: `kebab-case`, bez polskich znaków, bez `v2`,
`final`, `kopia`.

```
svg-design/       stora-logo.svg, icon-<nazwa>.svg
zdjecia/          <sekcja>-<opis>.jpg
logotypy/         logo-<marka>.svg
wideo/            hero-raw.mov
fonty/            <rodzina>-<waga>.woff2   np. stora-heading-700.woff2
figma/            hero-1440.png, hero-390.png
```

## Czego potrzebuję OPRÓCZ pliku

Dla wszystkiego z `zdjecia/` i `logotypy/` — jedna linia tekstu `alt`. Bez niej nie mogę
wpisać materiału do fixture (`alt` nie może być wymyślony, AGENT-RULES §7).
Dopisz do `alt.txt` w danym katalogu, w formacie:

```
logo-marka.svg = Marka
```

Grafika czysto dekoracyjna → `alt` pusty, ale napisz to wprost:

```
icon-gwiazdka.svg =
```

## Dlaczego to ma znaczenie dla etapu 2

Do Payloada da się zaimportować hurtem tylko to, co jest **wypisane w
`content/pages/*.json`** — ten plik jest manifestem: niesie ścieżkę, `alt`
i wymiary każdego materiału. Cokolwiek wyląduje w `apps/web/src/assets/`, jest
świadomie poza CMS-em, bo redaktor nie ma tego zmieniać.
