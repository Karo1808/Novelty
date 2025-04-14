#!/bin/bash

ENV_FILE="docker-compose.yml"

if [[ $1 == "prod" ]]; then
  ENV_FILE="docker-compose.prod.yml"
elif [[ $1 == "dev" ]]; then
  ENV_FILE="docker-compose.dev.yml"
fi

echo "Looking for Compose files with name: $ENV_FILE"

COMPOSE_FILES=$(find . -name "$ENV_FILE")
echo "Found Compose files:"
echo "$COMPOSE_FILES"

for COMPOSE_FILE in $COMPOSE_FILES; do
  SERVICE_DIR=$(dirname "$COMPOSE_FILE")
  ENV_FILE_PATH=$(dirname "$SERVICE_DIR")/.env.local 

  echo "Processing $SERVICE_DIR with $ENV_FILE..."
  echo "Using .env file from $ENV_FILE_PATH"

  if [ -d "$SERVICE_DIR" ] && [ -f "$ENV_FILE_PATH" ]; then
    echo "Changing to directory: $SERVICE_DIR"
    docker-compose --env-file "$ENV_FILE_PATH" -f "$SERVICE_DIR/docker-compose.yml" -f "$COMPOSE_FILE" up -d
  else
    echo "Error: Directory $SERVICE_DIR or .env file at $ENV_FILE_PATH does not exist!"
  fi
done

echo "All Docker Compose services are up and running!"
