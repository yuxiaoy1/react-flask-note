from marshmallow import validate

from app.extensions import ma
from app.models import Note, User


class UserSchema(ma.SQLAlchemySchema):
    class Meta:
        model = User
        ordered = True

    id = ma.auto_field(dump_only=True)
    name = ma.auto_field(required=True, validate=validate.Length(min=1, max=10))
    password = ma.String(required=True, load_only=True, validate=validate.Length(min=3))


class NoteSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Note
        include_fk = True
        ordered = True

    id = ma.auto_field(dump_only=True)
    body = ma.auto_field(required=True, validate=validate.Length(min=1))
    user = ma.Nested(UserSchema, dump_only=True)


class TokenSchema(ma.Schema):
    class Meta:
        ordered = True

    token = ma.String(required=True)
