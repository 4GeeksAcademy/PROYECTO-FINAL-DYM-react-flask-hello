from flask import Flask
from flask_migrate import Migrate

from flask_cors import CORS

from api.models import db
from api.routes import api_bp
from api.admin import setup_admin

from api.commands import setup_commands


migrate = Migrate()


def create_app(config_object="api.config.DevelopmentConfig") -> Flask:
    app = Flask(__name__)
    app.config.from_object(config_object)

    db.init_app(app)
    migrate.init_app(app, db)

    setup_admin(app)
    setup_commands(app)

    CORS(app)

    app.register_blueprint(api_bp, url_prefix="/api")
    
    return app

from api.models import Trainer, Pokemon, Type 
