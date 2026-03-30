from sqlmodel import Session, select
from backend.models.m_mensajes import Mensaje
from backend.schemas.s_mensajes import MensajeCreate


def crear_mensaje(db: Session, mensaje: MensajeCreate):
    nuevo_mensaje = Mensaje(**mensaje.dict())
    db.add(nuevo_mensaje)
    db.commit()
    db.refresh(nuevo_mensaje)
    return nuevo_mensaje


def listar_mensajes(db: Session):
    consulta = select(Mensaje)
    return db.exec(consulta).all()