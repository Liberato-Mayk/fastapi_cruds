from sqlmodel import Session, select
from backend.models.m_productos import Producto
from backend.models.m_categoria import Categoria
from backend.schemas.s_producto import ProductoRead

def crear_producto(db: Session, producto_data):
    producto = Producto(**producto_data.model_dump())
    db.add(producto)
    db.commit()
    db.refresh(producto)

    categoria = db.get(Categoria, producto.categoria_id)

    return ProductoRead(
        id=producto.id,
        nombre=producto.nombre,
        categoria_nombre=categoria.nombre,
        stock=producto.stock,
        precio=producto.precio,
        fecha_creacion=producto.fecha_creacion
    )


def obtener_productos(db: Session):
    productos = db.query(Producto).all()
    resultado = []

    for producto in productos:
        categoria = db.get(Categoria, producto.categoria_id)

        resultado.append(
            ProductoRead(
                id=producto.id,
                nombre=producto.nombre,
                categoria_nombre=categoria.nombre,
                stock=producto.stock,
                precio=producto.precio,
                fecha_creacion=producto.fecha_creacion
            )
        )

    return resultado


def obtener_producto(db: Session, producto_id: int):
    producto = db.get(Producto, producto_id)

    if not producto:
        return None

    categoria = db.get(Categoria, producto.categoria_id)

    return ProductoRead(
        id=producto.id,
        nombre=producto.nombre,
        categoria_nombre=categoria.nombre,
        stock=producto.stock,
        precio=producto.precio,
        fecha_creacion=producto.fecha_creacion
    )


def actualizar_producto(db: Session, producto_id: int, datos):

    producto = db.get(Producto, producto_id)

    if not producto:
        return None

    datos_actualizados = datos.model_dump(exclude_unset=True)

    for campo, valor in datos_actualizados.items():
        setattr(producto, campo, valor)

    db.add(producto)
    db.commit()
    db.refresh(producto)

    categoria = db.get(Categoria, producto.categoria_id)

    return ProductoRead(
        id=producto.id,
        nombre=producto.nombre,
        categoria_nombre=categoria.nombre,
        stock=producto.stock,
        precio=producto.precio,
        fecha_creacion=producto.fecha_creacion
    )


def eliminar_producto(db: Session, producto_id: int):
    producto = db.get(Producto, producto_id)
    if not producto:
        return None

    db.delete(producto)
    db.commit()
    return producto