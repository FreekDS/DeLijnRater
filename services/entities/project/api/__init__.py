from flask import Blueprint
from flask_restful import Api
from project.api.stop_resources import AllStops, StopById, StopsByRegion, StopsByVillage, StopsByLineNumber
from project.api.vehicle_resources import AllVehicles, VehicleById, VehicleByCreator
from project.api.general import *
from project.api.doc import documentation_blueprint

api_blueprint = Blueprint('api', __name__)
api = Api(api_blueprint)

api.add_resource(AllStops, '/stops')
api.add_resource(RegionEnum, '/regions/values')
api.add_resource(VehicleEnum, '/vehicles/values')
api.add_resource(AllVehicles, '/vehicles')
api.add_resource(VehicleById, '/vehicles/id/<v_id>')
api.add_resource(VehicleByCreator, '/vehicles/creator/<c_id>')
api.add_resource(StopById, '/stops/id/<s_id>')
api.add_resource(StopsByVillage, "/stops/village/<village>")
api.add_resource(StopsByRegion, '/stops/region/<region>')
api.add_resource(StopsByLineNumber, '/stops/line/<region>/<line_number>')