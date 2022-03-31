from flask import Response
import json
import os
import datetime
import time
from database.Queue import Queue
from database.Song import Song

cookie_expire = int(os.environ.get("cookie_expire_time")) * \
    60*60 if os.environ.get("cookie_expire_time") else 60**3
domain = os.environ.get("domain") if os.environ.get(
    "domain") else "127.0.0.1:3000"
admin_pw = os.environ.get("adminpw") if os.environ.get(
    "adminpw") else "unsafe"
logging_enabled = True if os.environ.get(
    "logging") else False

os.environ['TZ'] = 'Europe/London'
time.tzset()


def build_response(message: object, code: int = 200, type: str = "application/json", cookieMemberID=None, cookieToken=None):
    """
    Build a flask response, default is json format
    """
    r = Response(response=json.dumps(message), status=code, mimetype=type)
    if cookieMemberID and cookieToken:
        r.set_cookie("memberID", str(cookieMemberID),
                     domain=domain, max_age=cookie_expire, samesite='Strict')
        r.set_cookie("token", cookieToken,
                     domain=domain, max_age=cookie_expire, samesite='Strict')

    return r


def simplify_spotify_tracks(song):
    """
    {
            "trackID": trackID
            "album":  album
            "coverURL": coverURL
            "interpret": interpret,
            "songname": songname
    }
    """
    songs = song["tracks"]["items"]
    output = []

    for s in songs:
        output.append({
            "trackID": s["uri"],
            "album": s["album"]["name"],
            "coverURL": s["album"]["images"][1]["url"],
            "interpret": s["artists"][0]["name"],
            "songname": s["name"]})
    return output


def log(prefix, message):
    if logging_enabled:
        time = datetime.datetime.now().strftime("%x %X")
        output_string = f"[{time}] {prefix} -> {message}"
        with open("logs/log.txt", 'a+') as f:
            f.write(f"{output_string}\n")


def format_song(queue_element: Queue, song: Song, trust_mode_on: bool):
    return {
        "databaseID": queue_element.id,
        "songname": song.songname,
        "album": song.album,
        "trackID": song.track_id,
        "coverURL": song.cover_URL,
        "upvotes": queue_element.upvotes,
        "downvotes": queue_element.downvotes,
        "interpret": song.interpret,
        "approvalPending": queue_element.approval_pending if trust_mode_on else False,
        "insertion_time": queue_element.insertion_time
    }
