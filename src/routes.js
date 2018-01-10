'use strict';

import React from 'react';
import { Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Nav from './components/Nav';

export default (
    <div>
        <Header />
        <div className="Routes">
            <Route exact path={location.pathname} component={Home} />
            <Nav />
        </div>
    </div>
);
