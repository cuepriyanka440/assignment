import { combineReducers } from 'redux';
import sessionReducer from './session';
import pageReducer from './page';

const rootReducer = combineReducers({
  sessionState: sessionReducer,
  pageState: pageReducer,
});

export default rootReducer;
