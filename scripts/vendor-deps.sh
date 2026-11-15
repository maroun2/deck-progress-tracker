#!/bin/sh
# (Re)create py_modules/vendor from requirements.txt.
#
# The vendored packages are committed to the repo: Decky Loader doesn't
# install requirements.txt, and the Decky store build (decky CLI) copies
# py_modules/ into the zip as-is without running any install step. Run this
# after changing requirements.txt and commit the result; CI
# (build-artifact.yml) fails if py_modules/vendor doesn't match.
#
# Usage: scripts/vendor-deps.sh [target-dir]   (default: py_modules/vendor)
set -eu

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REQUIREMENTS="$ROOT/requirements.txt"
TARGET="${1:-$ROOT/py_modules/vendor}"
PYTHON="${PYTHON:-python3}"

rm -rf "$TARGET"
mkdir -p "$TARGET"

# --platform any / --implementation py / --abi none: accept only pure-Python
# (py3-none-any) wheels, so the bundle works on any Python that Decky embeds
# (3.11 up to Decky v3.2.x, 3.14 since v3.3.0) and needs no glibc.
# --no-deps + --require-hashes: requirements.txt is the complete, pinned
# closure, and every downloaded file must match its hash.
"$PYTHON" -m pip install \
    --disable-pip-version-check \
    --no-cache-dir \
    --no-compile \
    --no-deps \
    --require-hashes \
    --only-binary=:all: \
    --platform any \
    --implementation py \
    --abi none \
    --python-version 3.11 \
    --target "$TARGET" \
    -r "$REQUIREMENTS"

# Console scripts aren't used, and they hard-code the build interpreter's
# path. Drop them and their RECORD lines, so the result is the same on every
# machine (CI compares it with the committed copy).
rm -rf "$TARGET/bin"
for record in "$TARGET"/*.dist-info/RECORD; do
    sed -i '\#^\.\./\.\./bin/#d' "$record"
done

# Guard: no compiled code may end up in the bundle.
COMPILED=$(find "$TARGET" -type f \( -name '*.so' -o -name '*.so.*' -o -name '*.pyd' \) | head -n 5)
if [ -n "$COMPILED" ]; then
    echo "ERROR: compiled files in $TARGET:" >&2
    echo "$COMPILED" >&2
    exit 1
fi

echo "Installed $(ls -d "$TARGET"/*.dist-info | wc -l) packages into $TARGET"
