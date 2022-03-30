import sqlalchemy as sql
from web import sql_database as db
from sqlalchemy.orm import relationship


class Queue(db.Model):
    id = sql.Column(sql.Integer, primary_key=True)
    song_id = sql.Column(sql.Integer, sql.ForeignKey(
        'song.id'), nullable=False)
    song = relationship(
        'database.Song.Song', lazy="joined")
    approval_pending = sql.Column(sql.Boolean, nullable=False, default=True)
    upvotes = sql.Column(sql.Integer, nullable=False, default=0)
    downvotes = sql.Column(sql.Integer, nullable=False, default=0)
