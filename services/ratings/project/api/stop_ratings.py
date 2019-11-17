from flask_restful import Resource, reqparse
from project import db
from project.utils import create_error, try_convert
from project.models.StopRating import StopRating

parser = reqparse.RequestParser()
parser.add_argument('stop_id', required=True, type=int, help="ID of the stop in the persistence database")
parser.add_argument('created_by', required=True, type=int, help="User ID of the creator")
parser.add_argument('rating', required=True, type=float, help="Score the user gave the stop")


class RateStop(Resource):
    def post(self):
        try:
            args = parser.parse_args()
            rating = args['rating']
            s_id = args['stop_id']
            creator = args['created_by']
            rating = StopRating(rating, s_id, creator)
            if rating is None:
                create_error(500, "Cannot create stop rating")
            db.session.add(rating)
            return rating.serialize(), 201
        except Exception as e:
            create_error(500, "cannot create rating for stop", extra=e.__str__())


class RatingByStopID(Resource):
    def get(self, s_id):
        s_id = try_convert(s_id)
        if type(s_id) is not int:
            create_error(500, "Cannot convert id '{}' to integer".format(s_id))
        ratings = StopRating.query.filter_by(id=s_id).all()
        return [r.serialize() for r in ratings], 200


class StopRatingByCreator(Resource):
    def get(self, c_id):
        c_id = try_convert(c_id)
        if type(c_id) is not int:
            create_error(500, "Cannot convert id '{}' to integer".format(c_id))
        ratings = StopRating.query.filter_by(created_by=c_id).all()
        return [r.serialize() for r in ratings]
