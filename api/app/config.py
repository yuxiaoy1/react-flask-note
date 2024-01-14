import os

basedir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))


class Config:
    APIFAIRY_TITLE = "Flask API"
    APIFAIRY_VERSION = "0.1"
    APIFAIRY_UI = os.getenv("DOCS_UI", "elements")

    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL", "sqlite:///" + os.path.join(basedir, "db.sqlite")
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    DISABLE_AUTH = os.getenv("DISABLE_AUTH", False)

    CORS_SUPPORTS_CREDENTIALS = True
