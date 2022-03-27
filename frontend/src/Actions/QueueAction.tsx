import { Song } from "../Components/Common/Types"


export const setQueueSongs = (songs: Array<Song>) => {
    return {
        type: "SET_QUEUE_SONGS",
        payload: songs
    }
}
