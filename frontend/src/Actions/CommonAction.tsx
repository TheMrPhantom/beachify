import { AlertColor } from "@mui/material"
import { SettingsType } from "../Reducer/SettingsReducer"


export const openToast = (settings: {
    message: string,
    duration?: number,
    type?: AlertColor,
    jsxElement?: JSX.Element
}) => {
    return {
        type: "OPEN_TOAST",
        payload: settings
    }
}

export const closeToast = () => {
    return {
        type: "CLOSE_TOAST",
        payload: ""
    }
}

