from project import db


class User(db.Model):
    __tablename__ = 'users'
    u_id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    name = db.Column(db.String(128), nullable=False)
    password = db.Column(db.String(128), nullable=False)
    email = db.Column(db.String(128), nullable=False, unique=True)
    admin = db.Column(db.Boolean(), default=False, nullable=False)

    def __init__(self, name, password, email, admin=False):
        self.name = name
        self.email = email
        self.password = password
        self.admin = admin

    def serialize(self):
        return {
            'name': self.name,
            'email': self.email,
            'isAdmin': self.admin,
            'id': self.u_id
        }
