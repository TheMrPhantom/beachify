import queue
from authenticator import TokenManager
import util
from datetime import datetime, timedelta
import os
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import session
from sqlalchemy.sql import func
from database.Models import *
from functools import cmp_to_key

from typing import List
import constants


class Queries:
    def __init__(self, db):

        self.db: SQLAlchemy = db
        self.session: session.Session = self.db.session
        self.db.create_all()

    def add_song_to_queue(self, songID):
        if self.session.query(Queue).filter(
                Queue.song.has(track_id=songID)).first() is not None:
            return False
        search_result: Song = self.session.query(
            Song).filter_by(track_id=songID).first()
        first = self.session.query(Queue).filter_by(fixed_place=0).first()
        second = self.session.query(Queue).filter_by(fixed_place=1).first()

        queue_element = None
        if first is None:
            queue_element = Queue(song_id=search_result.id, fixed_place=0)
        else:
            if second is None:
                queue_element = Queue(song_id=search_result.id, fixed_place=1)
            else:
                queue_element = Queue(song_id=search_result.id)

        self.session.add(queue_element)
        self.session.commit()
        return True

    def get_queued_songs(self):
        songs = self.session.query(Queue).filter_by(fixed_place=-1).all()
        trust_mode_on = self.session.query(Setting).filter_by(
            key="trust_mode").first() == "trusted"
        output = []
        for s in songs:
            queueElement: Queue = s
            song: Song = queueElement.song

            output.append(util.format_song(queueElement, song, trust_mode_on))

        def compare(s1, s2):
            waiting_time_s1 = (
                datetime.now()-s1["insertion_time"]).total_seconds()
            waiting_time_s2 = (
                datetime.now()-s2["insertion_time"]).total_seconds()

            def song_value(w, u, d):
                return (w/240)+u-d*2

            return song_value(waiting_time_s2, s2["upvotes"], s2["downvotes"])-song_value(waiting_time_s1, s1["upvotes"], s1["downvotes"])

        output.sort(key=cmp_to_key(compare))

        for o in output:
            del o["insertion_time"]

        first: Queue = self.session.query(
            Queue).filter_by(fixed_place=0).first()
        second: Queue = self.session.query(
            Queue).filter_by(fixed_place=1).first()
        final_output = []

        if first is not None:
            f = util.format_song(
                first, first.song, trust_mode_on)
            del f["insertion_time"]
            final_output.append(f)

            if second is not None:
                s = util.format_song(
                    second, second.song, trust_mode_on)
                del s["insertion_time"]
                final_output.append(s)

        final_output.extend(output)

        time_elapsed = 0
        for song in final_output:
            song["startsAt"] = util.toNumberDateTime(datetime.now(
            )+timedelta(milliseconds=time_elapsed))
            time_elapsed += song["duration"]

        return final_output

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
                duration = element["duration"]
                newSong = Song(songname=songname, interpret=interpret,
                               album=album, track_id=track_id, cover_URL=cover_URL, duration=duration)

                self.session.add(newSong)
                self.session.commit()

    def adding_song_to_queue_possible(self):
        self.session.query(Setting).filter_by(key="")

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
