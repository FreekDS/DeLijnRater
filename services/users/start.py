from flask.cli import FlaskGroup
from project import create_app, db
from project.models.User import User

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
    u1 = User('Dokter Phill', 'ranch123', 'dokterphil@outlook.com')
    u2 = User('Donald Trump', 'mexico123', 'realdonaldtrump@whitehouse.us', True)
    u3 = User('Koning Filip', 'belgie126', 'flipke@koning.be', False)
    u4 = User('Test user', 'test', 'test@test.com', False)
    db.session.add(u1)
    db.session.add(u2)
    db.session.add(u3)
    db.session.add(u4)
    db.session.commit()
    print("Database filled with dummy data")


if __name__ == '__main__':
    cli()
