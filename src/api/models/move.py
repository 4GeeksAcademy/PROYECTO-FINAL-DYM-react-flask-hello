from __future__ import annotations

from datetime import datetime

from sqlalchemy import CheckConstraint, DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from . import db


pokemon_move = db.Table(
    "pokemon_move",
    db.Column("pokemon_id",  ))
)