import json
import os
from websocket_server import WebsocketServer

PORT = int(os.environ.get("websocket_port")) if os.environ.get("websocket_port") else int(9001)


def on_connect(client, server):
    print(f"New Client with id {client['id']}")
    server.send_message_to_all('{"hi": "a"}')


def on_disconnect(client, server):
    print(f"Client disconnect with id {client['id']}")


def on_recieve(client, server, message):
    print(f"Client with id {client['id']} sent: {message}")
    server.send_message_to_all(message)


def send(message):
    server.send_message_to_all(json.dumps(message))


server = WebsocketServer(port=PORT)
server.set_fn_new_client(on_connect)
server.set_fn_client_left(on_disconnect)
server.set_fn_message_received(on_recieve)
server.run_forever(threaded=False)
