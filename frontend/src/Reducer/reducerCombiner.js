import { combineReducers } from "redux";
import QueueReducer from "./QueueReducer";

const allReducer = combineReducers({
    queueReducer: QueueReducer
})

export default allReducer;