import queue
import spotipy
from spotipy.oauth2 import SpotifyOAuth, SpotifyClientCredentials
from database.Queue import Queue
from database.Song import Song
import util
import websocket
from database import Queries


class Spotify:

    def __init__(self, ws: websocket.Websocket, db: Queries.Queries) -> None:
        self.scope = "user-read-playback-state user-modify-playback-state user-read-currently-playing streaming playlist-read-private playlist-read-collaborative"

        self.connector = spotipy.Spotify(
            auth_manager=SpotifyOAuth(scope=self.scope))

        self.auth_manager = SpotifyClientCredentials()
        self.connector = spotipy.Spotify(auth_manager=self.auth_manager)
        self.ws = ws
        self.db = db
        self.currentSong = None

    def get_token_url(self):
        return SpotifyOAuth(scope=self.scope).get_authorize_url()

    def set_token(self, token):
        oauth_object = SpotifyOAuth(scope=self.scope)
        auth_token = oauth_object.get_access_token(
            token, as_dict=False)
        self.connector = spotipy.Spotify(auth=auth_token)

    def checkCurrentSong(self):
        try:
            received_input = self.connector.currently_playing()
            received = util.simplify_spotify_track(received_input['item'])
            received["is_playing"] = received_input["is_playing"]

            if received != self.currentSong:
                self.ws.send({"action": "reload_current_song"})
                self.currentSong = received

        except Exception as a:
            print(a)

    def check_queue_insertion(self):
        try:
            queue = self.db.get_queued_songs()
            if len(queue) > 1:
                if queue[1]["trackID"] == self.currentSong["trackID"]:
                    song: Song = self.db.set_next_song_queue()
                    self.connector.add_to_queue(song.track_id)
                    self.ws.send({"action": "reload_queue"})
        except Exception as a:
            print(a)
