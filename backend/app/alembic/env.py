import os
import sys
from pathlib import Path

# Add the parent directory of `app/` (i.e., `backend/`) to the path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from alembic import context
from sqlalchemy import engine_from_config, pool
import sqlmodel  # Ensure SQLModel is imported
from app.models import SQLModel  # noqa
from app.core.db import engine  # Optional: if you use a custom engine

config = context.config
connectable = engine or engine_from_config(
    config.get_section(config.config_ini_section), prefix="sqlalchemy.", poolclass=pool.NullPool
)

def run_migrations_offline():
    url = config.get_main_option("sqlalchemy.url")
    context.configure(url=url, target_metadata=SQLModel.metadata, literal_binds=True)
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=SQLModel.metadata)
        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()