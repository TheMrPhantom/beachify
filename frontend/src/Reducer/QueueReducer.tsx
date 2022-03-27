import { Song } from "../Components/Common/Types"

const initialState: QueueReducerType = {
    songs: []
}

export type QueueReducerType = {
    songs: Array<Song>
}


const reducer = (state = initialState, { type, payload }: { type: string, payload: any }) => {

    var newState = { ...state }
    switch (type) {
        case "SET_QUEUE_SONGS":
            newState.songs = payload
            return newState
        default:
            return state
    }

}
export default reducer
