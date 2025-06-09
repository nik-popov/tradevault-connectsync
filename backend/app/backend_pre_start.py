import logging
import subprocess # NEW: Import the subprocess module
from sqlalchemy import Engine
from sqlmodel import Session, select
from tenacity import after_log, before_log, retry, stop_after_attempt, wait_fixed

from app.core.db import engine

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

max_tries = 60 * 5  # 5 minutes
wait_seconds = 1


@retry(
    stop=stop_after_attempt(max_tries),
    wait=wait_fixed(wait_seconds),
    before=before_log(logger, logging.INFO),
    after=after_log(logger, logging.WARN),
)
def check_db_is_awake(db_engine: Engine) -> None:
    """Waits for the database to become available."""
    try:
        with Session(db_engine) as session:
            # Try to create session to check if DB is awake
            session.exec(select(1))
    except Exception as e:
        logger.error(e)
        raise e

# NEW: Function to run Alembic migrations
def run_migrations() -> None:
    """Applies all Alembic migrations."""
    logger.info("Running database migrations...")
    try:
        # We use subprocess.run to execute the alembic command.
        # check=True will raise a CalledProcessError if the command returns a non-zero exit code (i.e., it fails)
        command = ["alembic", "upgrade", "head"]
        result = subprocess.run(
            command,
            capture_output=True,
            text=True,
            check=True,
        )
        logger.info(result.stdout) # Log the successful output from alembic
        logger.info("Database migrations completed successfully.")
    except subprocess.CalledProcessError as e:
        # If migrations fail, log the error output and re-raise the exception
        # This will cause the prestart container to exit with an error, which is what we want.
        logger.error("Migrations failed!")
        logger.error(e.stderr)
        raise e
    except FileNotFoundError:
        logger.error("The 'alembic' command was not found. Is Alembic installed in the container's PATH?")
        raise


def main() -> None:
    logger.info("Initializing service")
    check_db_is_awake(engine) # First, wait for the database
    run_migrations()          # Then, run the migrations
    logger.info("Service finished initializing")


if __name__ == "__main__":
    main()