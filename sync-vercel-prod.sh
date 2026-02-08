#!/usr/bin/env bash
# Sync local .env to Vercel Production (override and add)
# Usage:
#   ./sync-vercel-prod.sh [ENV_FILE=.env] [TARGET=production]
# Examples:
#   ./sync-vercel-prod.sh               # sync ./.env to production
#   ./sync-vercel-prod.sh .env.local    # sync a specific file
#   ./sync-vercel-prod.sh .env preview  # sync to preview instead

set -o pipefail

ENV_FILE="${1:-.env}"
TARGET_ENV="${2:-production}"

# Preconditions
if ! command -v vercel >/dev/null 2>&1; then
  echo "Error: vercel CLI not found. Install with: npm i -g vercel" >&2
  exit 1
fi

if [ ! -f .vercel/project.json ]; then
  echo "Error: this directory is not linked to a Vercel project. Run: vercel link" >&2
  exit 1
fi

if [ ! -f "$ENV_FILE" ]; then
  echo "Error: env file '$ENV_FILE' not found." >&2
  exit 1
fi

if ! vercel whoami >/dev/null 2>&1; then
  echo "Error: not authenticated to Vercel. Run: vercel login" >&2
  exit 1
fi

updated=0
added=0
failed=0

# Read file line-by-line and handle KEY=VALUE pairs.
# - Ignores blank lines and lines starting with '#'
# - Supports optional leading 'export '
# - Trims surrounding single/double quotes from values
# - Preserves all other characters exactly
while IFS= read -r raw || [ -n "$raw" ]; do
  # strip CR for Windows-formatted files
  line="${raw%$'\r'}"

  # trim leading whitespace
  while [[ "$line" =~ ^[[:space:]] ]]; do line="${line#[[:space:]]}"; done
  # trim trailing whitespace
  while [[ "$line" =~ [[:space:]]$ ]]; do line="${line%[[:space:]]}"; done

  # skip comments and empty lines
  [[ -z "$line" || "$line" == \#* ]] && continue

  # optional 'export '
  if [[ "$line" == export* ]]; then
    line="${line#export }"
    while [[ "$line" =~ ^[[:space:]] ]]; do line="${line#[[:space:]]}"; done
  fi

  # must contain '='
  if [[ "$line" != *=* ]]; then
    echo "Skipping non-assignment line: $line" >&2
    continue
  fi

  key="${line%%=*}"
  value="${line#*=}"

  # trim key spaces
  while [[ "$key" =~ [[:space:]]$ ]]; do key="${key%[[:space:]]}"; done
  while [[ "$key" =~ ^[[:space:]] ]]; do key="${key#[[:space:]]}"; done

  # strip surrounding quotes for value if both ends match
  if [[ "$value" =~ ^\".*\"$ ]]; then
    value="${value:1:${#value}-2}"
  elif [[ "$value" =~ ^\'.*\'$ ]]; then
    value="${value:1:${#value}-2}"
  fi

  if [[ -z "$key" ]]; then
    echo "Skipping empty key." >&2
    continue
  fi

  # First try update; if it doesn't exist, fall back to add --force
  if printf '%s' "$value" | vercel env update "$key" "$TARGET_ENV" -y --non-interactive >/dev/null 2>&1; then
    echo "Updated $key"
    ((updated++))
  else
    if printf '%s' "$value" | vercel env add "$key" "$TARGET_ENV" --yes --force --non-interactive >/dev/null 2>&1; then
      echo "Added   $key"
      ((added++))
    else
      echo "Failed  $key" >&2
      ((failed++))
    fi
  fi

done < "$ENV_FILE"

echo "Done. Updated: $updated, Added: $added, Failed: $failed"

# exit non-zero if any failures
if [ "$failed" -gt 0 ]; then
  exit 1
fi
