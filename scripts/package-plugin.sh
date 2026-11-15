#!/bin/sh
# Assemble the plugin directory with the same layout `decky plugin build`
# (the Decky store builder) produces, so GitHub release zips and store zips
# match:
#   LICENSE main.py package.json plugin.json README.md
#   dist/              frontend build (run `npm run build` first)
#   py_modules/        our backend modules, stdlib shims and the committed
#                      third-party deps in py_modules/vendor (copied as-is)
#
# Usage: scripts/package-plugin.sh <output-dir> [version]
#   [version] is written to <output-dir>/VERSION (release zips only).
set -eu

OUT="$1"
VERSION="${2:-}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

if [ ! -f "$ROOT/dist/index.js" ]; then
    echo "ERROR: dist/index.js not found - build the frontend first" >&2
    exit 1
fi

if [ ! -d "$ROOT/py_modules/vendor/howlongtobeatpy" ]; then
    echo "ERROR: py_modules/vendor is missing - run scripts/vendor-deps.sh" >&2
    exit 1
fi

rm -rf "$OUT"
mkdir -p "$OUT"

for f in LICENSE main.py package.json plugin.json README.md; do
    cp "$ROOT/$f" "$OUT/"
done
cp -r "$ROOT/dist" "$OUT/"
cp -r "$ROOT/py_modules" "$OUT/"
find "$OUT/py_modules" -name __pycache__ -type d -prune -exec rm -rf {} +

if [ -n "$VERSION" ]; then
    echo "$VERSION" > "$OUT/VERSION"
fi
