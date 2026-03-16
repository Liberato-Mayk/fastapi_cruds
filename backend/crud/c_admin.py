from sqlmodel import Session, select
from models.m_admin import Admin
from utils.seguridad import get_password_hash

def create_admin(db: Session, username: str, password: str):
    hashed_password = get_password_hash(password)
    admin = Admin(username=username, hashed_password=hashed_password)
    db.add(admin)
    db.commit()
    db.refresh(admin)
    return admin


def get_admin_by_username(db: Session, username: str):
    statement = select(Admin).where(Admin.username == username)
    return db.exec(statement).first()