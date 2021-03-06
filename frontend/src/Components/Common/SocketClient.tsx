import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { setNextSong, setQueueSongs } from '../../Actions/QueueAction';
import { setPlaystate } from '../../Actions/SettingsAction';
import Config from "../../environment.json";
import { doGetRequest, doRequest } from './StaticFunctions';

type Props = {}

const SocketClient = (props: Props) => {
    const [ws, setws] = useState<WebSocket | null>(null);
    const dispatch = useDispatch();
    const minTimeout = 10000;
    const maxTimeout = 40000;

    useEffect(() => {
        setws(new WebSocket(Config.WEBSOCKET_URL))

    }, [])

    useEffect(() => {
        const closeWs = () => {
            try {
                if (ws !== null) {
                    ws.close()
                }
            }
            catch (e) {
                console.log(e);
            }
        }

        if (ws !== null) {
            ws.onmessage = (e: MessageEvent) => {

                if (Config.DEBUG === true) {
                    console.log(e.data)
                }

                const message = JSON.parse(e.data);
                console.log(message)
                switch (message.action) {
                    case "reload_current_song":
                        doRequest("spotify/playstate/currentlyPlaying", "GET").then((value) => {
                            if (value.code === 200) {
                                dispatch(setNextSong(value.content))
                            }
                        })
                        doRequest("spotify/playstate/playing", "GET").then((value) => {
                            if (value.code === 200) {
                                dispatch(setPlaystate(value.content))
                            }
                        })
                        break;
                    case "reload_queue":
                        doGetRequest("queue/song").then((value: { code: number, content?: any }) => {
                            if (value.code === 200) {
                                dispatch(setQueueSongs(value.content))
                            }
                        });
                        break;
                    case "renew_spotify":
                        if (window.location.pathname.includes("admin"))
                            doGetRequest("spotify/authorize/automatic").then(value => {
                                if (value.code === 200) {
                                    window.location = value.content
                                }
                            })
                        break;
                }

            };

            ws.onerror = () => {
                setTimeout(() => {
                    closeWs()
                    setws(new WebSocket(Config.WEBSOCKET_URL));
                }, Math.random() * (maxTimeout - minTimeout) + minTimeout);
            }

            ws.onclose = () => {
                setTimeout(() => {
                    closeWs()
                    setws(new WebSocket(Config.WEBSOCKET_URL));
                }, Math.random() * (maxTimeout - minTimeout) + minTimeout);
            }

        }
    }, [dispatch, ws])

    return (
        <></>
    )
}

export default SocketClient