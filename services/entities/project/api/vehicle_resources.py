from flask_restful import Resource, reqparse
from project.models.Vehicle import Vehicle, VehicleType
from project.api.general import create_error
from project.utils import try_convert
from typing import Any
from project import db


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


# Create parser for vehicles
parser = reqparse.RequestParser()
parser.add_argument('id', required=True, help="ID of the vehicle", type=int)
parser.add_argument('number', required=True, help="Number of the vehicle", type=int)
parser.add_argument('description', required=False, help="Description of the vehicle", type=str)
parser.add_argument('name', required=False, help="Name of the vehicle", type=str)
parser.add_argument('type', required=True, help="Type of the vehicle, do /vehicles/values to get possibilities",
                    type=vehicle_type)
parser.add_argument('created_by', required=True, help="Creator user id", type=int)


class AllVehicles(Resource):
    def get(self):
        data = Vehicle.query.all()
        return [v.serialize() for v in data], 200

    def post(self):
        try:
            args = parser.parse_args()
            vehicle = Vehicle(args.get('id'), args.get('number'), args.get('description'), args.get('type'),
                              args.get('created_by'), args.get('name'))
            db.session.add(vehicle)
            db.session.commit()
            return vehicle.serialize(), 201
        except Exception as e:
            create_error(500, "Unable to create vehicle with specified arguments", extra=e.__str__())


class VehicleById(Resource):
    def get(self, v_id):
        try:
            v_id = int(v_id)
        except Exception as e:
            create_error(500, "Cannot convert id '{}' to integer".format(v_id), extra=e.__str__())

        vehicle = Vehicle.query.filter_by(id=v_id).first()
        if vehicle is None:
            create_error(404, "Vehicle with id {} does not exist".format(v_id))
        return vehicle.serialize(), 200
