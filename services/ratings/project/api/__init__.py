from flask import Blueprint
from flask_restful import Api
from project.api.vehicle_ratings import RateVehicle, VehicleRatingByCreator, RatingByVehicleID
from project.api.stop_ratings import RateStop, StopRatingByCreator, RatingByStopID

api_blueprint = Blueprint('api', __name__)
api = Api(api_blueprint)

api.add_resource(RateVehicle, '/vehicle/rating')
api.add_resource(RatingByVehicleID, '/vehicle/rating/<v_id>')
api.add_resource(VehicleRatingByCreator, '/vehicle/rating/user/<c_id>')

api.add_resource(RateStop, '/stop/rating')
api.add_resource(RatingByStopID, '/stop/rating/<s_id>')
api.add_resource(StopRatingByCreator, '/stop/rating/user/<c_id>')
