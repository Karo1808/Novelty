#!/bin/bash

# Default environment file
ENV_FILE="docker-compose.yml"

# Check for an argument to specify the environment
if [[ $1 == "prod" ]]; then
  ENV_FILE="docker-compose.prod.yml"
elif [[ $1 == "dev" ]]; then
  ENV_FILE="docker-compose.dev.yml"
fi

echo "Looking for Compose files with name: $ENV_FILE"

# Find all specified compose files in the monorepo
COMPOSE_FILES=$(find . -name "$ENV_FILE")
echo "Found Compose files:"
echo "$COMPOSE_FILES"

# Iterate over each compose file and start the services
for COMPOSE_FILE in $COMPOSE_FILES; do
  SERVICE_DIR=$(dirname "$COMPOSE_FILE")
  ENV_FILE_PATH=$(dirname "$SERVICE_DIR")/.env.local # Adjust for parent directory

  echo "Processing $SERVICE_DIR with $ENV_FILE..."
  echo "Using .env file from $ENV_FILE_PATH"

  if [ -d "$SERVICE_DIR" ] && [ -f "$ENV_FILE_PATH" ]; then
    echo "Changing to directory: $SERVICE_DIR"
    # Explicitly specify the .env file in the parent directory
    docker compose --env-file "$ENV_FILE_PATH" -f "$SERVICE_DIR/docker-compose.yml" -f "$COMPOSE_FILE" up -d
  else
    echo "Error: Directory $SERVICE_DIR or .env file at $ENV_FILE_PATH does not exist!"
  fi
done

echo "All Docker Compose services are up and running!"
