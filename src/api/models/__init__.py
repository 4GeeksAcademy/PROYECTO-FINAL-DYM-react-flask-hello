from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from .trainer import Trainer
from .pokemon import Pokemon
from .type import Type


__all__ = ["db", "Trainer", "Pokemon", "Type"]

