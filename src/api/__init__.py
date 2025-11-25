from flask import Flask
from flask_migrate import Migrate

from api.models import db
from api.routes import api_bp
from api.commands import setup_commands
from api.routes import api_bp

migrate = Migrate()


def create_app(config_object="api.config.DevelopmentConfig") -> Flask:
    app = Flask(__name__)
    app.config.from_object(config_object)

    db.init_app(app)
    migrate.init_app(app, db)

    app.register_blueprint(api_bp, url_prefix="/api")
    setup_admin(app)
    setup_commands(app)

    return app

from api.models import Trainer, Pokemon, Type 
