from project import db


class StopRating(db.Model):
    __tablename__ = 'stop_ratings'
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    stop_id = db.Column(db.Integer, nullable=False)
    created_by = db.Column(db.Integer, nullable=False)
    rating = db.Column(db.Integer, nullable=False, default=0)

    def __init__(self, rating, stop_id, created_by):
        self.stop_id = stop_id
        self.created_by = created_by
        self.rating = rating

    def serialize(self):
        return {
            'id': self.id,
            'stop_id': self.stop_id,
            'created_by': self.created_by,
            'rating': self.rating
        }
