from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime


class Venta(SQLModel, table=True):
    __tablename__ = "ventas"

    id: Optional[int] = Field(default=None, primary_key=True)
    cliente_id: int = Field(foreign_key="clientes.id")
    fecha: datetime = Field(default_factory=datetime.utcnow)
    total: float = Field(default=0)

    cliente: Optional["Cliente"] = Relationship(back_populates="ventas")
    detalles: List["DetalleVenta"] = Relationship(back_populates="venta")