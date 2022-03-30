import queue
from authenticator import TokenManager
import util
from datetime import datetime, timedelta
import os
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import session
from sqlalchemy.sql import func
from database.Models import *

from typing import List
import constants


class Queries:
    def __init__(self, db):

        self.db: SQLAlchemy = db
        self.session: session.Session = self.db.session
        self.db.create_all()

    def add_song_to_queue(self, songID):
        search_result: Song = self.session.query(
            Song).filter_by(track_id=songID).first()
        queue_element = Queue(song_id=search_result.id)
        self.session.add(queue_element)
        self.session.commit()

    def get_queued_songs(self):
        songs = self.session.query(Queue).all()
        output = []
        for s in songs:
            queueElement: Queue = s
            song: Song = queueElement.song

            output.append({
                "databaseID": song.id,
                "songname": song.songname,
                "album": song.album,
                "trackID": song.track_id,
                "coverURL": song.cover_URL,
                "upvotes": queueElement.upvotes,
                "downvotes": queueElement.downvotes,
                "interpret": song.interpret,
                "approvalPending": queueElement.approval_pending
            })
        return output

    def flag_queued_songs(self, songs):
        for s in songs:
            search_result = self.session.query(Queue).filter(
                Queue.song.has(track_id=s["trackID"])).first()

            if search_result is None:
                s["alreadyAdded"] = False
            else:
                s["alreadyAdded"] = True

    def upvote_song(self, song_id):
        song: Song = self.session.query(Queue).filter(
            Queue.song.has(track_id=song_id)).first()
        song.upvotes += 1
        self.session.commit()

    def downvote_song(self, song_id):
        song: Song = self.session.query(Queue).filter(
            Queue.song.has(track_id=song_id)).first()
        song.downvotes += 1
        self.session.commit()

    def delete_song(self, song_id):
        song: Song = self.session.query(Song).filter_by(id=song_id).first()
        self.session.delete(song)
        self.session.commit()

    def add_song_to_songlist(self, songlist):
        for element in songlist:
            song_from_database = self.session.query(Song).filter_by(
                track_id=element["trackID"]).first()
            if song_from_database is None:
                songname = element["songname"]
                interpret = element["interpret"]
                album = element["album"]
                track_id = element["trackID"]
                cover_URL = element["coverURL"]

                newSong = Song(songname=songname, interpret=interpret,
                               album=album, track_id=track_id, cover_URL=cover_URL)

                self.session.add(newSong)
                self.session.commit()

    def insert_default_settings(self):
        list_mode = os.environ.get(
            "list_mode") if os.environ.get("list_mode") else "blacklist"
        trust_mode = os.environ.get(
            "trust_mode") if os.environ.get("trust_mode") else "untrusted"
        default_playlist = os.environ.get(
            "default_playlist") if os.environ.get("default_playlist") else ""
        default_playlist_active = os.environ.get(
            "default_playlist_active") if os.environ.get("default_playlist_active") else "false"
        guest_token = os.environ.get(
            "guest_token") if os.environ.get("guest_token") else "beachify"
        waiting_time = os.environ.get(
            "waiting_time") if os.environ.get("waiting_time") else "60"
        default_ban_time = os.environ.get(
            "default_ban_time") if os.environ.get("default_ban_time") else "3600"
        queue_state = os.environ.get(
            "queue_state") if os.environ.get("queue_state") else "true"
        queue_submitable = os.environ.get(
            "queue_submitable") if os.environ.get("queue_submitable") else "true"
        retention_time = os.environ.get(
            "retention_time") if os.environ.get("retention_time") else "360"

        self.session.add(
            Setting(key="list_mode", value=list_mode))
        self.session.add(
            Setting(key="trust_mode", value=trust_mode))
        self.session.add(
            Setting(key="default_playlist", value=default_playlist))
        self.session.add(
            Setting(key="default_playlist_active",
                    value=default_playlist_active))
        self.session.add(
            Setting(key="guest_token", value=guest_token))
        self.session.add(
            Setting(key="waiting_time", value=waiting_time))
        self.session.add(
            Setting(key="default_ban_time", value=default_ban_time))
        self.session.add(
            Setting(key="queue_state", value=queue_state))
        self.session.add(
            Setting(key="queue_submitable", value=queue_submitable))
        self.session.add(
            Setting(key="retention_time", value=retention_time))

        self.session.commit()
