import sqlalchemy as sql
from web import sql_database as db
from sqlalchemy.orm import relationship


class EventDay(db.Model):
    id = sql.Column(sql.Integer, primary_key=True)
    event_id = sql.Column(
        sql.Integer, sql.ForeignKey('event.id'), nullable=False)
    date = sql.Column(sql.Date, nullable=True)

    times = relationship('database.EventTime.EventTime', lazy="joined")
