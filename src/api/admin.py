import os
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from flask_admin.theme import Bootstrap4Theme

from .models import (
    Ability,
    Favorite,
    Move,
    Pokemon,
    Trainer,
    Type,
    db,
)


def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    admin = Admin(app, name='4Geeks Admin',
                  theme=Bootstrap4Theme(swatch='cerulean'))

    models = [Trainer, Pokemon, Type, Ability, Move, Favorite]
    for model in models:
        admin.add_view(ModelView(model, db.session))
