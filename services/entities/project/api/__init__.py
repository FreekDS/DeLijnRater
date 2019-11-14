from flask import Blueprint
from flask_restful import Api

api_blueprint = Blueprint('api', __name__)
api = Api(api_blueprint)

from project.api.stop_resources import Hello
api.add_resource(Hello, '/test')