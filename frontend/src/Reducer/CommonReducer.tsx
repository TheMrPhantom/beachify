import { AlertColor } from "@mui/material"

const initialState: CommonReducerType = {
    toast: {
        isOpen: false,
        type: "success",
        message: "",
        duration: 6000
    }
}

export type CommonReducerType = {
    toast: {
        isOpen: boolean,
        type: AlertColor,
        message: string,
        duration: number,
        jsxElement?: JSX.Element
    }
}


const reducer = (state = initialState, { type, payload }: { type: string, payload: any }) => {
    var newState = { ...state }
    switch (type) {
        case "OPEN_TOAST":
            newState.toast.isOpen = true;
            newState.toast.message = payload.message;
            newState.toast.duration = payload.duration ? payload.duration : initialState.toast.duration
            newState.toast.type = payload.type ? payload.type : initialState.toast.type
            newState.toast.jsxElement = payload.jsxElement ? payload.jsxElement : undefined
            return newState

        case "CLOSE_TOAST":
            newState.toast.isOpen = false;
            return newState
        default:
            return state
    }

}
export default reducer
