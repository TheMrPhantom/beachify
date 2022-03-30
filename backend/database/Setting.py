from enum import unique
import sqlalchemy as sql
from web import sql_database as db


class Setting(db.Model):
    id = sql.Column(sql.Integer, primary_key=True)
    key = sql.Column(sql.String(100), nullable=False, unique=True)
    value = sql.Column(sql.String(100), nullable=False)
