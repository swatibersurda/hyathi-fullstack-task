import {
    applyMiddleware,
    combineReducers,
    compose,
    legacy_createStore,
  } from "redux";
  import thunk from "redux-thunk";
  import { reducer as AppReducer } from "./reducer";
  
  const rootReducer = combineReducers({ AppReducer });
  
  const reduxDevTools =
    window._REDUX_DEVTOOLS_EXTENSION_?window._REDUX_DEVTOOLS_EXTENSION_():f=>f
  
  export const store = legacy_createStore(
    rootReducer,
   compose(applyMiddleware(thunk),reduxDevTools)
  );