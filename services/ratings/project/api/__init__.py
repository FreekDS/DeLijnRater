from flask import Blueprint
from flask_restful import Api
from project.api.vehicle_ratings import RateVehicle, VehicleRatingByCreator, RatingByVehicleID
from project.api.stop_ratings import RateStop, StopRatingByCreator, RatingByStopID, StopAverage

api_blueprint = Blueprint('api', __name__)
api = Api(api_blueprint)

api.add_resource(RateVehicle, '/vehicle/rating')
api.add_resource(RatingByVehicleID, '/vehicle/rating/<v_id>')
api.add_resource(VehicleRatingByCreator, '/vehicle/rating/user/<c_id>')

api.add_resource(RateStop, '/stops/rating')
api.add_resource(RatingByStopID, '/stops/rating/<s_id>')
api.add_resource(StopRatingByCreator, '/stops/rating/user/<c_id>')
api.add_resource(StopAverage, '/stops/average/<s_id>')
