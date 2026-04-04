from sqlmodel import SQLModel
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ProductoBase(SQLModel):
    nombre: str
    categoria_id: int
    stock: int
    precio: float

class ProductoCreate(ProductoBase):
    pass

class ProductoUpdate(SQLModel):
    nombre: Optional[str] = None
    categoria_id: Optional[int] = None
    stock: Optional[int] = None
    precio: Optional[float] = None

class ProductoRead(BaseModel):
    id: int
    nombre: str
    categoria_nombre: str
    stock: int
    precio: float
    fecha_creacion: datetime

    class Config:
        from_attributes = True
