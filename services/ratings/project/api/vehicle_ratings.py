from flask_restful import Resource, reqparse
from project import db
from sqlalchemy import func
from project.utils import create_error, try_convert
from project.models.VehicleRating import VehicleType, VehicleRating


parser = reqparse.RequestParser()
parser.add_argument('entity_id', required=True, type=int, help="ID of the vehicle")
parser.add_argument('created_by', required=True, type=int, help="User ID of the creator")
parser.add_argument('rating', required=True, type=float, help="Score the user gave the vehicle")


class RateVehicle(Resource):
    def post(self):
        try:
            args = parser.parse_args()
            rating = args['rating']
            v_id = args['entity_id']
            creator = args['created_by']

            old_rating = VehicleRating.query.filter_by(vehicle_id=v_id, created_by=creator).first()
            if old_rating:
                old_rating.rating = rating
                db.session.commit()
                return old_rating.serialize(), 201

            rating = VehicleRating(rating, v_id, creator)
            if rating is None:
                return create_error(500, "Cannot create vehicle rating"), 500
            db.session.add(rating)
            db.session.commit()
            return rating.serialize(), 201
        except Exception as e:
            print("exception occurred", e)
            return create_error(500, "cannot create rating for vehicle", extra=e.__str__()), 500


class RatingByVehicleID(Resource):
    def get(self, v_id):
        v_id = try_convert(v_id)
        if type(v_id) is not int:
            return create_error(500, "Cannot convert id '{}' to integer".format(v_id)), 500
        ratings = VehicleRating.query.filter_by(vehicle_id=v_id).all()
        return [r.serialize() for r in ratings], 200


class VehicleRatingByCreator(Resource):
    def get(self, c_id):
        c_id = try_convert(c_id)
        if type(c_id) is not int:
            return create_error(500, "Cannot convert id '{}' to integer".format(c_id)), 500
        ratings = VehicleRating.query.filter_by(created_by=c_id).all()
        return [r.serialize() for r in ratings]


class VehicleAverage(Resource):
    def get(self, v_id):
        v_id = try_convert(v_id)
        if type(v_id) is not int:
            return create_error(500, "Cannot convert id '{}' to integer".format(v_id)), 500
        average = db.session.query(func.avg(VehicleRating.rating)).filter_by(vehicle_id=v_id).scalar()
        if not average:
            return "No ratings yet"
        return float(average), 200
