const initialState: SettingsType = {
    listMode: "",
    trustMode: "",
    defaultPlaylist: "",
    guestToken: "",
    waitingTime: "",
    defaultBanTime: "",
    queueState: "",
    queueSubmittable: "",
    retentionTime: ""
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
    retentionTime: string
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
            newState.listMode = payload
            return newState
        case "SET_DF_PLAYLIST":
            newState.listMode = payload
            return newState
        case "SET_GUEST_TOKEN":
            newState.listMode = payload
            return newState
        case "SET_WAITING_TIME":
            newState.listMode = payload
            return newState
        case "SET_DEFAULT_BANTIME":
            newState.listMode = payload
            return newState
        case "SET_QUEUE_STATE":
            newState.listMode = payload
            return newState
        case "SET_QUEUESUBMITTABLE":
            newState.listMode = payload
            return newState
        case "SET_RETENTIONTIME":
            newState.listMode = payload
            return newState
        default:
            return state
    }

}
export default reducer
