from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import datetime
from typing import List


class Producto(SQLModel, table=True):
    __tablename__ = "productos"

    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(max_length=150, index=True)

    categoria_id: int = Field(foreign_key="categorias.id")

    stock: int = Field(default=0)
    precio: float = Field(default=0)

    fecha_creacion: datetime = Field(default_factory=datetime.utcnow)

    categoria: Optional["Categoria"] = Relationship(back_populates="productos")
    
    detalles: List["DetalleVenta"] = Relationship(back_populates="producto")