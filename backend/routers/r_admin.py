from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from backend.database import get_session
from backend.schemas.s_admin import AdminLogin
from backend.crud.c_admin import get_admin_by_username
from backend.utils.seguridad import verify_password, create_access_token

router = APIRouter(prefix="/admin", tags=["Admin Auth"])

@router.post("/login")
def login(data: AdminLogin, db: Session = Depends(get_session)):
    admin = get_admin_by_username(db, data.username)
    if not admin:
        return {"error": "no existe usuario"}
    return {
        "usuario": admin.username,
        "hash": admin.hashed_password
    }

@router.post("/create-admin")
def create_first_admin(data: AdminLogin, db: Session = Depends(get_session)): 
    from crud.c_admin import create_admin
    admin = create_admin(db, data.username, data.password) 
    return {"mensaje": "Admin creado", "usuario": admin.username}