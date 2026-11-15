#!/bin/sh
set -e

exec /backend/install-py-deps.sh /plugin/requirements.txt /backend/out/py_modules
