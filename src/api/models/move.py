from __future__ import annotations

from datetime import datetime

from sqlalchemy import CheckConstraint, DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from . import db


pokemon_move = db.Table(
    "pokemon_move",
    db.Column("pokemon_id", db.ForeignKey("pokemon.id_pk"), primary_key=True),
    db.Column("move_id", db.ForeignKey("move.id"), primary_key=True)
)

class Move(db.Model):
    __tablename__ = "move"
    __table_args__ = (
        CheckConstraint("power >=0 OR power IS NULL", name="ck_move_power_non_negative"),
        CheckConstraint("accuracy BETWEEN 0 ADN 100 OR accuracy IS NULL", name="ck_move_accuracy_range"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(80), unique=True, nullable=False)
    type_id: Mapped[int | None]  = mapped_column(db.ForeignKey(type.id), nullable=True, index=True)
    damage_class: Mapped[str | None] = mapped_column(String(20), nullable=True)
    power: Mapped[int | None] = mapped_column(Integer, nullable=True)
    accuracy: Mapped[int | None] = mapped_column(Integer, nullable=True)
    pp: Mapped[int | None] = mapped_column(Integer, nullable=True)
    priority: Mapped[int | None] = mapped_column(Integer, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=False), default=datetime.utcnow, nullable=False)

    type: Mapped["Type"] = relationship("Type", back_populates="moves", lazy="selectin")
    pokemon: Mapped[ist["Pokemon"]] = relationship(
        "Pokemon",
        secondary=pokemon_move,
        back_populates="moves",
        lazy="selectin",
    )

    def __repr__(self) -> str:
        return f"<Move id={self.id} name='{self.name}'>"
    
    def serialize(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "damage_class": self.damage_class,
            "power": self.power,
            "accuracy": self.accuracy,
            "pp": self.pp,
            "priority": self.priority,
            "type": self.type.name if self.type else None,
        }



    from typing import TYPE_CHECKING

    if TYPE_CHECKING:
        from .pokemon import Pokemon
        from .type import Type