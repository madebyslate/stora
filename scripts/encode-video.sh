#!/usr/bin/env bash
set -euo pipefail

# Background-video pipeline (AGENT-RULES §5.1).
#
# Masters stay out of the repository — keep them in _inbox/ (gitignored) and commit
# only what lands in apps/web/public/video/ and content/media/.
#
# Ladder, in the order <source> elements are emitted:
#   AV1  1920×1080  — Chrome / Firefox / Edge, and Safari 17.4+ on AV1-capable hardware
#   H.264 1920×1080 — everything else
#   …and the same pair at 1280×720 behind `media="(max-width: 768px)"`
#
# The CRFs below are not defaults, they were picked from a VMAF sweep against the
# Stora master: on this footage CRF 38 → 40 costs 0.45 VMAF and saves 12% of the
# bytes, so 40 is the knee of the curve. Re-run the sweep for different footage
# instead of assuming these transfer (see the block at the bottom).
#
# Budgets this script has to respect:
#   desktop ≤ 2 MB · mobile ≤ 1 MB · no audio track · +faststart (moov up front)
#
# The poster is frame 0, deliberately: playback starts on that exact frame, so the
# swap from poster to video is invisible. Anything else shows up as a Speed Index
# regression and, worse, as a flash.
#
# Usage:
#   scripts/encode-video.sh <master-file> <output-basename>
# e.g.
#   scripts/encode-video.sh _inbox/wideo/stora-hero-vid.webm hero

usage() {
  echo "Usage: $0 <master-file> <output-basename>" >&2
  exit 1
}

[[ $# -eq 2 ]] || usage

src="$1"
name="$2"
root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
out="$root/apps/web/public/video"
poster_out="$root/content/media"

command -v ffmpeg >/dev/null || { echo "ffmpeg not found." >&2; exit 1; }
[[ -f "$src" ]] || { echo "No such file: $src" >&2; exit 1; }

mkdir -p "$out" "$poster_out"

common=(-an -movflags +faststart -pix_fmt yuv420p -r 24 -g 96)

echo "→ AV1 1920×1080"
ffmpeg -y -v error -i "$src" -vf "scale=1920:1080:flags=lanczos" \
  -c:v libsvtav1 -crf 40 -preset 4 -svtav1-params "tune=0:film-grain=0" \
  "${common[@]}" "$out/$name.av1.mp4"

echo "→ H.264 1920×1080 (fallback)"
ffmpeg -y -v error -i "$src" -vf "scale=1920:1080:flags=lanczos" \
  -c:v libx264 -crf 30 -preset veryslow -profile:v high -level 4.2 \
  "${common[@]}" "$out/$name.mp4"

echo "→ AV1 1280×720"
ffmpeg -y -v error -i "$src" -vf "scale=1280:720:flags=lanczos" \
  -c:v libsvtav1 -crf 40 -preset 4 -svtav1-params "tune=0:film-grain=0" \
  "${common[@]}" "$out/$name-mobile.av1.mp4"

echo "→ H.264 1280×720 (fallback)"
ffmpeg -y -v error -i "$src" -vf "scale=1280:720:flags=lanczos" \
  -c:v libx264 -crf 29 -preset veryslow -profile:v high -level 4.0 \
  "${common[@]}" "$out/$name-mobile.mp4"

echo "→ poster (frame 0, JPEG master for astro:assets)"
ffmpeg -y -v error -i "$src" -frames:v 1 -q:v 1 -qmin 1 "$poster_out/$name-poster.jpg"

echo
printf '%-30s %10s %s\n' FILE BYTES BUDGET
for f in "$out/$name.av1.mp4" "$out/$name.mp4" "$out/$name-mobile.av1.mp4" "$out/$name-mobile.mp4"; do
  [[ -f "$f" ]] || continue
  bytes=$(stat -f%z "$f" 2>/dev/null || stat -c%s "$f")
  case "$f" in
    *-mobile*) budget=1048576 ;;
    *)         budget=2097152 ;;
  esac
  status=OK
  (( bytes > budget )) && status="OVER BUDGET"
  printf '%-30s %10d %s\n' "$(basename "$f")" "$bytes" "$status"
done

cat <<'NOTE'

Re-tuning CRF for new footage:
  for crf in 36 38 40 42; do
    ffmpeg -y -v error -i MASTER -vf scale=1920:1080 -c:v libsvtav1 -crf $crf -preset 4 \
      -an -pix_fmt yuv420p /tmp/s-$crf.mp4
    ffmpeg -hide_banner -i /tmp/s-$crf.mp4 -i MASTER \
      -lavfi "[0:v]setpts=PTS-STARTPTS[d];[1:v]setpts=PTS-STARTPTS[r];[d][r]libvmaf" -f null - 2>&1 \
      | grep -Eo "VMAF score: [0-9.]+"
  done
Pick the CRF where the VMAF curve flattens and the file still fits the budget.
NOTE
