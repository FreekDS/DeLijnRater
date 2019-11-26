from flask_restful import Resource, reqparse
from flask import jsonify

from project.models.Stop import Stop, Region
from project.utils import try_convert, create_error


def region_type(value):
    """
    Convert a value to a Region type
    :param value: value to convert to Region type
    :return: Region type of the value
    :exception: ValueError if value could not be converted
    """
    region = try_convert(value)
    if type(region) is int:
        region = Region(region)
    else:
        region = Region[region]
    if region is None:
        raise ValueError("Cannot convert '{}' to region".format(value))
    return region


# Create parser for the post method
stop_arg_parser = reqparse.RequestParser()
stop_arg_parser.add_argument('region', type=region_type,
                             help='region of the stop. Make call to /regions/values for possible values', required=True)
stop_arg_parser.add_argument('name', type=str, help='Name of the stop', required=True)
stop_arg_parser.add_argument('number', type=int, help='Number of the stop', required=True)
stop_arg_parser.add_argument('village', type=str, help='Village of the stop', required=False)


class AllStops(Resource):
    """Get all stops of the database"""
    def get(self):
        """
        Get all stops of the database
        :return: list of dictionaries containing all possible stops of the database
        """
        data = Stop.query.all()
        return [o.serialize() for o in data], 200


class StopById(Resource):
    """Get stops by ID"""
    def get(self, s_id):
        """
        Return the stop object with a specified id.
        :param s_id: ID of the stop that needs to be returned
        :return: stop with specified ID
        :exception: exception if ID does not exist or if s_id could not be converted to an integer
        """
        try:
            s_id = int(s_id)
        except Exception as e:
            return create_error(500, "Cannot convert id '{}' to integer".format(s_id), extra=e.__str__()), 500
        stop = Stop.query.filter_by(id=s_id).first()
        if stop is None:
            return create_error(404, "Stop with id {} does not exist".format(s_id)), 404
        return stop.serialize(), 200


class StopsByRegion(Resource):
    """Get all stops by region"""
    def get(self, region):
        """
        Get all the stops in a specified region
        :param region: region
        :return: list of stops that are in the specified region
        :exception: exceptions are thrown if region could not be converted to Region enum value
        """
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
    """Get stops that are in a given village"""
    def get(self, village):
        """
        Returns the stops that are in the specified village
        :param village: village to search all stops in
        :return: list of all stops in the given village
        """
        stops = Stop.query.filter_by(village=village).all()
        return [s.serialize() for s in stops], 200


class StopsByLineNumber(Resource):
    """Get the stops by the given line number"""
    def get(self, region, line_number):
        """
        Get the stops of a given line number
        :param region: region of the line
        :param line_number: line number of the line
        :return: list of stops that are on the given line
        """
        from project.delijn.stops_by_line import get_delijn_stopNumberByLine
        import click
        region = try_convert(region)
        if type(region) is int:
            region = Region(region)
        if type(region) is str:
            region = Region[region.upper()]
        stop_numbers = get_delijn_stopNumberByLine(region, line_number)
        result = list()
        for number in stop_numbers:
            stop = Stop.query.filter_by(stop_number=number, region=region).first()
            if stop:
                result.append(stop)
        if len(result) == 0:
            return [], 200
        return [s.serialize() for s in result], 200
