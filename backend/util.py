from datetime import datetime
import string
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
            "songname": songname,
            "duration": duration
    }
    """
    songs = song["tracks"]["items"]
    output = []

    for s in songs:
        output.append(simplify_spotify_track(s))
    return output


def simplify_spotify_track(song):
    return {
        "trackID": song["uri"],
        "album": song["album"]["name"],
        "coverURL": song["album"]["images"][1]["url"],
        "interpret": song["artists"][0]["name"],
        "songname": song["name"],
        "duration": song["duration_ms"]}


def log(prefix, message):
    if logging_enabled:
        time = datetime.datetime.now().strftime("%x %X")
        output_string = f"[{time}] {prefix} -> {message}"
        with open("logs/log.txt", 'a+') as f:
            f.write(f"{output_string}\n")


def format_song(queue_element: Queue, song: Song, trust_mode_on: bool, cant_add_reason: string):
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
        "duration": song.duration,
        "insertion_time": queue_element.insertion_time,
        "cant_add_reason": cant_add_reason
    }


def toJSDateTime(time: datetime.datetime):
    return time.strftime("%Y-%m-%dT%H:%M:%S.000Z")


def toNumberDateTime(time: datetime.datetime):
    return time.timestamp()*1000
