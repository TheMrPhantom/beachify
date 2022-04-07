const initialState: SettingsType = {
    listMode: "",
    trustMode: "",
    defaultPlaylist: "",
    guestToken: "",
    waitingTime: "",
    defaultBanTime: "",
    queueState: "",
    queueSubmittable: "",
    retentionTime: "",
    is_playing: false
}

export type SettingsType = {
    listMode: string,
    trustMode: string,
    defaultPlaylist: string,
    guestToken: string,
    waitingTime: string,
    defaultBanTime: string,
    queueState: string,
    queueSubmittable: string,
    retentionTime: string,
    is_playing: boolean
}


const reducer = (state = initialState, { type, payload }: { type: string, payload: any }) => {

    var newState = { ...state }
    switch (type) {
        case "SET_ALL":
            newState = payload
            return newState
        case "SET_LISTMODE":
            newState.listMode = payload
            return newState
        case "SET_TRUSTMODE":
            newState.trustMode = payload
            return newState
        case "SET_DF_PLAYLIST":
            newState.defaultPlaylist = payload
            return newState
        case "SET_GUEST_TOKEN":
            newState.guestToken = payload
            return newState
        case "SET_WAITING_TIME":
            newState.waitingTime = payload
            return newState
        case "SET_DEFAULT_BANTIME":
            newState.defaultBanTime = payload
            return newState
        case "SET_QUEUE_STATE":
            newState.queueState = payload
            return newState
        case "SET_QUEUESUBMITTABLE":
            newState.queueSubmittable = payload
            return newState
        case "SET_RETENTIONTIME":
            newState.retentionTime = payload
            return newState
        case "SET_IS_PLAYING":
            newState.is_playing = payload
            return newState
        default:
            return state
    }

}
export default reducer
