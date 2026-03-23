from sqlmodel import SQLModel
from datetime import datetime
from typing import Optional


class CategoriaBase(SQLModel):
    nombre: str
    descripcion: Optional[str] = None


class CategoriaCreate(CategoriaBase):
    pass


class CategoriaUpdate(SQLModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None


class CategoriaRead(CategoriaBase):
    id: int
    fecha_creacion: datetime