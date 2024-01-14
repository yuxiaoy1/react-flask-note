from flask import Flask, redirect, url_for

from app import models
from app.blueprints.command import command
from app.blueprints.error import error
from app.blueprints.note import note
from app.blueprints.token import token
from app.blueprints.user import user
from app.config import Config
from app.extensions import apifairy, cors, db, ma


def create_app():
    app = Flask(__name__)

    app.config.from_object(Config)

    register_extensions(app)
    register_blueprints(app)
    register_shell_context(app)

    @app.get("/")
    def index():
        return redirect(url_for("apifairy.docs"))

    return app


def register_blueprints(app):
    app.register_blueprint(error)
    app.register_blueprint(command)
    app.register_blueprint(user, url_prefix="/api")
    app.register_blueprint(note, url_prefix="/api")
    app.register_blueprint(token, url_prefix="/api")


def register_extensions(app):
    apifairy.init_app(app)
    ma.init_app(app)
    cors.init_app(app)
    db.init_app(app)


def register_shell_context(app):
    @app.shell_context_processor
    def shell_context():
        ctx = {"db": db}
        for attr in dir(models):
            model = getattr(models, attr)
            if hasattr(model, "__bases__") and db.Model in getattr(model, "__bases__"):
                ctx[attr] = model
        return ctx
