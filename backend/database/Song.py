import sqlalchemy as sql
from web import sql_database as db
from sqlalchemy.orm import relationship


class Song(db.Model):
    id = sql.Column(sql.Integer, primary_key=True)
    songname = sql.Column(sql.String(100), nullable=False)
    interpret = sql.Column(sql.String(100), nullable=False)
    track_id = sql.Column(sql.String(100), nullable=False, unique=True)
    album = sql.Column(sql.String(100), nullable=False)
    cover_URL = sql.Column(sql.String(100), nullable=False)
