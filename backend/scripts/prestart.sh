#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status.
set -e
# Print each command to the log before executing.
set -x

# 1. Wait for the database to be available.
echo "⏳ Waiting for database..."
python app/backend_pre_start.py

# 2. Run database migrations.
echo "🚀 Applying database migrations..."
alembic upgrade head

# 3. Create initial data.
echo "🌱 Seeding initial data..."
python app/initial_data.py

echo "✅ Pre-start complete. Backend can now start."