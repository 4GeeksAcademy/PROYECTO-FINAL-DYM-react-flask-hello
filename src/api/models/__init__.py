from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from .favorite import Favorite
from .move import Move, pokemon_move
from .ability import Ability, pokemon_ability
from .type import Type, pokemon_type
from .pokemon import Pokemon
from .trainer import Trainer


__all__ = [
    "db",
    "Favorite",
    "Move", 
    "pokemon_move",
    "Ability", 
    "pokemon_ability",
    "Type",
    "pokemon_type",
    "Pokemon",
    "Trainer",
    ]
