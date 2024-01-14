from apifairy import authenticate, other_responses, response
from app.auth import basic_auth
from app.extensions import db
from app.models import User
from app.schemas import TokenSchema
from flask import Blueprint, abort, request

token = Blueprint("token", __name__)

token_schema = TokenSchema()


@token.post("/tokens")
@authenticate(basic_auth)
@response(token_schema)
@other_responses({401: "Invalid username or password"})
def get_auth_tokens():
    """Get authentication token"""
    user = basic_auth.current_user()
    token = user.generate_auth_token()
    db.session.add(user)
    db.session.commit()
    return {"token": token}


@token.delete("/tokens")
@other_responses({401: "Invalid token"})
def revoke_token():
    """Revoke an token"""
    token = request.headers["Authorization"].split()[1]
    user = db.first_or_404(db.select(User).filter_by(token=token))
    if not user:
        abort(401)
    user.revoke_auth_token()
    db.session.commit()
    return "", 204
