import { combineReducers } from "redux";

import errorReducer from "./errorReducer";
import photoReducer from "./photoReducer";

export default combineReducers({
  errors: errorReducer,
  photo: photoReducer,
});
