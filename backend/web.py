from flask_sqlalchemy import SQLAlchemy
from flask import Flask
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
if os.environ.get("db_name"):
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get("db_name")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'

sql_database = SQLAlchemy(app)
