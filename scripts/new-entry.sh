#!/usr/bin/env bash
# Append a new Build Log entry and open it for editing.
# Usage: scripts/new-entry.sh "Title of the entry"
set -euo pipefail

TITLE="${1:-}"
if [ -z "$TITLE" ]; then
  read -rp "Entry title: " TITLE
fi

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENTRIES_FILE="$REPO_ROOT/build-log/entries.md"
DATE="$(date +%Y-%m-%d)"

{
  echo ""
  echo "## $DATE — $TITLE"
  echo "Write here."
} >> "$ENTRIES_FILE"

"${EDITOR:-vi}" "$ENTRIES_FILE"

echo "Entry stub added to $ENTRIES_FILE"
echo "When ready: git add build-log/entries.md && git commit -m 'log: $TITLE' && git push"
