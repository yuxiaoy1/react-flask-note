from apifairy import authenticate, body, other_responses, response
from app.auth import token_auth
from app.extensions import db
from app.models import Note
from app.schemas import NoteSchema
from flask import Blueprint, abort

note = Blueprint("note", __name__)

note_schema = NoteSchema()
notes_schema = NoteSchema(many=True)
update_note_schema = NoteSchema(partial=True)


@note.get("/notes")
@authenticate(token_auth)
@response(notes_schema)
def get_notes():
    """Read a collection of notes"""
    user = token_auth.current_user()
    return db.session.scalars(user.notes.select())


@note.post("/notes")
@authenticate(token_auth)
@body(note_schema)
@response(note_schema, 201)
def add_note(data):
    """Add a new note"""
    user = token_auth.current_user()
    note = Note(user=user, **data)
    db.session.add(note)
    db.session.commit()
    return note


@note.get("/notes/<int:id>")
@authenticate(token_auth)
@response(note_schema)
@other_responses({403: "Forbidden", 404: "Note not found."})
def get_note(id):
    """Read a particular note"""
    note = db.get_or_404(Note, id)
    if note.user != token_auth.current_user():
        abort(403)
    return note


@note.put("/notes/<int:id>")
@authenticate(token_auth)
@body(update_note_schema)
@response(note_schema)
@other_responses({403: "Forbidden", 404: "Note not found."})
def update_note(data, id):
    """Update a particular note"""
    note = db.get_or_404(Note, id)
    if note.user != token_auth.current_user():
        abort(403)
    note.update(data)
    db.session.add(note)
    db.session.commit()
    return note


@note.delete("/notes/<int:id>")
@authenticate(token_auth)
@other_responses({403: "Forbidden", 404: "Note not found."})
def delete_note(id):
    """Delete a particular note"""
    note = db.get_or_404(Note, id)
    if note.user != token_auth.current_user():
        abort(403)
    db.session.delete(note)
    db.session.commit()
    return "", 204
