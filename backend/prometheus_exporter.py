import util
import prometheus_client
import spotify
import bwebsocket
import database.Queries


class PrometheusExporter:
    def __init__(self, sp: spotify.Spotify, ws: bwebsocket.Websocket, db: database.Queries.Queries):
        self.metrics = {}
        self.metrics['queue_length_playable'] = prometheus_client.Gauge(
            f'{util.prometheus_prefix}_queue_length_playable', 'Number of songs currently in queue, that are playable')
        self.metrics['queue_length_all'] = prometheus_client.Gauge(
            f'{util.prometheus_prefix}_queue_length_all', 'Total number of songs currently in queue')
        self.metrics['upvotes'] = prometheus_client.Gauge(
            f'{util.prometheus_prefix}_upvotes', 'Number of total upvotes')
        self.metrics['downvotes'] = prometheus_client.Gauge(
            f'{util.prometheus_prefix}_downvotes', 'Number of total downvotes')
        self.metrics['ws_clients'] = prometheus_client.Gauge(
            f'{util.prometheus_prefix}_ws_clients', 'Number current websocket connections')

        self.sp = sp
        self.ws = ws
        self.db = db

        prometheus_client.start_http_server(util.prometheus_port)

    def update_metrics(self):
        print("Updating prometheus metrics")
        queued_songs = self.db.get_queued_songs()
        queued_songs_approved = self.db.get_queued_songs(only_approved=True)
        self.metrics['queue_length_all'].set(len(queued_songs))
        self.metrics['queue_length_playable'].set(len(queued_songs_approved))
        upvotes = 0
        downvotes = 0

        for s in queued_songs:
            upvotes += s['upvotes']
            downvotes += s['downvotes']

        self.metrics['upvotes'].set(upvotes)
        self.metrics['downvotes'].set(downvotes)
        self.metrics['ws_clients'].set(self.ws.active_connections)
        pass
