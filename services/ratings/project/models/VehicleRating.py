from project import db
from enum import Enum


class VehicleType(Enum):
    BUS = 0
    TRAM = 1

    def __str__(self):
        name = self.name
        name = name.lower().capitalize()
        return name

    @staticmethod
    def get_key_value():
        return {str(e): e.value for e in VehicleType}


class VehicleRating(db.Model):
    __tablename__ = 'vehicle_ratings'
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    vehicle_type = db.Column(db.Enum(VehicleType), nullable=False)
    vehicle_id = db.Column(db.Integer, nullable=False)
    created_by = db.Column(db.Integer, nullable=False)
    rating = db.Column(db.Integer, nullable=False, default=0)

    def __init__(self, rating, vehicle_type: VehicleType, vehicle_id, created_by):
        self.vehicle_type = vehicle_type
        self.vehicle_id = vehicle_id
        self.created_by = created_by
        self.rating = rating

    def serialize(self):
        return {
            'id': self.id,
            'vehicle_type': str(self.vehicle_type),
            'vehicle_id': self.vehicle_id,
            'created_by': self.created_by,
            'rating': self.rating
        }

