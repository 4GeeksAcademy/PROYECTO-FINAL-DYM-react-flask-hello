from flask import g

from api.models import Trainer


def set_current_trainer(trainer: Trainer) -> None: 
    g.current_trainer = trainer


def clear_current_trainer() -> None:
    if hasattr(g, "current_trainer"):
        del g.current_trainer

def current_trainer() -> Trainer: 
    return g.current_trainer

