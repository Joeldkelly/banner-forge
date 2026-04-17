#!/usr/bin/env bash
# banner-forge — build-all.sh
# Orchestrates the four-stage pipeline. Stops at first failure.
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$HERE/.." && pwd)"
cd "$ROOT"

echo "==> build"
node scripts/build.js

echo "==> render"
node scripts/render.js

echo "==> package"
node scripts/package.js

echo "==> validate"
if node scripts/validate.js; then
  echo ""
  echo "banner-forge: all green. deliverables in ./dist/"
else
  echo ""
  echo "banner-forge: validation failures above. see dist/validation-report.json"
  exit 1
fi
