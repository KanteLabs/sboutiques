import {combineReducers} from 'redux';
import mediaReducer from '../components/Media/Reducer/MediaReducer';
import userReducer from './userReducer';

const rootReducer = combineReducers({
    media: mediaReducer,
    user: userReducer,
});

export default rootReducer;
