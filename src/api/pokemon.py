from decimal import Decimal

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Integer, Numeric
from sqlalchemy.orm import Mapped, mapped_column

db = SQLAlchemy()


class Pokemon(db.Model):
    __tablename__ = "pokemon"

    id_pk: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    pokedex_number: Mapped[int] = mapped_column(
        Integer, nullable=False, unique=True)
    heigth: Mapped[Decimal | None] = mapped_column(Numeric(4, 1))
    weight: Mapped[Decimal | None] = mapped_column(Numeric(5, 1))

    def serialize(self):
        return {
            "id_pk": self.id_pk,
            "name": self.name,
            "pokedex_number": self.pokedex_number,
            "height": float(self.height) if self.heigth is not None else None,
            "weight": float(self.weight) if self.weight is not None else None,
            "sprite_url": self.sprite_url,
        }
