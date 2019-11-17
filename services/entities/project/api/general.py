from flask_restful import Resource
from project.models.Vehicle import VehicleType
from project.models.Stop import Region
from flask_restful import abort


class VehicleEnum(Resource):
    def get(self):
        return VehicleType.get_key_value(), 200


class RegionEnum(Resource):
    def get(self):
        return Region.get_key_value(), 200

