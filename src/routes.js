'use strict';

import React from 'react';
import { Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import IsXSound from './components/xsound/IsXSound';
import SampleRate from './components/xsound/SampleRate';
import NumberOfInputs from './components/xsound/NumberOfInputs';
import Nav from './components/Nav';
import Footer from './components/Footer';

const path = location.pathname;

export default (
    <React.Fragment>
        <Header />
        <div className="Routes">
            <Route exact path={path} component={Home} />
            <Route exact path={`${path}xsound/is-xsound`} component={IsXSound} />
            <Route exact path={`${path}xsound/sample-rate`} component={SampleRate} />
            <Route exact path={`${path}xsound/number-of-inputs`} component={NumberOfInputs} />
            <Nav />
        </div>
        <Footer />
    </React.Fragment>
);
