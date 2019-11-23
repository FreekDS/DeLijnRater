from flask_restful import Resource
from project.models.Vehicle import VehicleType
from project.models.Stop import Region
from flask_restful import abort


class VehicleEnum(Resource):
    """
    All possible values for a vehicle
    """
    def get(self):
        """
        Get all possible values for a vehicle
        :return: dict containing all possible values for a vehicle
        """
        return VehicleType.get_key_value(), 200


class RegionEnum(Resource):
    """
    All possible values for a region
    """
    def get(self):
        """
        Get all possible values for a region
        :return: dict containing all possible values
        """
        return Region.get_key_value(), 200

