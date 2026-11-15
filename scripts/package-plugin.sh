#!/bin/sh
# Assemble the plugin directory with the same layout `decky plugin build`
# (the Decky store builder) produces, so GitHub release zips and store zips
# match:
#   LICENSE main.py package.json plugin.json README.md
#   dist/              frontend build (run `npm run build` first)
#   py_modules/        our backend modules + stdlib shims (copied as-is)
#   bin/py_modules/    third-party Python deps (backend/install-py-deps.sh)
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

rm -rf "$OUT"
mkdir -p "$OUT/bin"

for f in LICENSE main.py package.json plugin.json README.md; do
    cp "$ROOT/$f" "$OUT/"
done
cp -r "$ROOT/dist" "$OUT/"
cp -r "$ROOT/py_modules" "$OUT/"
find "$OUT/py_modules" -name __pycache__ -type d -prune -exec rm -rf {} +

"$ROOT/backend/install-py-deps.sh" "$ROOT/requirements.txt" "$OUT/bin/py_modules"

if [ -n "$VERSION" ]; then
    echo "$VERSION" > "$OUT/VERSION"
fi
