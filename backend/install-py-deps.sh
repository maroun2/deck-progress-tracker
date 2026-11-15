#!/bin/sh
# Install the plugin's Python dependencies (requirements.txt) into a
# directory that main.py adds to sys.path (bin/py_modules in the plugin zip).
#
# This is the one place dependencies get installed. It is used by:
#   - the Decky store build: decky CLI -> backend/Dockerfile -> entrypoint.sh
#   - release.sh and the GitHub workflows (via scripts/package-plugin.sh)
#
# Usage: install-py-deps.sh <requirements.txt> <target-dir>
set -eu

REQUIREMENTS="$1"
TARGET="$2"
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

# Console scripts aren't used, and they hard-code the build interpreter path.
rm -rf "$TARGET/bin"

# Guard: no compiled code may end up in the bundle.
COMPILED=$(find "$TARGET" -type f \( -name '*.so' -o -name '*.so.*' -o -name '*.pyd' \) | head -n 5)
if [ -n "$COMPILED" ]; then
    echo "ERROR: compiled files in $TARGET:" >&2
    echo "$COMPILED" >&2
    exit 1
fi

echo "Installed $(ls -d "$TARGET"/*.dist-info | wc -l) packages into $TARGET"
