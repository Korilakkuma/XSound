'use strict';

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import IsXSound from './components/xsound/IsXSound';
import SampleRate from './components/xsound/SampleRate';
import NumberOfInputs from './components/xsound/NumberOfInputs';
import NumberOfOutputs from './components/xsound/NumberOfOutputs';
import Ajax from './components/xsound/Ajax';
import Clone from './components/xsound/Clone';
import ConvertTime from './components/xsound/ConvertTime';
import Decode from './components/xsound/Decode';
import File from './components/xsound/File';
import Free from './components/xsound/Free';
import Get from './components/xsound/Get';
import GetCurrentTime from './components/xsound/GetCurrentTime';
import Nav from './components/Nav';
import Footer from './components/Footer';

const path = location.pathname;

export default (
    <React.Fragment>
        <Header />
        <div className="Routes">
            <Switch>
                <Route exact path={path} component={Home} />
                <Route exact path={`${path}xsound/is-xsound`} component={IsXSound} />
                <Route exact path={`${path}xsound/sample-rate`} component={SampleRate} />
                <Route exact path={`${path}xsound/number-of-inputs`} component={NumberOfInputs} />
                <Route exact path={`${path}xsound/number-of-outputs`} component={NumberOfOutputs} />
                <Route exact path={`${path}xsound/ajax`} component={Ajax} />
                <Route exact path={`${path}xsound/clone`} component={Clone} />
                <Route exact path={`${path}xsound/convertTime`} component={ConvertTime} />
                <Route exact path={`${path}xsound/decode`} component={Decode} />
                <Route exact path={`${path}xsound/file`} component={File} />
                <Route exact path={`${path}xsound/free`} component={Free} />
                <Route exact path={`${path}xsound/get`} component={Get} />
                <Route exact path={`${path}xsound/getCurrentTime`} component={GetCurrentTime} />
            </Switch>
            <Nav />
        </div>
        <Footer />
    </React.Fragment>
);
