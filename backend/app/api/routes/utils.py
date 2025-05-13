from fastapi import APIRouter, Depends
from pydantic.networks import EmailStr
from jinja2 import Environment, FileSystemLoader
from app.api.deps import get_current_active_superuser
from app.models import Message
from app.utils import generate_test_email, send_email
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/utils", tags=["utils"])

@router.post(
    "/test-email/",
    dependencies=[Depends(get_current_active_superuser)],
    status_code=201,
)
def test_email(email_to: EmailStr) -> Message:
    """
    Test emails.
    """
    email_data = generate_test_email(email_to=email_to)
    send_email(
        email_to=email_to,
        subject=email_data.subject,
        html_content=email_data.html_content,
    )
    return Message(message="Test email sent")

@router.get("/health-check/")
async def health_check() -> bool:
    return True

class EmailData:
    def __init__(self, html_content: str, subject: str):
        self.html_content = html_content
        self.subject = subject

def generate_new_account_email(email_to: str, username: str, password: str) -> EmailData:
    logger.debug(f"Generating new account email for: {email_to}")
    project_name = settings.PROJECT_NAME
    subject = f"{project_name} - Your Account Details"
    link = settings.FRONTEND_HOST  # e.g., http://localhost:5173

    # Set up Jinja2 environment
    env = Environment(loader=FileSystemLoader("app/templates/emails"))
    template = env.get_template("account_creation_email.html")

    # Render HTML with dynamic data
    html_content = template.render(
        project_name=project_name,
        username=username,
        password=password,
        link=link
    )

    return EmailData(html_content=html_content, subject=subject)

def send_email(email_to: str, subject: str, html_content: str) -> None:
    # Existing send_email implementation (unchanged)
    pass