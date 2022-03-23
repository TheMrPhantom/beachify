from datetime import datetime
import os
import TaskScheduler
from flask import helpers
from flask import request
from flask.wrappers import Request
from functools import wraps
import authenticator
import util
from web import *

from database import Queries


token_manager = authenticator.TokenManager()

db = Queries.Queries(sql_database)

taskScheduler = TaskScheduler.TaskScheduler()
taskScheduler.start()


def authenticated(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        if not token_manager.check_token(request.cookies.get('memberID'), request.cookies.get('token')):
            return util.build_response("Unauthorized", 403)
        return fn(*args, **kwargs)
    wrapper.__name__ = fn.__name__
    return wrapper


# def checkTrainer(request: Request):
#     if not token_manager.check_token(request.cookies.get('memberID'), request.cookies.get('token')):
#         return util.build_response("Unauthorized", 403)

#     if not (db.isTrainer(request.cookies.get('memberID')) or db.isExecutive(request.cookies.get('memberID'))):
#         return util.build_response("Unauthorized", 403)
#     return None


# def checkExecutive(request: Request):
#     if not token_manager.check_token(request.cookies.get('memberID'), request.cookies.get('token')):
#         return util.build_response("Unauthorized", 403)
#     if not db.isExecutive(request.cookies.get('memberID')):
#         return util.build_response("Unauthorized", 403)
#     return None


# def memberIDFromRequest(request: Request):
#     return request.cookies.get('memberID')


# def infosAboutSelfOrTrainer(request: Request, memberID):
#     if checkTrainer(request):
#         if not int(memberID) == int(memberIDFromRequest(request)):
#             return util.build_response("Unauthorized", 403)
#     return None


@app.route('/api/event/infos/<string:event_URL>', methods=["GET"])
def get_event_infos(event_URL):
    event_infos = db.get_event_infos(event_URL)
    if event_infos is not None:
        return util.build_response(event_infos)
    else:
        return util.build_response("Event not found", code=404)


@app.route('/api/login/check', methods=["GET"])
@authenticated
def loginCheck():
    return util.build_response("OK")


@app.route('/api/logout', methods=["POST"])
@authenticated
def logout():
    token_manager.delete_token(request.cookies.get('token'))
    util.log("Logout", f"MemberID: {request.cookies.get('memberID')}")
    return util.build_response("OK")


if __name__ == "__main__":
    if util.logging_enabled:
        app.run("0.0.0.0", threaded=True)
    else:
        from waitress import serve
        serve(app, host="0.0.0.0", port=5000, threads=4)
