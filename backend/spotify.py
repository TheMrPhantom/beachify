import queue
import spotipy
from spotipy.oauth2 import SpotifyOAuth, SpotifyClientCredentials
from sqlalchemy import true
from database.Queue import Queue
from database.Song import Song
import util
import bwebsocket
from database import Queries
import time


class Spotify:

    def __init__(self, ws: bwebsocket.Websocket, db: Queries.Queries) -> None:
        self.scope = "user-read-playback-state user-modify-playback-state user-read-currently-playing streaming playlist-read-private playlist-read-collaborative"

        self.connector = spotipy.Spotify(
            auth_manager=SpotifyOAuth(scope=self.scope))

        self.auth_manager = SpotifyClientCredentials()
        self.connector = spotipy.Spotify(auth_manager=self.auth_manager)
        self.ws = ws
        self.db = db
        self.currentSong = None
        self.login_state = util.randomString()
        self.default_playlist_song_id = 0
        self.default_playlist = db.get_settings()["defaultPlaylist"]

    def get_token_url(self):
        self.login_state = util.randomString()
        return SpotifyOAuth(scope=self.scope).get_authorize_url(state=self.login_state)

    def check_spotify_connection(self):
        try:
            self.connector.current_user()
        except:
            self.ws.send({"action": "renew_spotify"})

    def set_token(self, token, state):
        if self.login_state == state:
            oauth_object = SpotifyOAuth(scope=self.scope)
            auth_token = oauth_object.get_access_token(
                token, as_dict=False)
            self.connector = spotipy.Spotify(auth=auth_token)
            return True
        else:
            return False

    def checkCurrentSong(self):
        try:
            received_input = self.connector.currently_playing()
            received = util.simplify_spotify_track(received_input['item'])
            received["is_playing"] = received_input["is_playing"]

            if received["trackID"] != self.currentSong:
                self.ws.send({"action": "reload_current_song"})
                self.currentSong = received["trackID"]

        except Exception as a:
            print("checkCurrentSong", a)

    def reset_playlist_song_counter(self):
        self.default_playlist_song_id = 0

    def check_queue_insertion(self):
        queue = self.db.get_queued_songs(only_approved=True)
        if len(queue) > 0:
            if self.currentSong is None or queue[0]["trackID"] == self.currentSong:
                self.check_queue_insertion_forced(queue)
        else:
            self.check_queue_insertion_forced(queue)

    def check_queue_insertion_forced(self, queue=None, skip_song=False):
        if queue is None:
            queue = self.db.get_queued_songs(only_approved=True)
        queueLen = len(queue)
        if queueLen < 2:
            # Curently and or Next playing needed
            songs_to_add = self.fetch_next_playlist_songs(2-len(queue))

            for s in songs_to_add:
                self.db.add_song_to_queue(
                    s["trackID"], approved=True, force_add=True)
        else:
            if self.db.get_settings()["queueState"] == "deactivated":
                songs_to_add = self.fetch_next_playlist_songs(1)

                for s in songs_to_add:
                    self.db.add_song_to_queue(
                        s["trackID"], approved=True, force_add=True)

        if queueLen == 0:
            self.connector.add_to_queue(songs_to_add[0]["trackID"])

        self.add_to_spotify_queue(skip_song=skip_song)

    def fetch_next_playlist_songs(self, amount: int):
        songs = self.connector.playlist_items(playlist_id=self.db.get_settings(
        )["defaultPlaylistID"], limit=amount, offset=self.default_playlist_song_id)
        songs_simplified = []
        for s in songs['items']:
            songs_simplified.append(
                util.simplify_spotify_track(s['track']))
        self.default_playlist_song_id += amount

        self.db.add_songs_to_songlist(songs_simplified)

        return songs_simplified

    def add_to_spotify_queue(self, skip_song=False):
        to_play = self.db.set_next_song_queue()
        try:
            self.connector.add_to_queue(to_play.track_id)
        except Exception as a:
            print("Cant add song to spotify queue", a)
        if skip_song:
            self.connector.next_track()
            self.ws.send({"action": "reload_current_song"})
