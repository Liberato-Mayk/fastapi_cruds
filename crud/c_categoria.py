from sqlmodel import Session, select
from models.m_categoria import Categoria


def crear_categoria(db: Session, categoria_data):
    categoria = Categoria(**categoria_data.dict())
    db.add(categoria)
    db.commit()
    db.refresh(categoria)
    return categoria


def obtener_categorias(db: Session):
    return db.exec(select(Categoria)).all()


def obtener_categoria(db: Session, categoria_id: int):
    return db.get(Categoria, categoria_id)


def actualizar_categoria(db: Session, categoria_id: int, datos):
    categoria = db.get(Categoria, categoria_id)
    if not categoria:
        return None

    for key, value in datos.dict(exclude_unset=True).items():
        setattr(categoria, key, value)

    db.commit()
    db.refresh(categoria)
    return categoria


def eliminar_categoria(db: Session, categoria_id: int):
    categoria = db.get(Categoria, categoria_id)
    if not categoria:
        return None

    db.delete(categoria)
    db.commit()
    return categoria