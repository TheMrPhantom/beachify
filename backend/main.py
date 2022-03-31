from datetime import datetime
import os
import TaskScheduler
from flask import helpers, url_for, session, redirect
from flask import request
from flask.wrappers import Request
from functools import wraps
import authenticator
import util
from web import *
from database import Queries
import spotipy
from spotipy.oauth2 import SpotifyOAuth, SpotifyClientCredentials

# Spotify Stuff
scope = "user-read-playback-state user-modify-playback-state user-read-currently-playing streaming playlist-read-private playlist-read-collaborative"

sp = spotipy.Spotify(auth_manager=SpotifyOAuth(scope=scope))

auth_manager = SpotifyClientCredentials()
sp = spotipy.Spotify(auth_manager=auth_manager)

# Database
token_manager = authenticator.TokenManager()

db = Queries.Queries(sql_database)

# Tasks
taskScheduler = TaskScheduler.TaskScheduler()
taskScheduler.start()


def with_beachify_token(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        if not db.check_secret(request.cookies.get('beachifyToken')):
            return util.build_response("Wrong token", 401)
        return fn(*args, **kwargs)
    wrapper.__name__ = fn.__name__
    return wrapper


@app.route('/api/search/song/<string:seach_term>', methods=["GET"])
@with_beachify_token
def search_for_song(seach_term):
    songs = util.simplify_spotify_tracks(sp.search(seach_term, limit=10))

    db.flag_queued_songs(songs)
    return util.build_response(songs)


@app.route('/api/queue/song', methods=["GET"])
@with_beachify_token
def get_songs_from_queue():
    return util.build_response(db.get_queued_songs())


@app.route('/api/queue/song', methods=["PUT"])
@with_beachify_token
def add_song_to_queue():
    if not db.adding_song_to_queue_possible():
        return util.build_response("Currently not possible", code=503)
    db.add_song_to_songlist([request.json])
    success = db.add_song_to_queue(request.json["trackID"])

    if success:
        return util.build_response("Song added")
    else:
        return util.build_response("Song cant be added", code=409)


@app.route('/api/queue/song/upvote', methods=["PUT"])
@with_beachify_token
def song_from_queue_upvote():
    db.upvote_song(request.json)
    return util.build_response("Song upvoted")


@app.route('/api/queue/song/downvote', methods=["PUT"])
@with_beachify_token
def song_from_queue_downvote():
    db.downvote_song(request.json)
    return util.build_response("Song downvoted")


@app.route('/api/auth/secret/check/<string:secret>', methods=["GET"])
def checkSecret(secret):
    if db.check_secret(secret):
        return util.build_response("OK")
    else:
        return util.build_response("Wrong token", code=401)


@app.route('/api/setting', methods=["GET"])
def get_settings():
    # TODO
    return util.build_response("OK")


@app.route('/api/setting/listMode', methods=["PUT"])
def set_listmode():
    # TODO
    return util.build_response("OK")


@app.route('/api/setting/trustMode', methods=["PUT"])
def set_trustmode():
    # TODO
    return util.build_response("OK")


@app.route('/api/setting/defaultPlaylist', methods=["PUT"])
def set_dp():
    # TODO
    return util.build_response("OK")


@app.route('/api/setting/guestToken', methods=["PUT"])
def set_guest_token():
    # TODO
    return util.build_response("OK")


@app.route('/api/setting/waitingTime', methods=["PUT"])
def set_waiting_time():
    # TODO
    return util.build_response("OK")


@app.route('/api/setting/defaultBanTime', methods=["PUT"])
def set_default_ban_time():
    # TODO
    return util.build_response("OK")


@app.route('/api/setting/queueState', methods=["PUT"])
def set_queue_state():
    # TODO
    return util.build_response("OK")


@app.route('/api/setting/queueSubmittable', methods=["PUT"])
def set_queue_submittable():
    # TODO
    return util.build_response("OK")


@app.route('/api/setting/retentionTime', methods=["PUT"])
def set_retention_time():
    # TODO
    return util.build_response("OK")


@app.route('/api/login/check', methods=["GET"])
def loginCheck():
    return util.build_response("OK")


@app.route('/api/logout', methods=["POST"])
def logout():
    token_manager.delete_token(request.cookies.get('token'))
   # util.log("Logout", f"MemberID: {request.cookies.get('memberID')}")
    return util.build_response("OK")


if __name__ == "__main__":
    if util.logging_enabled:
        app.run("0.0.0.0", threaded=True)
    else:
        from waitress import serve
        serve(app, host="0.0.0.0", port=5000, threads=4)
