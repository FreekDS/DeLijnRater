from flask_restful import Resource
# from project.models.Stop import Stop


class Hello(Resource):
    def get(self):
        return {"message": "Hello world!"}
