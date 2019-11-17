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

    with app.app_context():
        from project.models.User import User
        db.init_app(app)
        db.create_all()
        db.session.commit()

    @app.shell_context_processor
    def ctx():
        return {'app': app, 'db': db}

    return app