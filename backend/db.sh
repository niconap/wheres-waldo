#!/bin/bash
set -e

BLUE="\e[34m"
GREEN="\e[32m"
RED="\e[31m"
RESET="\e[0m"

if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
else
  echo "${RED}.env file not found. Please create one with the required variables.${RESET}"
  exit 1
fi

echo "${BLUE}Checking for existing container...${RESET}"
if [ "$(docker ps -aq -f name=$DB_CONTAINER_NAME)" ]; then
  echo "${BLUE}Removing existing container $DB_CONTAINER_NAME...${RESET}"
  if docker rm -f $DB_CONTAINER_NAME; then
    echo "${GREEN}Removed existing container successfully!${RESET}"
  else
    echo "${RED}Failed to remove existing container!${RESET}"
    exit 1
  fi
else
  echo "${GREEN}No existing container found.${RESET}"
fi

echo "${BLUE}Starting PostgreSQL Docker container...${RESET}"
if docker run --name $DB_CONTAINER_NAME -e POSTGRES_USER=$DB_USER -e POSTGRES_PASSWORD=$DB_PASSWORD -e POSTGRES_DB=$DB_NAME -p $DB_PORT:5432 -d $DB_IMAGE; then
  echo "${GREEN}PostgreSQL container started successfully!${RESET}"
else
  echo "${RED}Failed to start PostgreSQL container!${RESET}"
  exit 1
fi

echo "${BLUE}Waiting for the database to be ready...${RESET}"
until docker exec $DB_CONTAINER_NAME pg_isready -U $DB_USER > /dev/null 2>&1; do
  sleep 1
done
echo "${GREEN}Database is ready!${RESET}"

echo "${BLUE}Setting up .env file...${RESET}"
if grep -q "^DATABASE_URL=" .env; then
  echo "${BLUE}Replacing existing DATABASE_URL in .env file...${RESET}"
  if sed -i "s|^DATABASE_URL=.*|DATABASE_URL=\"postgresql://$DB_USER:$DB_PASSWORD@localhost:$DB_PORT/$DB_NAME\"|" .env; then
    echo "${GREEN}DATABASE_URL replaced successfully!${RESET}"
  else
    echo "${RED}Failed to replace DATABASE_URL!${RESET}"
    exit 1
  fi
else
  echo "${BLUE}Adding DATABASE_URL to .env file...${RESET}"
  if echo "" >> .env && echo "DATABASE_URL=\"postgresql://$DB_USER:$DB_PASSWORD@localhost:$DB_PORT/$DB_NAME\"" >> .env; then
    echo "${GREEN}DATABASE_URL added successfully!${RESET}"
  else
    echo "${RED}Failed to add DATABASE_URL!${RESET}"
    exit 1
  fi
fi

echo "${BLUE}Running Prisma migrations...${RESET}"
if npx prisma migrate dev --name init; then
  echo "${GREEN}Prisma migrations applied successfully!${RESET}"
else
  echo "${RED}Failed to apply Prisma migrations!${RESET}"
  exit 1
fi

echo "${BLUE}Seeding the database...${RESET}"
if node prisma/seed.js; then
  echo "${GREEN}Filled the database successfully!${RESET}"
else
  echo "${RED}Failed to fill the database!${RESET}"
  exit 1
fi

echo "${BLUE}To stop the database container, run: docker stop $DB_CONTAINER_NAME${RESET}"
echo "${BLUE}To remove the container, run: docker rm $DB_CONTAINER_NAME${RESET}"
echo "${BLUE}To start the app, use npm run start${RESET}"
