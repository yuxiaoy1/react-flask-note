from flask import current_app
from flask_httpauth import HTTPBasicAuth, HTTPTokenAuth
from werkzeug.exceptions import Forbidden, Unauthorized

from app.extensions import db
from app.models import User

basic_auth = HTTPBasicAuth()
token_auth = HTTPTokenAuth()


@basic_auth.verify_password
def verify_password(name, password):
    user = User.query.filter_by(name=name).first()
    if user and user.verify_password(password):
        return user


@basic_auth.error_handler
def basic_auth_error(status=401):
    error = (Forbidden if status == 403 else Unauthorized)()
    return (
        {"code": error.code, "message": error.name, "description": error.description},
        error.code,
        {"WWW-Authenticate": "Form"},
    )


@token_auth.verify_token
def verify_token(token):
    if current_app.config["DISABLE_AUTH"]:
        user = User.query.get(1)
        user.ping()
        db.session.commit()
        return user
    return User.verify_auth_token(token)
