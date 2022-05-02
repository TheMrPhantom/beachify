import { Song } from "../Components/Common/Types"
import Cookies from 'js-cookie';

export const setQueueSongs = (songs: Array<Song>) => {
    const oldCookie = Cookies.get("voted-songs");
    var newCookie = "";

    songs.forEach(song => {
        if (oldCookie?.includes(song.trackID)) {
            newCookie += ";" + song.trackID
        }
    })

    Cookies.set("voted-songs", newCookie ? newCookie : "")

    return {
        type: "SET_QUEUE_SONGS",
        payload: songs
    }
}

export const setNextSong = (song: Song) => {
    return {
        type: "SET_NEXT_SONG",
        payload: song
    }
}