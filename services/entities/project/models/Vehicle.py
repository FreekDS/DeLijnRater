from enum import Enum
from project import db


class VehicleType(Enum):
    """
    All possible vehicle types
    """
    BUS = 0
    TRAM = 1

    def __str__(self):
        name = self.name
        name = name.lower().capitalize()
        return name

    @staticmethod
    def get_key_value():
        return {str(e): e.value for e in VehicleType}


class Vehicle(db.Model):
    """This class is the database model for a vehicle"""
    __tablename__ = 'vehicles'
    id = db.Column(db.Integer, primary_key=True, nullable=False, unique=True)
    number = db.Column(db.Integer, nullable=False)
    description = db.Column(db.Text(), nullable=True)
    name = db.Column(db.String(128), nullable=True)
    type = db.Column(db.Enum(VehicleType), nullable=False, default=VehicleType.BUS)
    created_by = db.Column(db.Integer, nullable=False)

    def __init__(self, id: int, number: int, description: str, vehicle_type: VehicleType or int, user_id: id,
                 name: str):

        if type(vehicle_type) is int:
            vehicle_type = VehicleType(vehicle_type)

        self.id = id
        self.number = number
        self.description = description
        self.type = vehicle_type
        self.created_by = user_id
        self.name = name

    def serialize(self):
        return {
            'id': int(self.id),
            'number': int(self.number),
            'description': str(self.description),
            'type': str(self.type),
            'created_by': int(self.created_by),
            'name': str(self.name)
        }


if __name__ == '__main__':
    print(VehicleType.get_key_value())