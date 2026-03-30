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
        raise HTTPException(status_code=400, detail="Usuario incorrecto")

    if not verify_password(data.password, admin.hashed_password):
        raise HTTPException(status_code=400, detail="Contraseña incorrecta")

    access_token = create_access_token({"sub": admin.username})

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.post("/create-admin")
def create_first_admin(data: AdminLogin, db: Session = Depends(get_session)): 
    from crud.c_admin import create_admin
    admin = create_admin(db, data.username, data.password) 
    return {"mensaje": "Admin creado", "usuario": admin.username}