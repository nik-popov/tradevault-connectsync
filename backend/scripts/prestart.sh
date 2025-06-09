#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Use the python script to wait for the database to be available.
# This script has retry logic, which is more robust than a simple sleep.
echo "⏳ Waiting for database to be available..."
python /app/app/backend_pre_start.py

# Run the Alembic migrations to bring the database schema up to date.
echo "🚀 Running database migrations..."
alembic upgrade head

# Run the script to create initial data (e.g., first superuser).
# This will only run after the migrations have succeeded.
echo "🌱 Creating initial data..."
python /app/app/initial_data.py

echo "✅ Pre-start tasks completed successfully."