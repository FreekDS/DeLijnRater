from flask_restful import Resource, reqparse
from flask import jsonify

from project.models.Stop import Stop, Region
from project.utils import try_convert, create_error


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
        return jsonify([o.serialize() for o in data])


class StopById(Resource):
    def get(self, s_id):
        try:
            s_id = int(s_id)
        except Exception as e:
            return create_error(500, "Cannot convert id '{}' to integer".format(s_id), extra=e.__str__()), 500
        stop = Stop.query.filter_by(id=s_id).first()
        if stop is None:
            return create_error(404, "Stop with id {} does not exist".format(s_id)), 404
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
                return create_error(500,
                                    "Region {} does not exist. For possible values make http request to /regions/values"
                                    .format(region), extra=e.__str__()), 500
        else:
            try:
                region = Region[region.upper()]
                if region is None:
                    raise ValueError("Cannot convert string to Region")
            except Exception as e:
                return create_error(500,
                                    "Region {} does not exist. For possible values, make http request to /regions/values"
                                    .format(region), extra=e.__str__()), 500

        stops = Stop.query.filter_by(region=region).all()
        return [s.serialize() for s in stops], 200


class StopsByVillage(Resource):
    def get(self, village):
        stops = Stop.query.filter_by(village=village).all()
        return [s.serialize() for s in stops]


class StopsByLineNumber(Resource):
    def get(self, region, line_number):
        from project.delijn.stops_by_line import get_delijn_stopNumberByLine
        import click
        region = try_convert(region)
        if type(region) is int:
            region = Region(region)
        if type(region) is str:
            region = Region[region.upper()]
        stop_numbers = get_delijn_stopNumberByLine(region, line_number)
        click.echo("Got {} amount of items".format(len(stop_numbers)))
        result = list()
        for number in stop_numbers:
            stop = Stop.query.filter_by(stop_number=number, region=region).first()
            if stop:
                result.append(stop)
        if len(result) == 0:
            return [], 200
        return [s.serialize() for s in result], 200
