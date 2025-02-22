from flask_restful import Resource, reqparse
from sqlalchemy import func
from project import db
from project.utils import create_error, try_convert
from project.models.StopRating import StopRating

# Create parser for post requests
parser = reqparse.RequestParser()
parser.add_argument('entity_id', required=True, type=int, help="ID of the stop in the persistence database")
parser.add_argument('created_by', required=True, type=int, help="User ID of the creator")
parser.add_argument('rating', required=True, type=float, help="Score the user gave the stop")


class RateStop(Resource):
    """Rate a stop"""
    def post(self):
        """
        Create new rating for a stop. Uses the request parser specified above
        :return: created rating
        """
        try:
            args = parser.parse_args()
            rating = args['rating']
            s_id = args['entity_id']
            creator = args['created_by']

            old_rating = StopRating.query.filter_by(stop_id=s_id, created_by=creator).first()
            if old_rating:
                old_rating.rating = rating
                db.session.commit()
                return old_rating.serialize(), 201

            rating = StopRating(rating, s_id, creator)
            if rating is None:
                return create_error(500, "Cannot create stop rating"), 500
            db.session.add(rating)
            db.session.commit()
            return rating.serialize(), 201
        except Exception as e:
            return create_error(500, "cannot create rating for stop", extra=e.__str__()), 500


class RatingByStopID(Resource):
    """Gets the ratings of a stop"""
    def get(self, s_id):
        """
        Get the ratings of the stop with a given id
        :param s_id: id of the stop
        :return: list of ratings
        """
        s_id = try_convert(s_id)
        if type(s_id) is not int:
            return create_error(500, "Cannot convert id '{}' to integer".format(s_id)), 500
        ratings = StopRating.query.filter_by(stop_id=s_id).all()
        return [r.serialize() for r in ratings], 200


class StopRatingByCreator(Resource):
    """Gets ratings created by a creator"""
    def get(self, c_id):
        """
        Gets all ratings created by a particular creator
        :param c_id: ID of the creator
        :return: list of ratings of the creator
        """
        c_id = try_convert(c_id)
        if type(c_id) is not int:
            return create_error(500, "Cannot convert id '{}' to integer".format(c_id)), 500
        ratings = StopRating.query.filter_by(created_by=c_id).all()
        return [r.serialize() for r in ratings]


class StopAverage(Resource):
    """Calculate the average rating for a stop"""
    def get(self, s_id):
        """
        Gets the average rating for a stop
        :param s_id: id of the stop
        :return: "No ratings yet" if there are no ratings, else it returns the average of the ratings
        """
        s_id = try_convert(s_id)
        if type(s_id) is not int:
            return create_error(500, "Cannot convert id '{}' to integer".format(s_id)), 500
        average = db.session.query(func.avg(StopRating.rating)).filter_by(stop_id=s_id).scalar()
        if not average:
            return "No ratings yet"
        return float(average), 200
