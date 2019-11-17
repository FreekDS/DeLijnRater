from flask import Blueprint
from flask_restful import Api
from project.api.resources import Login, Register

api_blueprint = Blueprint('api', __name__)
api = Api(api_blueprint)

api.add_resource(Login, '/login')
api.add_resource(Register, '/register')