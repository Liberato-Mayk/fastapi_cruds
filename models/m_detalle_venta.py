from sqlmodel import SQLModel, Field, Relationship
from typing import Optional


class DetalleVenta(SQLModel, table=True):
    __tablename__ = "detalle_ventas"

    id: Optional[int] = Field(default=None, primary_key=True)

    venta_id: int = Field(foreign_key="ventas.id")
    producto_id: int = Field(foreign_key="productos.id")

    cantidad: int
    precio_unitario: float
    subtotal: float

    venta: Optional["Venta"] = Relationship(back_populates="detalles")
    producto: Optional["Producto"] = Relationship(back_populates="detalles")