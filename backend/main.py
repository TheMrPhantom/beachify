from datetime import datetime
import os
import queue
import TaskScheduler
from flask import helpers, url_for, session, redirect
from flask import request
from flask.wrappers import Request
from functools import wraps
import authenticator
import util
from web import *
from database import Queries
import spotify
import bwebsocket

# Database
token_manager = authenticator.TokenManager()

db = Queries.Queries(sql_database)
ws = bwebsocket.Websocket()
sp = spotify.Spotify(ws, db)

# Tasks
taskScheduler = TaskScheduler.TaskScheduler()
taskScheduler.add_minutely_task(db.delete_old_songs_from_queue)
taskScheduler.add_minutely_task(db.delete_old_songs_from_ban)
taskScheduler.add_secondly_task(sp.checkCurrentSong)
taskScheduler.add_secondly_task(sp.check_queue_insertion)
taskScheduler.start()


def with_beachify_token(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        if not db.check_secret(request.cookies.get('beachifyToken')):
            return util.build_response("Wrong token", 401)
        return fn(*args, **kwargs)
    wrapper.__name__ = fn.__name__
    return wrapper


def trigger_reload(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        f = fn(*args, **kwargs)
        ws.trigger_reload()

        return f
    wrapper.__name__ = fn.__name__
    return wrapper


@app.route('/api/search/song/<string:seach_term>', methods=["GET"])
@with_beachify_token
def search_for_song(seach_term):
    songs = util.simplify_spotify_tracks(
        sp.connector.search(seach_term, limit=10, type='track'))

    db.flag_queued_songs(songs)
    return util.build_response(songs)


@app.route('/api/search/playlist/<string:seach_term>', methods=["GET"])
@with_beachify_token
def search_for_playlist(seach_term):

    playlists = util.simplify_spotify_playlists(
        sp.connector.search(seach_term, limit=10, type='playlist'))

    return util.build_response(playlists)


@app.route('/api/queue/song', methods=["GET"])
@with_beachify_token
def get_songs_from_queue():
    return util.build_response(db.get_queued_songs())


@app.route('/api/queue/song', methods=["PUT"])
@with_beachify_token
@trigger_reload
def add_song_to_queue():
    possible = db.adding_song_to_queue_possible()
    if possible != 0:
        if possible == 1:
            return util.build_response("Aktuell ist die Warteschlange deaktiviert", code=503)
        elif possible == 2:
            return util.build_response("Der Song wurde vorübergehend gebannt", code=503)
        else:
            return util.build_response("Aktuell nicht möglich", code=503)
    db.add_song_to_songlist([request.json])
    success = db.add_song_to_queue(request.json["trackID"])

    if success:
        return util.build_response("Song added")
    else:
        return util.build_response("Song cant be added", code=409)


@app.route('/api/queue/song/upvote', methods=["PUT"])
@with_beachify_token
@trigger_reload
def song_from_queue_upvote():
    db.upvote_song(request.json)
    return util.build_response("Song upvoted")


@app.route('/api/queue/song/downvote', methods=["PUT"])
@with_beachify_token
@trigger_reload
def song_from_queue_downvote():
    db.downvote_song(request.json)
    return util.build_response("Song downvoted")


@app.route('/api/queue/song/delete', methods=["POST"])
@with_beachify_token
@trigger_reload
def delete_song_from_queue():
    db.delete_song_from_queue(song_id=request.json)
    return util.build_response("Song deleted")


@app.route('/api/queue/song/ban', methods=["PUT"])
@with_beachify_token
@trigger_reload
def ban_song():
    db.ban_song(request.json)
    db.delete_song_from_queue(request.json)
    return util.build_response("Song banned")


@app.route('/api/queue/song/approve', methods=["POST"])
@with_beachify_token
@trigger_reload
def approve_song():
    db.approve_song(request.json)
    return util.build_response("Song approved")


@app.route('/api/auth/secret/check/<string:secret>', methods=["GET"])
def checkSecret(secret):
    if db.check_secret(secret):
        return util.build_response("OK")
    else:
        return util.build_response("Wrong token", code=401)


@app.route('/api/setting', methods=["GET"])
def get_settings():
    return util.build_response(db.get_settings())


@app.route('/api/setting/listMode', methods=["PUT"])
def set_listmode():
    if "whitelist" == request.json or "blacklist" == request.json:
        db.set_settings(value=request.json, setting_name="list_mode")
    else:
        return util.build_response("Der übergebene Text war nicht Whitelist oder Blacklist.", code=412)

    return util.build_response(request.json)


@app.route('/api/setting/trustMode', methods=["PUT"])
@trigger_reload
def set_trustmode():
    if request.json == "approval" or request.json == "no_approval":
        db.set_settings(value=request.json, setting_name="trust_mode")
    else:
        return util.build_response("Der übergebene Text ist weder Genehmigung Benötigt noch freue Wahl", code=412)
    return util.build_response(request.json)


@app.route('/api/setting/defaultPlaylist', methods=["PUT"])
def set_dp():
    if sp.connector.playlist(playlist_id=request.json['id']) is not None:
        db.set_settings(
            value=request.json['name'], setting_name="default_playlist")
        db.set_settings(
            value=request.json['id'], setting_name="default_playlist_id")
    else:
        return util.build_response("Die übergebene Playlist existiert nicht", code=412)
    return util.build_response(request.json)


@app.route('/api/setting/guestToken', methods=["PUT"])
def set_guest_token():
    if len(str(request.json)) != 0:
        db.set_settings(value=request.json, setting_name="guest_token")
    else:
        return util.build_response("Der übergebene Token ist fehlerhaft", code=412)
    return util.build_response(request.json)


@app.route('/api/setting/waitingTime', methods=["PUT"])
def set_waiting_time():
    if int(request.json) > 0:
        db.set_settings(value=request.json, setting_name="waiting_time")
    else:
        return util.build_response("Die übergebene Wartezeit ist keine gültige Zeit.", code=412)
    return util.build_response(request.json)


@app.route('/api/setting/defaultBanTime', methods=["PUT"])
def set_default_ban_time():
    if int(request.json) > 0:
        db.set_settings(value=request.json, setting_name="default_ban_time")
    else:
        return util.build_response("Die übergebene Ban Zeit ist keine gültige Zeit.", code=412)
    return util.build_response(request.json)


@app.route('/api/setting/queueState', methods=["PUT"])
def set_queue_state():
    if request.json == "activated" or request.json == "deactivated":
        db.set_settings(value=request.json, setting_name="queue_state")
    else:
        return util.build_response("Die übergebene Eingabe ist weder Aktiviert noch Deaktiviert.", code=412)
    return util.build_response(request.json)


@app.route('/api/setting/queueSubmittable', methods=["PUT"])
def set_queue_submittable():
    if request.json == "activated" or request.json == "deactivated":
        db.set_settings(value=request.json, setting_name="queue_submittable")
    else:
        return util.build_response("Die übergebene Eingabe ist weder Aktiviert noch Deaktiviert.", code=412)
    return util.build_response(request.json)


@app.route('/api/setting/retentionTime', methods=["PUT"])
def set_retention_time():
    if int(request.json) > 0:
        db.set_settings(value=request.json, setting_name="retention_time")
    else:
        return util.build_response("Die übergebene Dauer ist keine gütlige Zeiteingabe.", code=412)
    return util.build_response(request.json)


@app.route('/api/spotify/authorize', methods=["GET"])
def authorize_spotify():
    return util.build_response(sp.get_token_url())


@app.route('/api/spotify/authorize/callback', methods=["GET"])
def spotify_callback():
    sp.set_token(request.args.get("code"), request.args.get("state"))

    if "127.0.0.1" in util.domain:
        return redirect(f"http://{util.domain}/admin")
    else:
        return redirect(f"https://{util.domain}/admin")


@app.route('/api/spotify/playstate/currentlyPlaying', methods=["GET"])
def currently_playing():
    return util.build_response(util.simplify_spotify_track(sp.connector.currently_playing()['item']))


@app.route('/api/spotify/playstate/playing', methods=["GET"])
def is_playing():
    return util.build_response(sp.connector.currently_playing()["is_playing"])


@app.route('/api/spotify/playstate/play', methods=["POST"])
def play():
    sp.connector.start_playback()
    return util.build_response("OK")


@app.route('/api/spotify/playstate/pause', methods=["POST"])
def pause():
    sp.connector.pause_playback()
    return util.build_response("OK")


@app.route('/api/spotify/playstate/toggle', methods=["POST"])
def toggle_playstate():
    if sp.connector.currently_playing()["is_playing"]:
        sp.connector.pause_playback()
    else:
        sp.connector.start_playback()
    return util.build_response("OK")


@app.route('/api/spotify/playstate/skip', methods=["POST"])
@trigger_reload
def skip_song():
    sp.check_queue_insertion_forced()
    sp.connector.next_track()

    return util.build_response("OK")


@app.route('/api/spotify/authentication', methods=["GET"])
def spotify_state():
    sp.connector.current_user()
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
