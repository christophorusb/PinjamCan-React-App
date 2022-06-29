import { combineReducers } from "redux";
import LoginReducer from "./LoginReducer";
import FilterReducer from './FilterReducer'

const reducers = combineReducers({
    login: LoginReducer,
    filter: FilterReducer,
});

export default reducers