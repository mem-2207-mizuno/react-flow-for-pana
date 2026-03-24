#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
GAS_DIR="$PROJECT_ROOT/gas"
DEPLOYMENT_ID_FILE="$GAS_DIR/.deploymentId"

cd "$GAS_DIR"

if [ -f "$DEPLOYMENT_ID_FILE" ]; then
  DEPLOY_ID=$(cat "$DEPLOYMENT_ID_FILE")
  echo "Updating existing deployment: $DEPLOY_ID"
  clasp deploy -i "$DEPLOY_ID" -d "$(date '+%Y-%m-%d %H:%M')"
else
  echo "Creating new deployment..."
  OUTPUT=$(clasp deploy -d "initial" 2>&1)
  echo "$OUTPUT"
  # Extract deployment ID from output like: "Deployed AKfycbx... @1"
  DEPLOY_ID=$(echo "$OUTPUT" | awk '/^Deployed / { print $2 }')
  if [ -n "$DEPLOY_ID" ]; then
    echo "$DEPLOY_ID" > "$DEPLOYMENT_ID_FILE"
    echo "Deployment ID saved: $DEPLOY_ID"
  else
    echo "Warning: Could not extract deployment ID. Check output above."
    echo "You can manually save the ID to $DEPLOYMENT_ID_FILE"
  fi
fi

echo ""
echo "Open web app: clasp open --webapp --deploymentId $(cat "$DEPLOYMENT_ID_FILE" 2>/dev/null || echo '<ID>')"
