from flask import Blueprint
from flask_restful import Api
from flask_restful.utils import cors
from project.api.resources import Login, Register, GetTest

api_blueprint = Blueprint('api', __name__)
api = Api(api_blueprint)


api.add_resource(Login, '/login')
api.add_resource(Register, '/register')
api.add_resource(GetTest, '/test/<username>')