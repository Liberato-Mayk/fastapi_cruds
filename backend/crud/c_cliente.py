from sqlmodel import Session, select
from backend.models.m_clientes import Cliente


def crear_cliente(db: Session, cliente_data):
    cliente = Cliente(**cliente_data.dict())
    db.add(cliente)
    db.commit()
    db.refresh(cliente)
    return cliente


def obtener_clientes(db: Session):
    return db.exec(select(Cliente)).all()


def obtener_cliente(db: Session, cliente_id: int):
    return db.get(Cliente, cliente_id)


def actualizar_cliente(db: Session, cliente_id: int, datos):
    cliente = db.get(Cliente, cliente_id)
    if not cliente:
        return None

    for key, value in datos.dict(exclude_unset=True).items():
        setattr(cliente, key, value)

    db.commit()
    db.refresh(cliente)
    return cliente


def eliminar_cliente(db: Session, cliente_id: int):
    cliente = db.get(Cliente, cliente_id)
    if not cliente:
        return None

    db.delete(cliente)
    db.commit()
    return cliente