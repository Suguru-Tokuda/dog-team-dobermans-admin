import authenticationReducer from './authentication';
import userReducer from './user';
import { combineReducers } from 'redux';

const combinedReducers = combineReducers({
    authenticated: authenticationReducer,
    user: userReducer
});

export default combinedReducers;
