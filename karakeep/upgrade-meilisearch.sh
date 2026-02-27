#!/bin/bash
# Meilisearch Upgrade Script
# Usage: ./upgrade-meilisearch.sh <new-version>
# Example: ./upgrade-meilisearch.sh v1.32.0

set -e

NEW_VERSION="${1:-}"
MEILI_MASTER_KEY="${MEILI_MASTER_KEY:-QIuTGTbaT7SWsPv9wrDGWcHZuEn1uJ6avaAcw0cQsnc2wSzd}"
COMPOSE_FILE="docker-compose.yml"

if [ -z "$NEW_VERSION" ]; then
    echo "Usage: $0 <new-version>"
    echo "Example: $0 v1.32.0"
    exit 1
fi

CURRENT_VERSION=$(grep "getmeili/meilisearch:" "$COMPOSE_FILE" | grep -oP 'v[0-9]+\.[0-9]+\.[0-9]+' | head -1)
echo "Current version: $CURRENT_VERSION"
echo "Target version: $NEW_VERSION"

echo "Step 1: Creating dump from current version..."
docker exec karakeep-meilisearch curl -s -X POST "http://localhost:7700/dumps" -H "Authorization: Bearer $MEILI_MASTER_KEY" > /dev/null
sleep 5

DUMP_FILE=$(ls -t config/meilisearch/meili_data/dumps/*.dump 2>/dev/null | head -1)
if [ -z "$DUMP_FILE" ]; then
    echo "Error: Failed to create dump"
    exit 1
fi
echo "Dump created: $DUMP_FILE"

echo "Step 2: Updating docker-compose.yml to $NEW_VERSION..."
sed -i "s|getmeili/meilisearch:v[0-9.]*|getmeili/meilisearch:$NEW_VERSION|g" "$COMPOSE_FILE"
sed -i "s|command:.*||g" "$COMPOSE_FILE"

echo "Step 3: Removing old data and importing dump..."
rm -rf config/meilisearch/meili_data/data.ms

DUMP_NAME=$(basename "$DUMP_FILE")
sed -i "/image: getmeili\/meilisearch/a\\    command: [\"meilisearch\", \"--import-dump=/meili_data/dumps/$DUMP_NAME\"]" "$COMPOSE_FILE"

echo "Step 4: Starting new version..."
docker compose up -d meilisearch
sleep 10

if docker ps --filter "name=karakeep-meilisearch" --filter "status=running" | grep -q karakeep-meilisearch; then
    echo "Step 5: Verifying upgrade..."
    NEW_DB_VERSION=$(sudo cat config/meilisearch/meili_data/data.ms/VERSION 2>/dev/null || echo "unknown")
    echo "Database version: $NEW_DB_VERSION"
    
    echo "Step 6: Cleaning up import command..."
    sed -i "/command:.*import-dump/d" "$COMPOSE_FILE"
    docker compose up -d meilisearch
    
    echo "Successfully upgraded from $CURRENT_VERSION to $NEW_VERSION!"
else
    echo "Error: Failed to start meilisearch"
    docker logs karakeep-meilisearch
    exit 1
fi
