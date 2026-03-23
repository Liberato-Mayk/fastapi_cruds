from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime


class Cliente(SQLModel, table=True):
    __tablename__ = "clientes"

    id: Optional[int] = Field(default=None, primary_key=True)

    documento: str = Field(max_length=20, index=True)
    nombre: str = Field(max_length=150, index=True)

    email: Optional[str] = Field(default=None, max_length=100)
    telefono: Optional[str] = Field(default=None, max_length=20)

    fecha_creacion: datetime = Field(default_factory=datetime.utcnow)

    ventas: List["Venta"] = Relationship(back_populates="cliente")