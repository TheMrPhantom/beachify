import sqlalchemy as sql
from web import sql_database as db
from sqlalchemy.orm import relationship


class Event(db.Model):
    id = sql.Column(sql.Integer, primary_key=True)
    name = sql.Column(sql.String(100), nullable=False)
    place = sql.Column(sql.String(100), nullable=True)
    informations = sql.Column(sql.Text, nullable=True)
    secret_url = sql.Column(sql.String(100), nullable=False)
    public_url = sql.Column(sql.String(100), nullable=False)
    owner_name = sql.Column(sql.String(100), nullable=True)
    owner_mail = sql.Column(sql.String(100), nullable=True)
    optional_selection = sql.Column(sql.Boolean, nullable=False)
    max_Participants = sql.Column(sql.Integer, nullable=True)
    only_one_option = sql.Column(sql.Boolean, nullable=False)
    secret_poll = sql.Column(sql.Boolean, nullable=False)
    deadline = sql.Column(sql.Date, nullable=True)
    send_result = sql.Column(sql.Boolean, nullable=False)

    timeslots = relationship('database.EventDay.EventDay', lazy="joined")
