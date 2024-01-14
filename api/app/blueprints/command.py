from app.extensions import db
from app.models import User
from flask import Blueprint

command = Blueprint("command", __name__, cli_group=None)


@command.cli.command()
def initdb():
    """Create database."""
    db.drop_all()
    db.create_all()
    print("Database created.")
    user = User(name="frank", password="123")
    db.session.add(user)
    db.session.commit()
    print("User frank added to database.")
