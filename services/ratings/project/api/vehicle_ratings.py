from flask_restful import Resource, reqparse
from project import db
from project.utils import create_error, try_convert
from project.models.VehicleRating import VehicleType, VehicleRating
from typing import Any


def vehicle_type(value: Any) -> VehicleType:
    """
    Tries to convert the value to a VehicleType
    :param value:
    :return:
    """
    vehicle = try_convert(value)
    if type(vehicle) is int:
        vehicle = VehicleType(vehicle)
    else:
        vehicle = VehicleType[vehicle]
    if vehicle is None:
        raise ValueError("Cannot convert '{}' to vehicle type".format(value))
    return vehicle


parser = reqparse.RequestParser()
parser.add_argument('vehicle_type', required=True, type=vehicle_type, help="Type of the vehicle")
parser.add_argument('vehicle_id', required=True, type=int, help="ID of the vehicle")
parser.add_argument('created_by', required=True, type=int, help="User ID of the creator")
parser.add_argument('rating', required=True, type=float, help="Score the user gave the vehicle")


class RateVehicle(Resource):
    def post(self):
        try:
            args = parser.parse_args()
            rating = args['rating']
            v_type = args['vehicle_type']
            v_id = args['vehicle_id']
            creator = args['created_by']
            rating = VehicleRating(rating, VehicleType(v_type), v_id, creator)
            if rating is None:
                create_error(500, "Cannot create vehicle rating")
            db.session.add(rating)
            return rating.serialize(), 201
        except Exception as e:
            create_error(500, "cannot create rating for vehicle", extra=e.__str__())


class RatingByVehicleID(Resource):
    def get(self, v_id):
        v_id = try_convert(v_id)
        if type(v_id) is not int:
            create_error(500, "Cannot convert id '{}' to integer".format(v_id))
        ratings = VehicleRating.query.filter_by(id=v_id).all()
        return [r.serialize() for r in ratings], 200


class VehicleRatingByCreator(Resource):
    def get(self, c_id):
        c_id = try_convert(c_id)
        if type(c_id) is not int:
            create_error(500, "Cannot convert id '{}' to integer".format(c_id))
        ratings = VehicleRating.query.filter_by(created_by=c_id).all()
        return [r.serialize() for r in ratings]
