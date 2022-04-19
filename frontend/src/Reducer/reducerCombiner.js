import { combineReducers } from "redux";
import QueueReducer from "./QueueReducer";
import SettingsReducer from "./SettingsReducer";
import CommonReducer from "./CommonReducer";

const allReducer = combineReducers({
    queueReducer: QueueReducer,
    settingsReducer: SettingsReducer,
    commonReducer: CommonReducer
})

export default allReducer;