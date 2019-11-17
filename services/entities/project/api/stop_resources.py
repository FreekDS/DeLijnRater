from flask_restful import Resource, reqparse
from flask import jsonify

from project.api.general import create_error
from project.models.Stop import Stop, Region
from project.utils import try_convert


def region_type(value):
    region = try_convert(value)
    if type(region) is int:
        region = Region(region)
    else:
        region = Region[region]
    if region is None:
        raise ValueError("Cannot convert '{}' to region".format(value))
    return region


stop_arg_parser = reqparse.RequestParser()
stop_arg_parser.add_argument('region', type=region_type,
                             help='region of the stop. Make call to /regions/values for possible values', required=True)
stop_arg_parser.add_argument('name', type=str, help='Name of the stop', required=True)
stop_arg_parser.add_argument('number', type=int, help='Number of the stop', required=True)
stop_arg_parser.add_argument('village', type=str, help='Village of the stop', required=False)


class AllStops(Resource):
    def get(self):
        data = Stop.query.all()
        return jsonify(d=[o.serialize() for o in data])


class StopById(Resource):
    def get(self, s_id):
        try:
            s_id = int(s_id)
        except Exception as e:
            create_error(500, "Cannot convert id '{}' to integer".format(s_id), extra=e.__str__())
        stop = Stop.query.filter_by(id=s_id).first()
        if stop is None:
            create_error(404, "Stop with id {} does not exist".format(s_id))
        return stop.serialize(), 200


class StopsByRegion(Resource):
    def get(self, region):
        region = try_convert(region)
        if type(region) is int:
            try:
                region = Region(region)
                if region is None:
                    raise ValueError("Cannot convert int to Region")
            except Exception as e:
                create_error(500, "Region {} does not exist. For possible values make http request to /regions/values"
                             .format(region), extra=e.__str__())
        else:
            try:
                region = Region[region.upper()]
                if region is None:
                    raise ValueError("Cannot convert string to Region")
            except Exception as e:
                create_error(500, "Region {} does not exist. For possible values, make http request to /regions/values"
                             .format(region), extra=e.__str__())

        stops = Stop.query.filter_by(region=region).all()
        return [s.serialize() for s in stops], 200
