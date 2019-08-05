import _ from 'lodash';
import Store from './Store';
import {fixIosRotation} from './components/Media/Model/mediaModel';
import setMediaQueriesAction from './components/Media/ActionCreator/setMediaQueriesAction';
import {GET_USER_ACTION} from './Actions/User/getUserAction';

export default function appSetup() {
    return setResizeListener(), getCurrentUser();
}

function setResizeListener() {
    fixIosRotation();
    window.addEventListener(
        'resize',
        _.debounce(() => Store.dispatch(setMediaQueriesAction()), 100)
    );
}

function getCurrentUser() {
    return Store.dispatch(GET_USER_ACTION());
}
