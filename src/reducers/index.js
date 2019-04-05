import { combineReducers } from 'redux';
import sessionReducer from './session';
import messageReducer from './message';

const rootReducer = combineReducers({
  sessionState: sessionReducer,
  messageState: messageReducer,
});

export default rootReducer;
