import { combineReducers } from "redux";
import SampleReducer from "./SampleReducer";

const allReducer = combineReducers({
    someReducer: SampleReducer
})

export default allReducer;