from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime


class Categoria(SQLModel, table=True):
    __tablename__ = "categorias"

    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(max_length=100, index=True)
    descripcion: Optional[str] = Field(default=None, max_length=255)

    fecha_creacion: datetime = Field(default_factory=datetime.utcnow)

    productos: List["Producto"] = Relationship(back_populates="categoria")