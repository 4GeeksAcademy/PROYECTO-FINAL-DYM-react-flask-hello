from __future__ import annotations

from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import String, Integer, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship

from . import db
from .ability import pokemon_ability
from .move import pokemon_move
from .type import pokemon_type


class Pokemon(db.Model):
    __tablename__ = "pokemon"

    id_pk: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    pokedex_number: Mapped[int] = mapped_column(
        Integer, nullable=False, unique=True)
    height: Mapped[Decimal | None] = mapped_column(
        Numeric(4, 1), nullable=True)
    weight: Mapped[Decimal | None] = mapped_column(
        Numeric(5, 1), nullable=True)

    types: Mapped[list["Type"]] = relationship(
        "Type",
        secondary=pokemon_type,
        back_populates="pokemon",
        lazy="selectin",
    )

    abilities: Mapped[list["Ability"]] = relationship(
        "Ability",
        secondary=pokemon_ability,
        back_populates="pokemon",
        lazy="selectin",
    )

    moves: Mapped[list["Move"]] = relationship(
        "Move",
        secondary=pokemon_move,
        back_populates="pokemon",
        lazy="selectin",
    )

    favorited_by: Mapped[list["Favorite"]] = relationship(
        "Favorite",
        back_populates="pokemon",
        cascade="all, delete-orphan",
        lazy="selectin"
    )

    def __repr__(self) -> str:
        return f"<Pokemon id={self.id_pk} name='{self.name}'>"

    def serialize(self) -> dict:
        return {
            "id_pk": self.id_pk,
            "name": self.name,
            "pokedex_number": self.pokedex_number,
            "height": float(self.height) if self.height is not None else None,
            "weight": float(self.weight) if self.weight is not None else None,
            "types": [t.serialize() for t in self.types],
        }


if TYPE_CHECKING:
    from .ability import Ability
    from .favorite import Favorite
    from .move import Move
    from .type import Type
