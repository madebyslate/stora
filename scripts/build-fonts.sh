#!/usr/bin/env bash
set -euo pipefail

# Web font pipeline: TTF originals -> subsetted WOFF2 served from apps/web/public/fonts/.
#
# Originals live in _inbox/fonty/ which is gitignored; the WOFF2 output IS committed,
# so this script only runs when the type system changes. It is not part of `pnpm build`.
#
# What it does and why:
#   - subsets each weight into latin and latin-ext, each with its own unicode-range,
#     so a page with no Polish diacritics never downloads the latin-ext file;
#   - keeps kerning and standard ligatures (the design relies on Aeonik's kerning at 72px);
#   - prints the @font-face metric overrides for the fallback stack. Those numbers make
#     the fallback occupy exactly the same box as Aeonik, which is what keeps CLS at 0
#     during the swap. They belong in packages/tokens/tokens.css.
#
# Usage: scripts/build-fonts.sh

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
src="$root/_inbox/fonty"
out="$root/apps/web/public/fonts"
venv="$root/node_modules/.cache/fonttools"

# Unicode ranges match what Google Fonts ships, so the split behaves the way every
# browser already expects and we can compare payloads with any other site.
LATIN='U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD'
LATIN_EXT='U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF'

[[ -d "$src" ]] || { echo "Missing $src — drop the Aeonik TTFs there first." >&2; exit 1; }

if [[ ! -x "$venv/bin/pyftsubset" ]]; then
  echo "→ creating fonttools venv in node_modules/.cache/fonttools"
  python3 -m venv "$venv"
  "$venv/bin/pip" install -q --upgrade pip
  "$venv/bin/pip" install -q fonttools brotli
fi

mkdir -p "$out"

subset() {
  local file="$1" weight="$2" slice="$3" range="$4"
  "$venv/bin/pyftsubset" "$src/$file" \
    --output-file="$out/aeonik-$weight-$slice.woff2" \
    --flavor=woff2 \
    --layout-features='kern,liga,clig,calt,ccmp,locl,mark,mkmk,rlig' \
    --unicodes="$range" \
    --no-hinting \
    --desubroutinize \
    --name-IDs='' \
    --drop-tables+=DSIG
  printf '  %-34s %6s B\n' "aeonik-$weight-$slice.woff2" \
    "$(stat -f%z "$out/aeonik-$weight-$slice.woff2" 2>/dev/null || stat -c%s "$out/aeonik-$weight-$slice.woff2")"
}

echo "→ subsetting"
subset Aeonik-Regular.ttf 400 latin     "$LATIN"
subset Aeonik-Regular.ttf 400 latin-ext "$LATIN_EXT"
subset Aeonik-Medium.ttf  500 latin     "$LATIN"
subset Aeonik-Medium.ttf  500 latin-ext "$LATIN_EXT"

echo
echo "→ fallback metric overrides (paste into tokens.css)"
"$venv/bin/python3" - "$src" <<'PY'
import sys
from fontTools.ttLib import TTFont

src = sys.argv[1]
ARIAL = "/System/Library/Fonts/Supplemental/Arial.ttf"

# The fallback is sized so that a paragraph set in it occupies the same width as the
# same paragraph set in Aeonik. Matching average advance width (not x-height) is what
# prevents reflow when the real font swaps in, and reflow is what Lighthouse scores.
SAMPLE = ("Accelerating BESS in Poland We develop, build and operate large-scale "
          "battery energy storage Pipeline under development 1.4 GW 420 MW")


def advance_per_em(path: str) -> float:
    font = TTFont(path, lazy=True)
    upm = font["head"].unitsPerEm
    cmap = font.getBestCmap()
    hmtx = font["hmtx"]
    total = 0
    for char in SAMPLE:
        name = cmap.get(ord(char))
        if name:
            total += hmtx[name][0]
    return total / upm


aeonik = TTFont(f"{src}/Aeonik-Regular.ttf", lazy=True)
upm = aeonik["head"].unitsPerEm
hhea = aeonik["hhea"]

try:
    ratio = advance_per_em(f"{src}/Aeonik-Regular.ttf") / advance_per_em(ARIAL)
except OSError:
    print("  Arial not found at the macOS path — recompute on a machine that has it.")
    raise SystemExit(0)

# Overrides are expressed relative to the ALREADY size-adjusted em, hence the division.
print(f"  size-adjust:        {ratio * 100:.2f}%")
print(f"  ascent-override:    {hhea.ascent / upm / ratio * 100:.2f}%")
print(f"  descent-override:   {-hhea.descent / upm / ratio * 100:.2f}%")
print(f"  line-gap-override:  {hhea.lineGap / upm / ratio * 100:.2f}%")
PY
