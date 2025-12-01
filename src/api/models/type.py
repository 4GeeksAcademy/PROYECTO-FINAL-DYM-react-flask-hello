from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from . import db


pokemon_type = db.Table(
    "pokemon_type",
    db.Column("pokemon_id", db.ForeignKey("pokemon.id_pk"), primary_key=True),
    db.Column("type_id", db.ForeignKey("type.id"), primary_key=True)
)


class Type(db.Model):
    __tablename__ = "type"
    __table_args__ = (UniqueConstraint("name", name="uq_type_name"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    introduced_in_generation: Mapped[int | None] = mapped_column(Integer, nullable=True)

    pokemon: Mapped[list["Pokemon"]] = relationship(
        "Pokemon",
        secondary=pokemon_type,
        back_populates="types",
        lazy="selectin"
    )

    moves: Mapped[list["Move"]] = relationship(
        "Move", 
        back_populates="type", 
        lazy="selectin"
        )


def __repr__(self) -> str:
    return f"<Type id={self.id} name='{self.name}'>"


def serialize(self) -> dict:
    return {
        "id": self.id,
        "name": self.name,
        "introduced_in_generation": self.introduced_in_generation,
    }



if TYPE_CHECKING:
    from .move import Move
    from .pokemon import Pokemon