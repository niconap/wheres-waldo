#!/bin/bash
set -e

if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
else
  echo ".env file not found. Please create one with the required variables."
  exit 1
fi

echo "Starting PostgreSQL Docker container..."
docker run --name $DB_CONTAINER_NAME -e POSTGRES_USER=$DB_USER -e POSTGRES_PASSWORD=$DB_PASSWORD -e POSTGRES_DB=$DB_NAME -p $DB_PORT:5432 -d $DB_IMAGE

echo "Waiting for the database to be ready..."
until docker exec $DB_CONTAINER_NAME pg_isready -U $DB_USER > /dev/null 2>&1; do
  sleep 1
done

echo "Database is ready!"

echo "Setting up .env file..."
cat <<EOT > .env
DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@localhost:$DB_PORT/$DB_NAME"
EOT

echo "Running Prisma migrations..."
npx prisma migrate dev --name init

echo "Prisma migrations applied successfully!"

echo "To stop the database container, run: docker stop $DB_CONTAINER_NAME"
echo "To remove the container, run: docker rm $DB_CONTAINER_NAME"