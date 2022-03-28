from email.policy import default
from enum import unique
import sqlalchemy as sql
from web import sql_database as db
from sqlalchemy.orm import relationship


class Queue(db.Model):
    id = sql.Column(sql.Integer, primary_key=True)