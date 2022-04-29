import queue
import spotipy
from spotipy.oauth2 import SpotifyOAuth, SpotifyClientCredentials
from sqlalchemy import true
from database.Queue import Queue
from database.Song import Song
import util
import bwebsocket
from database import Queries


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

            if received != self.currentSong:
                self.ws.send({"action": "reload_current_song"})
                self.currentSong = received

        except Exception as a:
            print("checkCurrentSong", a)

    def check_queue_insertion(self):
        try:
            queue = self.db.get_queued_songs()
            if len(queue) > 0:
                if self.currentSong is None or queue[0]["trackID"] == self.currentSong["trackID"]:

                    self.connector.current_user()
                    song: Song = self.db.set_next_song_queue()
                    self.currentSong = song
                    self.connector.add_to_queue(song.track_id)
                    self.ws.send({"action": "reload_queue"})
            else:
                # Add from default playlist
                    
                pass
        except Exception as a:
            print("check_queue_insertion", a)
