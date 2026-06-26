#!/bin/bash
set -euo pipefail

PROJECT_DIR="/www/wwwroot/luckyhouse"
DEPLOY_BRANCH="master"
CONTAINER_NAME="luckyhouse"
LOG_FILE="/www/wwwroot/luckyhouse/deploy.log"
HEALTH_URL="http://127.0.0.1:3000/zh"
HEALTH_TIMEOUT=90
HEALTH_INTERVAL=5

cd "$PROJECT_DIR" || { echo "Failed to cd to $PROJECT_DIR"; exit 1; }

echo "[$(date)] Starting deploy..." | tee -a "$LOG_FILE"

PREV_COMMIT=$(git rev-parse HEAD)

# Pull latest
git fetch origin "$DEPLOY_BRANCH"
NEW_COMMIT=$(git rev-parse "origin/$DEPLOY_BRANCH")
CURRENT_COMMIT=$(git rev-parse HEAD)

if [ "$CURRENT_COMMIT" = "$NEW_COMMIT" ]; then
    echo "[$(date)] Already up to date ($CURRENT_COMMIT)" | tee -a "$LOG_FILE"
    exit 0
fi

echo "[$(date)] Updating $CURRENT_COMMIT -> $NEW_COMMIT" | tee -a "$LOG_FILE"
git checkout "$NEW_COMMIT"

# Build (no-cache to avoid stale layers)
echo "[$(date)] Building Docker image..." | tee -a "$LOG_FILE"
docker compose build --no-cache 2>&1 | tee -a "$LOG_FILE"

# Restart
docker compose up -d --remove-orphans 2>&1 | tee -a "$LOG_FILE"

# Health check
echo "[$(date)] Health check..." | tee -a "$LOG_FILE"
ELAPSED=0
while [ $ELAPSED -lt $HEALTH_TIMEOUT ]; do
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_URL" 2>/dev/null || echo "000")
    if [ "$STATUS" = "200" ]; then
        echo "[$(date)] Deploy SUCCESS (HTTP 200, ${ELAPSED}s)" | tee -a "$LOG_FILE"
        docker image prune -f 2>/dev/null
        exit 0
    fi
    sleep $HEALTH_INTERVAL
    ELAPSED=$((ELAPSED + HEALTH_INTERVAL))
    echo "  waiting... ${ELAPSED}s (HTTP $STATUS)" | tee -a "$LOG_FILE"
done

# Rollback
echo "[$(date)] HEALTH CHECK FAILED! Rolling back to $PREV_COMMIT" | tee -a "$LOG_FILE"
git checkout "$PREV_COMMIT"
docker compose build --no-cache 2>&1 | tee -a "$LOG_FILE"
docker compose up -d --remove-orphans 2>&1 | tee -a "$LOG_FILE"
echo "[$(date)] Rollback complete" | tee -a "$LOG_FILE"
exit 1
