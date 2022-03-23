import sqlalchemy as sql
from web import sql_database as db


class EventTime(db.Model):
    id = sql.Column(sql.Integer, primary_key=True)
    event_day_id = sql.Column(
        sql.Integer, sql.ForeignKey('event_day.id'), nullable=False)
    start = sql.Column(sql.DateTime, nullable=True)
    end = sql.Column(sql.DateTime, nullable=True)
