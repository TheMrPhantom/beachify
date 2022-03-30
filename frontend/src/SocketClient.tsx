import Config from "./environment.json";
import {doGetRequest} from "./Components/Common/StaticFunctions";
import {setQueueSongs} from "./Actions/QueueAction";
import { useDispatch } from 'react-redux';
import {useState} from "react";

const SocketClient = () => {


    let ws;
    const minTimeout = 10000;
    const maxTimeout = 40000;
    const dispatch = useDispatch();

    const init = () => {

        ws = new WebSocket(Config.WEBSOCKET_URL);


        ws.onmessage = (e:MessageEvent) => {

            if(Config.DEBUG == true) {
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
                init();
            }, Math.random() * (maxTimeout - minTimeout) + minTimeout);
        }
    }

    init();
    return null;
}

export default SocketClient;