import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { setQueueSongs } from '../../Actions/QueueAction';
import Config from "../../environment.json";
import { doGetRequest } from './StaticFunctions';

type Props = {}

const SocketClient = (props: Props) => {
    const [ws, setws] = useState(new WebSocket(Config.WEBSOCKET_URL));
    const dispatch = useDispatch();
    const minTimeout = 10000;
    const maxTimeout = 40000;

    useEffect(() => {
        ws.onmessage = (e: MessageEvent) => {

            if (Config.DEBUG === true) {
                console.log(e.data)
            }

            let message = JSON.parse(e.data);

            switch (message.action) {
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

    }, [ws])

    return (
        <></>
    )
}

export default SocketClient