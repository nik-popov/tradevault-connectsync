from app.models import User
from app.db.session import SessionLocal
from app.core.security import get_password_hash, create_access_token
from datetime import timedelta
import uuid

def create_temp_user_and_token():
    db = SessionLocal()
    try:
        user_id = str(uuid.uuid4())
        email = f"temp_{user_id}@example.com"
        
        user = User(
            id=user_id,
            email=email,
            first_name="Temp",
            last_name="User",
            hashed_password=get_password_hash("temppassword")
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
        token = create_access_token(subject=user_id, expires_delta=timedelta(hours=1))
        
        print(f"Temporary User ID: {user_id}")
        print(f"Temporary Email: {email}")
        print(f"JWT Token: {token}")
        return user_id, email, token
    
    finally:
        db.close()

def delete_temp_user(user_id: str):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if user:
            db.delete(user)
            db.commit()
            print(f"Deleted temporary user: {user_id}")
    finally:
        db.close()

if __name__ == "__main__":
    user_id, email, token = create_temp_user_and_token()
    print(f"Save this user_id for cleanup: {user_id}")