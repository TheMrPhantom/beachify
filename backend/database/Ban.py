from datetime import datetime
import sqlalchemy as sql
from web import sql_database as db
from sqlalchemy.orm import relationship


class Ban(db.Model):
    id = sql.Column(sql.Integer, primary_key=True)
    track_id = sql.Column(sql.String(100), nullable=False, unique=True)
    ban_time = sql.Column(
        sql.DateTime, nullable=False, default=datetime.now)
