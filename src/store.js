'use strict';

import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
// import createHistory from 'history/createBrowserHistory';
import createHistory from 'history/createHashHistory';
import reducers from './reducers';

const history    = createHistory();
const middleware = routerMiddleware(history);
const store      = createStore(reducers, applyMiddleware(middleware));

export {
    store,
    history
};
