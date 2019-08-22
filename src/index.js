import React from 'react';
import ReactDOM from 'react-dom';
import Shop from './Shop';
import { Provider } from 'react-redux';
import store from "./service/redux.store";
import * as Sentry from '@sentry/browser';
import CONFIG from './config';

Sentry.init({dsn: CONFIG.sentry_dsn});

let root = document.getElementById('root');

let params = {
    root: {},
};

for (let attr of root.attributes) {
    params.root[attr.nodeName] = attr.nodeValue;
}

ReactDOM.render(
    <Provider store={store}>
        <Shop {...params} />
    </Provider>
    ,
    root
);

