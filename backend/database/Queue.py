from datetime import datetime
import sqlalchemy as sql
from web import sql_database as db
from sqlalchemy.orm import relationship


class Queue(db.Model):
    id = sql.Column(sql.Integer, primary_key=True)
    song_id = sql.Column(sql.Integer, sql.ForeignKey(
        'song.id'), nullable=False, unique=True)
    song = relationship(
        'database.Song.Song', lazy="joined")
    approval_pending = sql.Column(sql.Boolean, nullable=False, default=True)
    upvotes = sql.Column(sql.Integer, nullable=False, default=0)
    downvotes = sql.Column(sql.Integer, nullable=False, default=0)
    insertion_time = sql.Column(
        sql.DateTime, nullable=False, default=datetime.now)
    played_time = sql.Column(
        sql.DateTime, nullable=True)
    is_next_song = sql.Column(sql.Boolean, nullable=False, default=False)
    is_default_song = sql.Column(sql.Integer, nullable=False, default=False)
