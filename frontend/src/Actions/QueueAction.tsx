import { Song } from "../Components/Common/Types"
import Cookies from 'js-cookie';
import { doGetRequest } from "../Components/Common/StaticFunctions";

export const setQueueSongs = (songs: Array<Song>) => {
    return {
        type: "SET_QUEUE_SONGS",
        payload: songs
    }
}

export const setNextSong = (song: Song) => {
    const votedSongs = Cookies.get("voted-songs")

    const newCookie = votedSongs?.replace(";" + song.trackID, "")
    Cookies.set("voted-songs", newCookie ? newCookie : "")

    return {
        type: "SET_NEXT_SONG",
        payload: song
    }
}