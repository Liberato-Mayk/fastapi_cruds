from fastapi import APIRouter, Depends
from sqlmodel import Session
from database import get_session

from crud.c_mensaje import crear_mensaje, listar_mensajes
from schemas.s_mensajes import MensajeCreate
from models.m_mensajes import Mensaje

router = APIRouter(prefix="/mensajes", tags=["Mensajes"])


@router.post("/", response_model=Mensaje)
def crear(mensaje: MensajeCreate, db: Session = Depends(get_session)):
    return crear_mensaje(db, mensaje)


@router.get("/")
def listar(db: Session = Depends(get_session)):
    return listar_mensajes(db)