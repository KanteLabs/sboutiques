import 'core-js/es6/';
import 'core-js/es7/';
import React from 'react';
import ReactDOM from 'react-dom';

import {Provider} from 'react-redux';
import appSetup from './appSetup';
import Store from './Store';

import App from './App';
import './index.css';

// import registerServiceWorker from './registerServiceWorker';
import {unregister} from './registerServiceWorker';

appSetup();
ReactDOM.render(
    <Provider store={Store}>
        <App />
    </Provider>,
    document.getElementById('root')
);

// registerServiceWorker();
unregister();
