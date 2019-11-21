from flask_restful import Resource, reqparse
from flask_restful.utils import cors
from project import db
from project.models.User import User

from project.utils import create_error

login_parser = reqparse.RequestParser()
login_parser.add_argument('username', required=True, help="Username of the user")
login_parser.add_argument('password', required=True, help="Password of the user")

register_parser = login_parser.copy()
register_parser.add_argument('email', required=True, help="Email address of the user")


class Login(Resource):
    def post(self):
        try:
            args = login_parser.parse_args()
            password = args["password"]
            username = args["username"]
            logged_user = User.query.filter_by(name=username).first()
            if logged_user is None:
                return create_error(403, "User with username '{}' does not exist".format(username)), 403
            if logged_user.password != password:
                return create_error(403, "Password is incorrect"), 403
            return {
                       'status': 'success',
                       'user': logged_user.serialize()
                   }, 200
        except Exception as e:
            return create_error(500, "Cannot sign in", extra=e.__str__()), 500


class UserByID(Resource):
    def get(self, u_id):
        try:
            u_id = int(u_id)
        except Exception as e:
            return create_error(500, "Cannot convert id '{}' to integer".format(u_id))
        user = User.query.filter_by(u_id=u_id).first()
        if user is None:
            return None, 404
        return user.serialize(), 200


class Register(Resource):
    def post(self):
        try:
            args = register_parser.parse_args()
            password = args["password"]
            username = args["username"]
            email = args["email"]
            user = User(username, password, email)
            db.session.add(user)
            db.session.commit()
            return user.serialize(), 201
        except Exception as e:
            return create_error(500, "Cannot register", extra=e.__str__()), 500
