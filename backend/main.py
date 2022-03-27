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
import spotipy
from spotipy.oauth2 import SpotifyOAuth, SpotifyClientCredentials

scope = "user-read-playback-state user-modify-playback-state user-read-currently-playing streaming playlist-read-private playlist-read-collaborative"

sp = spotipy.Spotify(auth_manager=SpotifyOAuth(scope=scope))

auth_manager = SpotifyClientCredentials()
sp = spotipy.Spotify(auth_manager=auth_manager)


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

@app.route('/api/search/song/<string:seach_term>', methods=["GET"])
def search_for_song(seach_term):
    songs = util.simplify_spotify_tracks(sp.search(seach_term, limit=10))
    db.flag_queued_songs(songs)
    return util.build_response(songs)


@app.route('/api/queue/song', methods=["GET"])
def get_songs_from_queue():
    return util.build_response(db.get_queued_songs())


@app.route('/api/queue/song', methods=["PUT"])
def add_song_to_queue():
    db.add_song_to_queue(request.json)
    return util.build_response("Song added")


@app.route('/api/queue/song/upvote', methods=["PATCH"])
def song_from_queue_upvote():
    db.upvote_song(request.json)
    return util.build_response("Song upvoted")


@app.route('/api/queue/song/downvote', methods=["PATCH"])
def song_from_queue_downvote():
    db.downvote_song(request.json)
    return util.build_response("Song downvoted")


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
