from flask.cli import FlaskGroup
from project import create_app, db
from project.delijn.stop_data import get_stop_data
from project.models.Vehicle import Vehicle
from project.models.Stop import Stop

app = create_app()
cli = FlaskGroup(create_app=create_app)


@cli.command()
def recreate_db():
    db.drop_all()
    db.create_all()
    db.session.commit()
    print("Database recreated")


@cli.command()
def add_vehicle_samples():
    print("Added Vehicle samples")


@cli.command()
def add_stop_data():
    data = get_stop_data()
    from project.models.Stop import Region
    data = [1]
    for s in data:
        # stop = Stop(name=s.get('name'), region=s.get('region'), stop_number=s.get('number'), village=s.get('village'))
        stop = Stop(name='Test', region=Region.ANTWERPEN, stop_number=7854, village='test village')
        db.session.add(stop)
        db.session.commit()
        pass
    print("Added Stop samples")


@cli.command()
def seed_db():
    add_vehicle_samples()
    add_stop_data()
    print("Filled database")


if __name__ == '__main__':
    cli()
