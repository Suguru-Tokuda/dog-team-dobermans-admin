import authenticationReducer from './authentication';
import userReducer from './user';
import loader from './loader';
import { combineReducers } from 'redux';

const combinedReducers = combineReducers({
    authenticated: authenticationReducer,
    user: userReducer,
    loadCount: loader
});

export default combinedReducers;
