from flask_restful import Resource
from project.models.Vehicle import Vehicle
from project.api.general import create_error


class AllVehicles(Resource):
    def get(self):
        data = Vehicle.query.all()
        return [v.serialize() for v in data], 200


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
