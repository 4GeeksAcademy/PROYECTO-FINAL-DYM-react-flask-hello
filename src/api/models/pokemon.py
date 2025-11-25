from decimal import Decimal

from sqlalchemy import String, Integer, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship

from . import db
from .type import pokemon_type


class Pokemon(db.Model):
    __tablename__ = "pokemon"

    id_pk: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    pokedex_number: Mapped[int] = mapped_column(
        Integer, nullable=False, unique=True)
    heigth: Mapped[Decimal | None] = mapped_column(Numeric(4, 1))
    weight: Mapped[Decimal | None] = mapped_column(Numeric(5, 1))

    types: Mapped[list["Type"]] = relationship(
        "Type",
        secondary=pokemon_type,
        back_populates="pokemon",
    )

    def __repr__(self) -> str:
        return f"<Pokemon id={self.id_pk} name='{self.name}'>"

    def serialize(self) -> dict:
        return {
            "id_pk": self.id_pk,
            "name": self.name,
            "pokedex_number": self.pokedex_number,
            "height": float(self.height) if self.heigth is not None else None,
            "weight": float(self.weight) if self.weight is not None else None,
            "types": [t.serialize() for t in self.types],
        }
