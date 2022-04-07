import { Song } from "../Components/Common/Types"

const initialState: QueueReducerType = {
    songs: [],
    currentlyPlaying: null
}

export type QueueReducerType = {
    songs: Array<Song>,
    currentlyPlaying: Song | null
}


const reducer = (state = initialState, { type, payload }: { type: string, payload: any }) => {

    var newState = { ...state }
    switch (type) {
        case "SET_QUEUE_SONGS":
            newState.songs = payload
            return newState
        case "SET_NEXT_SONG":
            newState.currentlyPlaying = payload
            return newState
        default:
            return state
    }

}
export default reducer
