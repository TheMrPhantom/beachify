import { SettingsType } from "../Reducer/SettingsReducer"


export const setAllSettings = (settings: SettingsType) => {
    return {
        type: "SET_ALL",
        payload: settings
    }
}

export const setListmode = (setting: string) => {
    return {
        type: "SET_LISTMODE",
        payload: setting
    }
}


export const setTrustmode = (setting: string) => {
    return {
        type: "SET_TRUSTMODE",
        payload: setting
    }
}


export const setDefaultplaylist = (setting: string) => {
    return {
        type: "SET_DF_PLAYLIST",
        payload: setting
    }
}

export const setPlaystate = (setting: boolean) => {
    return {
        type: "SET_IS_PLAYING",
        payload: setting
    }
}

export const setGuestToken = (setting: string) => {
    return {
        type: "SET_GUEST_TOKEN",
        payload: setting
    }
}


export const setWaitingTime = (setting: string) => {
    return {
        type: "SET_WAITING_TIME",
        payload: setting
    }
}


export const setDefaultBantime = (setting: string) => {
    return {
        type: "SET_DEFAULT_BANTIME",
        payload: setting
    }
}


export const setQueueState = (setting: string) => {
    return {
        type: "SET_QUEUE_STATE",
        payload: setting
    }
}

export const setQueueSubmittable = (setting: string) => {
    return {
        type: "SET_QUEUESUBMITTABLE",
        payload: setting
    }
}

export const setRetentionTime = (setting: string) => {
    return {
        type: "SET_RETENTIONTIME",
        payload: setting
    }
}
