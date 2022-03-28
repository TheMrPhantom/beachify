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
                "interpret": song.interpret
            })
        return output

    def flag_queued_songs(self, songs):
        for s in songs:
            search_result = self.session.query(Queue).filter(Queue.song.has(track_id=s["trackID"])).first()
        
            if search_result is None:
                s["alreadyAdded"] = False
            else:
                s["alreadyAdded"] = True

    def upvote_song(self, song_id):
        song: Song = self.session.query(Queue).filter(Queue.song.has(track_id=song_id)).first()
        song.upvotes += 1
        self.session.commit()

    def downvote_song(self, song_id):
        song: Song = self.session.query(Queue).filter(Queue.song.has(track_id=song_id)).first()
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
