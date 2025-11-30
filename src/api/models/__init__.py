from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from .trainer import Trainer
from .pokemon import Pokemon
from .type import Type
from .ability import Ability, pokemon_ability
from .move import Move, pokemon_move


__all__ = ["db", "Trainer", "Pokemon", "Type", "Ability"]


