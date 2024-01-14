from app.extensions import apifairy
from flask import Blueprint
from werkzeug.exceptions import HTTPException

error = Blueprint("error", __name__)


@error.app_errorhandler(HTTPException)
def http_error(error):
    return {
        "code": error.code,
        "message": error.name,
        "description": error.description,
    }, error.code


@apifairy.error_handler
def validation_error(code, messages):
    return {
        "code": code,
        "message": "Validation Error",
        "description": "The server found one or more errors in the information that you sent.",
        "error": messages,
    }, code
