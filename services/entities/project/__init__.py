from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os

db = SQLAlchemy()


def create_app(script_info=None):
    app = Flask(__name__)
    CORS(app)

    app_settings = os.getenv('APP_SETTINGS')
    app.config.from_object(app_settings)

    from project.api import api_blueprint
    app.register_blueprint(api_blueprint)

    with app.app_context():
        from project.models.Vehicle import Vehicle
        from project.models.Stop import Stop
        db.init_app(app)
        db.create_all()

    @app.shell_context_processor
    def ctx():
        return {'app': app, 'db': db}

    return app
