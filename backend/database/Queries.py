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
        self.insert_default_settings()

    def add_song_to_queue(self, songID, approved=False, force_add=False):
        if self.session.query(Queue).filter(
                Queue.song.has(track_id=songID)).first() is not None:

            if force_add:
                self.session.delete(self.session.query(Queue).filter(
                    Queue.song.has(track_id=songID)).first())
                self.session.commit()
            else:
                print("Couldnt add song! Song already in Queue Table.", songID)
                return False

        search_result: Song = self.session.query(
            Song).filter_by(track_id=songID).first()
        first = self.session.query(Queue).filter_by(is_next_song=True).first()
        trust_mode_on = self.session.query(Setting).filter_by(
            key="trust_mode").first().value == "approval"
        queue_element = None
        if first is None and not trust_mode_on:
            queue_element = Queue(
                song_id=search_result.id, is_next_song=True, approval_pending=(not approved), is_default_song=force_add)
        else:
            queue_element = Queue(song_id=search_result.id,
                                  approval_pending=(not approved), is_default_song=force_add)

        self.session.add(queue_element)
        self.session.commit()
        return True

    def get_queued_songs(self, only_approved=False):
        songs = self.session.query(Queue).filter_by(
            is_next_song=False, played_time=None).all()
        trust_mode_on = self.session.query(Setting).filter_by(
            key="trust_mode").first().value == "approval"
        queue_activated = self.session.query(Setting).filter_by(
            key="queue_state").first().value == "activated"
        output = []

        for s in songs:
            queueElement: Queue = s
            song: Song = queueElement.song

            output.append(util.format_song(
                queueElement, song, trust_mode_on, None))

        def compare(s1, s2):
            waiting_time_s1 = (
                datetime.now()-s1["insertion_time"]).total_seconds()
            waiting_time_s2 = (
                datetime.now()-s2["insertion_time"]).total_seconds()

            def song_value(w, u, d, approval_pending, default_song):
                minus_for_pending = - \
                    10000000000 if ((
                        approval_pending or not queue_activated or u <= d) and not default_song) else 0
                return ((w/240)+u-d*2)+minus_for_pending

            return song_value(waiting_time_s2,
                              s2["upvotes"],
                              s2["downvotes"],
                              s2["approvalPending"],
                              s2["defaultSong"]
                              )-song_value(waiting_time_s1,
                                           s1["upvotes"],
                                           s1["downvotes"],
                                           s1["approvalPending"],
                                           s1["defaultSong"]
                                           )

        output.sort(key=cmp_to_key(compare))

        try:
            next: Queue = self.session.query(
                Queue).filter_by(is_next_song=True).first()
            d = util.format_song(
                next, next.song, trust_mode_on, None)

            output.insert(0, d)
        except Exception as a:
            print("get_queued_songs", a)

        try:
            time_elapsed = output[0]["duration"]
            for song in output[1:]:
                song["startsAt"] = util.toNumberDateTime(datetime.now(
                )+timedelta(milliseconds=time_elapsed))
                time_elapsed += song["duration"]
        except:
            print("Queue Empty")

        if only_approved:
            output = list(
                filter(lambda x: ((not x["approvalPending"]) and x["upvotes"] > x["downvotes"] and datetime.now()-x["insertion_time"] > timedelta(minutes=5)) or x["defaultSong"], output))

        for o in output:
            o["insertion_time"] = datetime.strftime(
                o["insertion_time"], '%Y-%m-%dT%H:%M:%S.000Z')

        return output

    def flag_queued_songs(self, songs):
        for s in songs:
            search_result_queue = self.session.query(Queue).filter(
                Queue.song.has(track_id=s["trackID"])).first()
            search_result_ban = self.session.query(Ban).filter_by(
                track_id=s["trackID"]).first()

            if search_result_queue is None:
                s["alreadyAdded"] = False
            else:
                s["alreadyAdded"] = True

            if search_result_ban is None:
                s["banned"] = False
            else:
                s["banned"] = True

    def upvote_song(self, song_id, user_ip):
        song: Queue = self.session.query(Queue).filter(
            Queue.song.has(track_id=song_id)).first()
        if user_ip not in song.voted_by:
            song.upvotes += 1
            song.voted_by += user_ip
            self.session.commit()
            util.delete_song_if_bad_votes(song=song, session=self.session)
            return True
        else:
            return False

    def downvote_song(self, song_id, user_ip):
        song: Queue = self.session.query(Queue).filter(
            Queue.song.has(track_id=song_id)).first()
        if user_ip not in song.voted_by:
            song.downvotes += 1
            song.voted_by += user_ip
            self.session.commit()
            util.delete_song_if_bad_votes(song=song, session=self.session)
            return True
        else:
            return False

    def delete_song(self, song_id):
        song: Song = self.session.query(Song).filter_by(id=song_id).first()
        self.session.delete(song)
        self.session.commit()

    def add_songs_to_songlist(self, songlist):
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

    def adding_song_to_queue_possible(self, song_id=None):
        queue_enabled = self.session.query(Setting).filter_by(
            key="queue_submittable").first().value == "activated"
        song_not_banned = True
        if song_id is not None:
            song_not_banned = self.session.query(Ban).filter_by(
                track_id=song_id).first() is None

        if not queue_enabled:
            return 1
        if not song_not_banned:
            return 2

        return 0

    def check_secret(self, secret):
        if secret is None:
            return False
        return self.session.query(Setting).filter_by(key="guest_token").first().value == secret

    def set_settings(self, value, setting_name):
        setting: Setting = self.session.query(
            Setting).filter_by(key=setting_name).first()
        if setting_name is None:
            self.session.add(Setting(key=setting_name, value=value))
        else:
            setting.value = value
        self.session.commit()

    def get_settings(self):
        settings = self.session.query(Setting).all()

        settings_map = {}

        for element in settings:
            settings_map[element.key] = element

        return {
            "listMode": settings_map["list_mode"].value,
            "trustMode": settings_map["trust_mode"].value,
            "defaultPlaylist": settings_map["default_playlist"].value,
            "defaultPlaylistID": settings_map["default_playlist_id"].value,
            "whitelistPlaylist": settings_map["whitelist_playlist"].value,
            "whitelistPlaylistID": settings_map["whitelist_playlist_id"].value,
            "guestToken": settings_map["guest_token"].value,
            "waitingTime": settings_map["waiting_time"].value,
            "defaultBanTime": settings_map["default_ban_time"].value,
            "queueState": settings_map["queue_state"].value,
            "queueSubmittable": settings_map["queue_submittable"].value,
            "retentionTime": settings_map["retention_time"].value
        }

    def delete_old_songs_from_queue(self):
        print("Deleting old songs from queue")
        try:
            retention_time = int(self.session.query(
                Setting).filter_by(key="retention_time").first().value)
            songs = self.session.query(Queue).all()

            for element in songs:
                song: Queue = element

                if song.insertion_time + timedelta(minutes=retention_time) < datetime.now():
                    self.session.delete(song)

            self.session.commit()
        except Exception as e:
            print("Error in Queries Line 254:", e)

    def delete_played_songs_from_queue(self):
        waiting_time = int(self.session.query(
            Setting).filter_by(key="waiting_time").first().value)
        songs = self.session.query(Queue).all()

        for element in songs:
            song: Queue = element
            if song.played_time is not None:
                if song.insertion_time + timedelta(minutes=waiting_time) < datetime.now():
                    self.session.delete(song)

        self.session.commit()

    def set_next_song_queue(self) -> Song:
        trust_mode_on = self.session.query(Setting).filter_by(
            key="trust_mode").first().value == "approval"
        try:
            next: Queue = self.session.query(
                Queue).filter_by(is_next_song=True).first()
            next.is_next_song = False
            next.played_time = datetime.now()
            self.session.commit()
        except:
            print("No last next song")

        add_to_queue = None
        try:
            queue = self.get_queued_songs()

            add_to_queue: Queue = self.session.query(Queue).filter(
                Queue.song.has(
                    track_id=queue[0]["trackID"])
            ).first()

            approval_pending = add_to_queue.approval_pending if trust_mode_on else False
            if not approval_pending:
                add_to_queue.is_next_song = True

            self.session.commit()
        except:
            util.log("Info", "Queue is empty, cant set next song")

        return add_to_queue.song if add_to_queue is not None else None

    def delete_song_from_queue(self, song_id):
        first_song: Queue = self.session.query(Queue).filter(
            Queue.song.has(track_id=song_id)).first()
        first_song.played_time = datetime.now()
        self.session.commit()

    def ban_song(self, song_id):
        self.session.add(Ban(track_id=song_id))
        self.session.commit()

    def delete_old_songs_from_ban(self):
        print("Deleting old songs from ban list")
        try:
            retention_time = int(self.session.query(
                Setting).filter_by(key="default_ban_time").first().value)
            songs = self.session.query(Ban).all()

            for element in songs:
                song: Ban = element

                if song.ban_time + timedelta(minutes=retention_time) < datetime.now():
                    self.session.delete(song)

            self.session.commit()
        except Exception as e:
            print("Error in Queries Line 325:", e)

    def approve_song(self, track_id):
        song: Queue = self.session.query(Queue).filter(
            Queue.song.has(track_id=track_id)).first()
        song.approval_pending = False
        if self.session.query(Queue).filter_by(is_next_song=True).first() is None:
            self.set_next_song_queue()
        self.session.commit()

    def get_database_song_id(self, track_id):
        queue: Queue = self.session.query(Queue).filter(
            Queue.song.has(track_id=track_id)).first()
        song: Song = queue.song
        return song.id

    def reset_queue(self):
        queue_elements = self.session.query(Queue).all()
        for q_e in queue_elements:
            self.session.delete(q_e)
        self.session.commit()

    def insert_default_settings(self):
        if self.session.query(Setting).first() is not None:
            return

        list_mode = os.environ.get(
            "list_mode") if os.environ.get("list_mode") else "blacklist"
        trust_mode = os.environ.get(
            "trust_mode") if os.environ.get("trust_mode") else "no_approval"
        default_playlist = os.environ.get(
            "default_playlist") if os.environ.get("default_playlist") else "6YP7NneFapA2Ynglzb3v2a"
        whitelist_playlist = os.environ.get(
            "whitelist_playlist") if os.environ.get("whitelist_playlist") else "6YP7NneFapA2Ynglzb3v2a"
        guest_token = os.environ.get(
            "guest_token") if os.environ.get("guest_token") else "beachify"
        waiting_time = os.environ.get(
            "waiting_time") if os.environ.get("waiting_time") else "60"
        default_ban_time = os.environ.get(
            "default_ban_time") if os.environ.get("default_ban_time") else "3600"
        queue_state = os.environ.get(
            "queue_state") if os.environ.get("queue_state") else "activated"
        queue_submittable = os.environ.get(
            "queue_submittable") if os.environ.get("queue_submittable") else "activated"
        retention_time = os.environ.get(
            "retention_time") if os.environ.get("retention_time") else "360"

        self.session.add(
            Setting(key="list_mode", value=list_mode))
        self.session.add(
            Setting(key="trust_mode", value=trust_mode))
        self.session.add(
            Setting(key="default_playlist", value=default_playlist))
        self.session.add(
            Setting(key="default_playlist_id", value=default_playlist))
        self.session.add(
            Setting(key="whitelist_playlist", value=whitelist_playlist))
        self.session.add(
            Setting(key="whitelist_playlist_id", value=whitelist_playlist))
        self.session.add(
            Setting(key="guest_token", value=guest_token))
        self.session.add(
            Setting(key="waiting_time", value=waiting_time))
        self.session.add(
            Setting(key="default_ban_time", value=default_ban_time))
        self.session.add(
            Setting(key="queue_state", value=queue_state))
        self.session.add(
            Setting(key="queue_submittable", value=queue_submittable))
        self.session.add(
            Setting(key="retention_time", value=retention_time))

        self.session.commit()
