from flask.cli import FlaskGroup
from project import create_app, db
from project.models.VehicleRating import VehicleRating, VehicleType
from project.models.StopRating import StopRating

app = create_app()
cli = FlaskGroup(create_app=create_app)


@cli.command('reset')
def recreate_db():
    """Resets the database: deletes all entries and recreates the models"""
    db.drop_all()
    db.create_all()
    db.session.commit()
    print("Database recreated")


@cli.command('fill_db')
def seed_db():
    """Fills the database with dummy data"""
    r1 = VehicleRating(8.0, 1, 1)
    r2 = VehicleRating(3.0, 2, 2)
    r3 = StopRating(7.0, 1, 2)
    r4 = StopRating(5.0, 1, 1)
    db.session.add(r1)
    db.session.add(r2)
    db.session.add(r3)
    db.session.add(r4)
    db.session.commit()
    print("Database filled with dummy data")


if __name__ == '__main__':
    cli()
