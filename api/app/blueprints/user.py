from apifairy import authenticate, body, other_responses, response
from app.auth import token_auth
from app.extensions import db
from app.models import User
from app.schemas import UserSchema
from flask import Blueprint

user = Blueprint("user", __name__)

user_schema = UserSchema()
users_schema = UserSchema(many=True)
update_user_schema = UserSchema(partial=True)


@user.get("/users")
@authenticate(token_auth)
@response(users_schema)
def get_users():
    """Get a collection of users"""
    users = db.session.scalars(db.select(User))
    return users


@user.post("/users")
@body(user_schema)
@response(user_schema, 201)
def add_user(data):
    """Create a new user"""
    user = User(**data)
    db.session.add(user)
    db.session.commit()
    return user


@user.get("/users/<int:id>")
@authenticate(token_auth)
@response(user_schema)
@other_responses({404: "user not found."})
def get_user(id):
    """Get a particular user"""
    user = db.get_or_404(User, id)
    return user


@user.put("/users/<int:id>")
@body(update_user_schema)
@response(user_schema)
@other_responses({404: "user not found."})
def update_user(data, id):
    """Update an existing user"""
    user = db.get_or_404(User, id)
    user.update(data)
    db.session.add(user)
    db.session.commit()
    return user


@user.delete("/users/<int:id>")
@other_responses({404: "user not found."})
def delete_user(id):
    """Delete an existing user"""
    user = db.get_or_404(User, id)
    db.session.delete(user)
    db.session.commit()
    return "", 204


@user.get("/me")
@authenticate(token_auth)
@response(user_schema)
def me():
    """Get the authenticated user"""
    return token_auth.current_user()
