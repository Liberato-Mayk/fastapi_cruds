from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel

class MensajeCreate(SQLModel):
    nombre: str
    email: str
    telefono: Optional[str] = None
    mensaje: str

class MensajeResponse(SQLModel):
    id: int
    nombre: str
    email: str
    telefono: Optional[str]
    mensaje: str
    fecha: datetime