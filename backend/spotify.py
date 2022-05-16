import queue
import spotipy
from spotipy.oauth2 import SpotifyOAuth, SpotifyClientCredentials
from sqlalchemy import false, true
from database.Queue import Queue
from database.Song import Song
import util
import bwebsocket
from database import Queries
import time
from threading import Lock


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
        self.critical_function_lock = Lock()
        self.critical_function_lock_2 = Lock()
        self.wl_songs = None

    def get_token_url(self, show_dialog=False):
        self.login_state = util.randomString()
        return SpotifyOAuth(scope=self.scope, show_dialog=show_dialog).get_authorize_url(state=self.login_state)

    def check_spotify_connection(self):
        print("Checking spotify connection")
        try:
            self.connector.current_user()
        except:
            print("Error in spotify Line 42: Cant get current user")
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
        print("Checking current song")
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
        print("Checking if song should be inserted")
        try:
            queue = self.db.get_queued_songs(only_approved=True)
            if len(queue) > 0:
                if self.currentSong is None or queue[0]["trackID"] == self.currentSong:
                    self.check_queue_insertion_forced(queue)
            else:
                self.check_queue_insertion_forced(queue)
        except Exception as e:
            print("Error in spotify Line 82:", e)

    def check_queue_insertion_forced(self, queue=None, skip_song=False):
        with self.critical_function_lock:
            if queue is None:
                queue = self.db.get_queued_songs(only_approved=True)
            queueLen = len(queue)
            is_trust_mode = self.db.get_settings()[
                "trustMode"] == "approval"
            songs_to_add = []
            if queueLen < 2:
                # Curently and or Next playing needed
                songs_to_add = None

                if len(queue) == 0:
                    songs_to_add = self.fetch_next_playlist_songs(3)

                else:
                    songs_to_add = self.fetch_next_playlist_songs(1)

                for s in songs_to_add:
                    self.db.add_song_to_queue(
                        s["trackID"], approved=True, force_add=True)
            else:
                if self.db.get_settings()["queueState"] == "deactivated":
                    songs_to_add = self.fetch_next_playlist_songs(1)

                    for s in songs_to_add:
                        self.db.add_song_to_queue(
                            s["trackID"], approved=True, force_add=True)

            if queueLen == 0 and not is_trust_mode:
                self.add_to_spotify_queue(skip_song=not skip_song)

            self.add_to_spotify_queue(skip_song=skip_song)
            self.ws.trigger_reload_queue()
            self.ws.trigger_reload_next()

    def fetch_next_playlist_songs(self, amount: int):
        songs_simplified = self.try_fetch_songs(amount)
        if len(songs_simplified) != amount:
            print("No more songs in playlist, starting again",
                  amount, "!=", len(songs_simplified))
            self.default_playlist_song_id = 0
            songs_simplified = self.try_fetch_songs(amount)
        self.default_playlist_song_id += amount

        self.db.add_songs_to_songlist(songs_simplified)

        return songs_simplified

    def try_fetch_songs(self, amount: int):
        songs = self.connector.playlist_items(playlist_id=self.db.get_settings(
        )["defaultPlaylistID"], limit=amount, offset=self.default_playlist_song_id)
        songs_simplified = []
        for s in songs['items']:
            songs_simplified.append(
                util.simplify_spotify_track(s['track']))
        return songs_simplified

    def get_all_wl_songs(self, renew=False):
        with self.critical_function_lock_2:
            if self.wl_songs is not None and not renew:
                return self.wl_songs

            songs = []
            next = True
            offset = 0

            while next:
                songs_temp = self.connector.playlist_items(playlist_id=self.db.get_settings(
                )["whitelistPlaylistID"], limit=50, offset=offset)
                offset += 50
                print("Loading song", offset)
                for s in songs_temp['items']:
                    if s['track'] is not None:
                        songs.append(
                            util.simplify_spotify_track(s['track']))
                if len(songs_temp['items']) < 50:
                    next = False

            self.wl_songs = songs
            return self.wl_songs

    def add_to_spotify_queue(self, skip_song=False):
        to_play = self.db.set_next_song_queue()
        try:
            print(f"Song {to_play.songname} added to queue")
            self.connector.add_to_queue(to_play.track_id)
        except Exception as a:
            print("Cant add song to spotify queue", a)
        if skip_song:
            self.connector.next_track()
            self.ws.send({"action": "reload_current_song"})
