from flask_restful import Resource, reqparse
from project.models.Vehicle import Vehicle, VehicleType
from project.utils import try_convert, create_error
from typing import Any
from project import db


def vehicle_type(value: Any) -> VehicleType:
    """
    Tries to convert the value to a VehicleType
    :param value: value to convert
    :return: VehicleType object
    """
    import click
    click.echo("Trying to convert this shit" + value)
    vehicle = try_convert(value)
    if type(vehicle) is int:
        vehicle = VehicleType(vehicle)
    else:
        vehicle = VehicleType[vehicle.upper()]
    if vehicle is None:
        click.echo("Hmm, it is none")
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
    """Get all vehicles of the database or post a new vehicle"""
    def get(self):
        """
        Gets all vehicles of the database
        :return list of json objects
        """
        data = Vehicle.query.all()
        return [v.serialize() for v in data], 200

    def post(self):
        """
        Add a new vehicle to the database
        :return: the created vehicle
        """
        try:
            args = parser.parse_args()
            vehicle = Vehicle(args.get('id'), args.get('number'), args.get('description'), args.get('type'),
                              args.get('created_by'), args.get('name'))
            db.session.add(vehicle)
            db.session.commit()
            return vehicle.serialize(), 201
        except Exception as e:
            return create_error(500, "Unable to create vehicle with specified arguments", extra=e.__str__()), 500


class VehicleById(Resource):
    """Get or delete the vehicle with specified id"""
    def get(self, v_id):
        """
        Get the vehicle with the specified id
        :param v_id: id of the vehicle to search for
        :return: vehicle object with specified id
        """
        try:
            v_id = int(v_id)
        except Exception as e:
            return create_error(500, "Cannot convert id '{}' to integer".format(v_id), extra=e.__str__()), 500

        vehicle = Vehicle.query.filter_by(id=v_id).first()
        if vehicle is None:
            return create_error(404, "Vehicle with id {} does not exist".format(v_id)), 404
        return vehicle.serialize(), 200

    def delete(self, v_id):
        """
        Delete a vehicle with the specified id
        :param v_id: id of the vehicle
        :return: "success" if vehicle is deleted
        """
        try:
            v_id = int(v_id)
        except Exception as e:
            return create_error(500, "Cannot convert id '{}' to integer".format(v_id), extra=e.__str__()), 500

        vehicle = Vehicle.query.filter_by(id=v_id).first()

        if vehicle is None:
            return create_error(404, "vehicle with id '{}' not found".format(v_id)), 404

        db.session.delete(vehicle)
        db.session.commit()
        return "success", 200


class VehicleByCreator(Resource):
    """Get the vehicle based on the ID of the creator"""
    def get(self, c_id):
        """
        Gets the vehicles based on the creator ID
        :param c_id: Id of the creator
        :return: list of vehicles created by the given creator
        """
        try:
            c_id = int(c_id)
        except Exception as e:
            return create_error(500, "Cannot convert id '{}' to integer".format(c_id), extra=e.__str__()), 500

        vehicles = Vehicle.query.filter_by(created_by=c_id).all()
        return [v.serialize() for v in vehicles]