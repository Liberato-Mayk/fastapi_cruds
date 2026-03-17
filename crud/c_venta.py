from sqlmodel import Session, select
from fastapi import HTTPException
from models.m_ventas import Venta
from models.m_detalle_venta import DetalleVenta
from models.m_productos import Producto
from models.m_clientes import Cliente



def crear_venta(db: Session, venta_data):

    cliente = db.get(Cliente, venta_data.cliente_id)
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no existe")

    venta = Venta(cliente_id=venta_data.cliente_id, total=0)
    db.add(venta)
    db.commit()
    db.refresh(venta)
    total = 0
    for item in venta_data.detalles:
        producto = db.get(Producto, item.producto_id)
        if not producto:
            raise HTTPException(status_code=404, detail=f"Producto {item.producto_id} no existe")
        if producto.stock < item.cantidad:
            raise HTTPException(
                status_code=400,
                detail=f"No hay stock suficiente para {producto.nombre}"
            )
        subtotal = item.cantidad * producto.precio
        detalle = DetalleVenta(
            venta_id=venta.id,
            producto_id=producto.id,
            cantidad=item.cantidad,
            precio_unitario=producto.precio,
            subtotal=subtotal
        )
        db.add(detalle)
        producto.stock -= item.cantidad
        db.add(producto)
        total += subtotal
    venta.total = total
    db.add(venta)

    db.commit()
    db.refresh(venta)

    return {
        "id": venta.id,
        "cliente_id": venta.cliente_id,
        "cliente_nombre": cliente.nombre,
        "total": venta.total,
        "fecha": venta.fecha,
        "detalles": [
            {
                "producto_nombre": db.get(Producto, d.producto_id).nombre,
                "cantidad": d.cantidad,
                "precio_unitario": d.precio_unitario,
                "subtotal": d.subtotal
            }
            for d in db.query(DetalleVenta).filter(DetalleVenta.venta_id == venta.id).all()
        ]
    }

def obtener_ventas(db: Session):
    ventas = db.exec(select(Venta)).all()
    resultado = []
    for v in ventas:
        detalles = db.exec(
            select(DetalleVenta).where(DetalleVenta.venta_id == v.id)
        ).all()
        lista_detalles = []
        for d in detalles:
            producto = db.get(Producto, d.producto_id)
            lista_detalles.append({
                "producto_nombre": producto.nombre,
                "cantidad": d.cantidad,
                "precio_unitario": d.precio_unitario,
                "subtotal": d.subtotal
            })
        cliente = db.get(Cliente, v.cliente_id)
        resultado.append({
            "id": v.id,
            "cliente_id": v.cliente_id,
            "cliente_nombre": cliente.nombre,
            "total": v.total,
            "fecha": v.fecha,
            "detalles": lista_detalles
        })
    return resultado



def obtener_venta(db: Session, venta_id: int):
    return db.get(Venta, venta_id)


def eliminar_venta(db: Session, venta_id: int):
    venta = db.get(Venta, venta_id)
    if not venta:
        return None

    detalles = db.exec(
        select(DetalleVenta).where(DetalleVenta.venta_id == venta_id)
    ).all()

    for d in detalles:
        db.delete(d)

    db.delete(venta)
    db.commit()
    return True