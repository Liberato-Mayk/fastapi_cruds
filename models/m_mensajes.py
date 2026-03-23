from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field

class Mensaje(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str
    email: str
    telefono: Optional[str] = None
    mensaje: str
    fecha: datetime = Field(default_factory=datetime.now)