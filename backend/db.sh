#!/bin/bash
set -e

BLUE="\e[34m"
GREEN="\e[32m"
RED="\e[31m"
RESET="\e[0m"

if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
else
  printf "${RED}.env file not found. Please create one with the required variables.${RESET}\n"
  exit 1
fi

printf "${BLUE}Checking for existing container...${RESET}\n"
if [ "$(docker ps -aq -f name=$DB_CONTAINER_NAME)" ]; then
  printf "${BLUE}Removing existing container $DB_CONTAINER_NAME...${RESET}\n"
  if docker rm -f $DB_CONTAINER_NAME; then
    printf "${GREEN}Removed existing container successfully!${RESET}\n"
  else
    printf "${RED}Failed to remove existing container!${RESET}\n"
    exit 1
  fi
else
  printf "${GREEN}No existing container found.${RESET}\n"
fi

printf "${BLUE}Starting PostgreSQL Docker container...${RESET}\n"
if docker run --name $DB_CONTAINER_NAME -e POSTGRES_USER=$DB_USER -e POSTGRES_PASSWORD=$DB_PASSWORD -e POSTGRES_DB=$DB_NAME -p $DB_PORT:5432 -d $DB_IMAGE; then
  printf "${GREEN}PostgreSQL container started successfully!${RESET}\n"
else
  printf "${RED}Failed to start PostgreSQL container!${RESET}\n"
  exit 1
fi

printf "${BLUE}Waiting for the database to be ready...${RESET}\n"
until docker exec $DB_CONTAINER_NAME pg_isready -U $DB_USER > /dev/null 2>&1; do
  sleep 1
done
printf "${GREEN}Database is ready!${RESET}\n"

printf "${BLUE}Setting up .env file...${RESET}\n"
if grep -q "^DATABASE_URL=" .env; then
  printf "${BLUE}Replacing existing DATABASE_URL in .env file...${RESET}\n"
  if sed -i "s|^DATABASE_URL=.*|DATABASE_URL=\"postgresql://$DB_USER:$DB_PASSWORD@localhost:$DB_PORT/$DB_NAME\"|" .env; then
    printf "${GREEN}DATABASE_URL replaced successfully!${RESET}\n"
  else
    printf "${RED}Failed to replace DATABASE_URL!${RESET}\n"
    exit 1
  fi
else
  printf "${BLUE}Adding DATABASE_URL to .env file...${RESET}\n"
  if echo "" >> .env && echo "DATABASE_URL=\"postgresql://$DB_USER:$DB_PASSWORD@localhost:$DB_PORT/$DB_NAME\"" >> .env; then
    printf "${GREEN}DATABASE_URL added successfully!${RESET}\n"
  else
    printf "${RED}Failed to add DATABASE_URL!${RESET}\n"
    exit 1
  fi
fi

printf "${BLUE}Running Prisma migrations...${RESET}\n"
if npx prisma migrate dev --name init; then
  printf "${GREEN}Prisma migrations applied successfully!${RESET}\n"
else
  printf "${RED}Failed to apply Prisma migrations!${RESET}\n"
  exit 1
fi

printf "${BLUE}Seeding the database...${RESET}\n"
if node prisma/seed.js; then
  printf "${GREEN}Filled the database successfully!${RESET}\n"
else
  printf "${RED}Failed to fill the database!${RESET}\n"
  exit 1
fi

printf "${BLUE}To stop the database container, run: docker stop $DB_CONTAINER_NAME${RESET}\n"
printf "${BLUE}To remove the container, run: docker rm $DB_CONTAINER_NAME${RESET}\n"
printf "${BLUE}To start the app, use npm run start${RESET}\n"
