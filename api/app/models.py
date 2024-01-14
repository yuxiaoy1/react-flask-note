import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional

import sqlalchemy as sa
import sqlalchemy.orm as so
from werkzeug.security import check_password_hash, generate_password_hash

from app.extensions import db


class Updateable:
    def update(self, data):
        for attr, value in data.items():
            setattr(self, attr, value)


class User(Updateable, db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    name: so.Mapped[int] = so.mapped_column(sa.String(32), unique=True)
    password_hash: so.Mapped[str] = so.mapped_column(sa.String(128))
    last_seen: so.Mapped[datetime] = so.mapped_column(
        default=lambda: datetime.now(timezone.utc)
    )
    notes: so.WriteOnlyMapped["Note"] = so.relationship(back_populates="user")
    token: so.Mapped[Optional[str]] = so.mapped_column(sa.String(64), index=True)
    token_expiration: so.Mapped[Optional[datetime]]

    @property
    def password(self):
        raise AttributeError("password is not a readable attribute")

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    def ping(self):
        self.last_seen = datetime.utcnow()

    def generate_auth_token(self):
        self.token = secrets.token_urlsafe()
        self.token_expiration = datetime.utcnow() + timedelta(minutes=60)
        return self.token

    @staticmethod
    def verify_auth_token(token):
        user = User.query.filter_by(token=token).first()
        if user and user.token_expiration > datetime.utcnow():
            user.ping()
            db.session.commit()
            return user

    def revoke_auth_token(self):
        self.token_expiration = datetime.utcnow()


class Note(Updateable, db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    body: so.Mapped[str] = so.mapped_column(sa.String(120))
    user_id: so.Mapped[int] = so.mapped_column(sa.ForeignKey("user.id"))
    user: so.Mapped["User"] = so.relationship(back_populates="notes")
