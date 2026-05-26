#!/usr/bin/env bash
set -euo pipefail

UPLOAD_ROOT="${UPLOAD_DIR:-/home/bzb0159/aubria-uploads}"
UPLOADS_DIR="$UPLOAD_ROOT/uploads"

if [ ! -d "$UPLOADS_DIR" ]; then
  exit 0
fi

find "$UPLOADS_DIR" -type f -mtime +90 -delete
find "$UPLOADS_DIR" -type d -empty -delete
