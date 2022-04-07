import spotipy
from spotipy.oauth2 import SpotifyOAuth, SpotifyClientCredentials
import util
import websocket


class Spotify:

    def __init__(self, ws: websocket.Websocket) -> None:
        self.scope = "user-read-playback-state user-modify-playback-state user-read-currently-playing streaming playlist-read-private playlist-read-collaborative"

        self.connector = spotipy.Spotify(
            auth_manager=SpotifyOAuth(scope=self.scope))

        self.auth_manager = SpotifyClientCredentials()
        self.connector = spotipy.Spotify(auth_manager=self.auth_manager)
        self.ws = ws
        self.currentSong = None

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
