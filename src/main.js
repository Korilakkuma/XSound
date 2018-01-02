'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import store from './store';

ReactDOM.render(
    <Provider store={store}>
        <Router>
            {require('./routes').default}
        </Router>
    </Provider>,
    document.getElementById('app')
);
