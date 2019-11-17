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


def create_error(status, message, extra=None):
    status_dict = {
        404: "Not Found",
        500: "Internal server error",
        400: "Bad request",
        403: "Forbidden",
        408: "Request timeout",
        418: "I'm a teapot"
    }
    if status == 418:
        message = "Server refuses the attempt to brew coffee with a teapot"
    if extra:
        abort(status, message=status_dict[status], error=message, additional_info=extra)
    else:
        abort(status, message=status_dict[status], error=message)