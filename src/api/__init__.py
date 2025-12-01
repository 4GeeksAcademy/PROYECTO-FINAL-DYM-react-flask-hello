from flask import Flask
from flask_migrate import Migrate

from api.admin import setup_admin
from api.commands import setup_commands
from api.models import db
from api.routes import (
    api_bp,
    auth,
    favorites,
    pokemon,
)


migrate = Migrate()


def create_app(config_object="api.config.DevelopmentConfig") -> Flask:
    app = Flask(__name__)
    app.config.from_object(config_object)

    db.init_app(app)
    migrate.init_app(app, db)

    setup_admin(app)
    setup_commands(app)

    app.register_blueprint(api_bp, url_prefix="/api")
    app.register_blueprint(auth.bp, url_prefix="/api")
    app.register_blueprint(favorites.bp, url_prefix="/api")
    app.register_blueprint(pokemon.bp, url_prefix="/api")
    
    return app

from api.models import Trainer, Pokemon, Type 
