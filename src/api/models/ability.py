from __future__ import annotations
from datetime import datetime

from sqlalchemy import DateTime, Integer, String, Text, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship

from . import db

pokemon_ability = db.Table(
    "pokemon_ability",
    db.Column("pokemon_id", db.ForeignKey("pokemon.id_pk"), primary_key=True),
    db.Column("ability_id", db.ForeignKey("ability.id"), primary_key=True),
)

class Ability(db.Model):
    __tablename__ = "ability"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(80), unique=True, nullable=False)
    short_effect: Mapped[str | None] = mapped_column(String(225), nullable=True)
    effect: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_hidden_default: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=False),
        default=datetime.utcnow,
        nullable=False,
    )

    pokemon: Mapped[list["Pokemon"]] = relationship(
        "Pokemon",
        secondary=pokemon_ability,
        back_populates="abilities",
        lazy="selectin",
    )

    def __repr__(self) -> str:
        return f"<Ability id={self.id} name='{self.name}'>"
    
    def serialize(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "short_effect": self.short_effect,
            "effect": self.effect,
            "is_hidden_default": self.is_hidden_default,
        }
