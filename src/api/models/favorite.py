from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from . import db


class Favorite(db.Model):
    __tablename__ = "favorite"
    __table_args__ = UniqueConstraint(
        "trainer_id", "pokemon_id", name="uq_favorite_trainer_pokemon")

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    trainer_id: Mapped[int] = mapped_column(
        db.ForeignKey("trainer.id"), nullable=False, index=True)
    pokemon_id: Mapped[int] = mapped_column(
        db.ForeignKey("pokemon.id_pk"), nullable=False, index=True)
    nickname: Mapped[str | None] = mapped_column(String(60), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=False), default=datetime.utcnow, nullable=False)

    trainer: Mapped["Trainer"] = relationship(
        "Trainer", back_populates="favorites", lazy="joined")
    pokemon: Mapped["Pokemon"] = relationship(
        "Pokemon", back_populates="favorited_by", lazy="joined")

    def __repr__(self) -> dict:
        return f"<Favorite id={self.id} trainer_id={self.trainer_id} pokemon_id={self.pokemon_id}>"

    def serialize(self) -> dict:
        return {
            "id": self.id,
            "trainer_id": self.trainer_id,
            "pokemon_id": self.pokemon_id,
            "nickname": self.nickname,
            "created_at": self.created_at.isoformat(),
            "pokemon":
            {
                "id_pk": self.pokemon.id_pk,
                "name": self.pokemon.name,
                "pokedex_number": self.pokemon.pokedex_number,
            },
        }


if TYPE_CHECKING:
    from .pokemon import Pokemon
    from .trainer import Trainer
