from sqlmodel import SQLModel
from datetime import datetime
from typing import Optional

class ClienteBase(SQLModel):
    documento: str
    nombre: str
    email: Optional[str] = None
    telefono: Optional[str] = None

class ClienteCreate(ClienteBase):
    pass

class ClienteUpdate(SQLModel):
    documento: Optional[str] = None
    nombre: Optional[str] = None
    email: Optional[str] = None
    telefono: Optional[str] = None

class ClienteRead(ClienteBase):
    id: int
    fecha_creacion: datetime