import { Song } from "../Components/Common/Types"


export const setQueueSongs = (songs: Array<Song>) => {
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