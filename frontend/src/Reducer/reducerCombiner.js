import { combineReducers } from "redux";
import QueueReducer from "./QueueReducer";
import SettingsReducer from "./SettingsReducer";

const allReducer = combineReducers({
    queueReducer: QueueReducer,
    settingsReducer: SettingsReducer
})

export default allReducer;