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

    def add_song_to_queue(self, song):
        songname = song["songname"]
        album = song["album"]
        trackID = song["trackID"]
        coverURL = song["coverURL"]
        interpret = song["interpret"]
        song = Song(songname=songname, album=album,
                    track_id=trackID, cover_URL=coverURL, interpret=interpret)
        self.session.add(song)
        self.session.commit()

    def get_queued_songs(self):
        songs = self.session.query(Song).all()
        output = []
        for s in songs:
            s: Song = s

            output.append({
                "databaseID": s.id,
                "songname": s.songname,
                "album": s.album,
                "trackID": s.track_id,
                "coverURL": s.cover_URL,
                "upvotes": s.upvotes,
                "downvotes": s.downvotes,
                "interpret": s.interpret
            })
        return output

    def flag_queued_songs(self, songs):
        for s in songs:
            search_result = self.session.query(
                Song).filter_by(track_id=s["trackID"]).first()
            if search_result is None:
                s["alreadyAdded"] = False
            else:
                s["alreadyAdded"] = True

    def upvote_song(self, song_id):
        song: Song = self.session.query(Song).filter_by(id=song_id).first()
        song.upvotes += 1
        self.session.commit()

    def downvote_song(self, song_id):
        song: Song = self.session.query(Song).filter_by(id=song_id).first()
        song.downvotes += 1
        self.session.commit()

    def delete_song(self, song_id):
        song: Song = self.session.query(Song).filter_by(id=song_id).first()
        self.session.delete(song)
        self.session.commit()
    
    def add_song_to_songlist(self, songlist):
        for element in songlist:
            song_from_database = self.session.query(Song).filter_by(track_id=element["track_id"]).first()
            if song_from_database is None:
                songname = element["songname"]
                interpret = element["interpret"]
                album = element["album"]
                track_id = element["trackID"]
                cover_URL = element["coverURL"]

                newSong = Song(songname = songname, interpret = interpret, album = album, track_id = track_id, cover_URL = cover_URL)

                self.session.add(newSong)
                self.session.commit()
