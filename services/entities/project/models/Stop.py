from enum import Enum
from project import db


class Region(Enum):
    """
    Enumeration of possible regions. The value of the regions is determined by De Lijn.
    If De Lijn chooses to update internally, this needs to be updated as well
    """
    ANTWERPEN = 1
    OOST_VLAANDEREN = 2
    VLAAMS_BRABANT = 3
    LIMBURG = 4
    WEST_VLAANDEREN = 5

    def __str__(self) -> str:
        name = self.name
        result = str()
        need_upper = True
        for char in name:
            if char == '_':
                result += ' '
                need_upper = True
            else:
                if need_upper:
                    result += char.upper()
                    need_upper = False
                else:
                    result += char.lower()
        return result


class Stop(db.Model):
    __tablename__ = 'stops'
    id = db.Column(db.Integer, nullable=False, primary_key=True, autoincrement=True, unique=True)
    region = db.Column(db.Enum(Region), nullable=False)
    name = db.Column(db.String(128), nullable=False)
    stop_number = db.Column(db.Integer, nullable=False)
    village = db.Column(db.String(128), nullable=True)

    def __init__(self, region: Region, name: str, stop_number: int, village: str) -> None:
        self.region = region
        self.name = name
        self.stop_number = stop_number
        self.village = village
