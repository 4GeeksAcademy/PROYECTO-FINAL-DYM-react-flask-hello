from .favorite import Favorite
from .move import Move, pokemon_move
from .ability import Ability, pokemon_ability
from .type import Type
from .pokemon import Pokemon
from .trainer import Trainer
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


__all__ = ["db", "Trainer", "Pokemon", "Move", "pokemon_move",
           "Type", "Ability", "pokemon_ability", "Favorite"]
