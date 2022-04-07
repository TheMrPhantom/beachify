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
        if (ws !== null) {
            ws.onmessage = (e: MessageEvent) => {

                if (Config.DEBUG === true) {
                    console.log(e.data)
                }

                const message = JSON.parse(e.data);
                console.log(message)
                switch (message.action) {
                    case "reload_current_song":
                        doRequest("spotiy/playstate/currentlyPlaying", "GET").then((value) => {
                            if (value.code === 200) {
                                dispatch(setNextSong(value.content))
                            }
                        })
                        doRequest("spotiy/playstate/playing", "GET").then((value) => {
                            if (value.code === 200) {
                                dispatch(setPlaystate(value.content))
                            }
                        })
                        break;
                    case "refreshQueue":
                        doGetRequest("queue/song").then((value: { code: number, content?: any }) => {
                            dispatch(setQueueSongs(value.content))
                        });
                        break;
                }

            };

            ws.onerror = () => {
                setTimeout(() => {
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