'use strict';

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import * as XSound from './components/xsound';
import * as OscillatorModule from './components/oscillator';
import Nav from './components/Nav';
import Footer from './components/Footer';

const path = location.pathname;

export default (
    <React.Fragment>
        <Header />
        <div className="Routes">
            <Switch>
                <Route exact path={path} component={Home} />
                <Route exact path={`${path}xsound/is-xsound`} component={XSound.IsXSound} />
                <Route exact path={`${path}xsound/sample-rate`} component={XSound.SampleRate} />
                <Route exact path={`${path}xsound/number-of-inputs`} component={XSound.NumberOfInputs} />
                <Route exact path={`${path}xsound/number-of-outputs`} component={XSound.NumberOfOutputs} />
                <Route exact path={`${path}xsound/ajax`} component={XSound.Ajax} />
                <Route exact path={`${path}xsound/clone`} component={XSound.Clone} />
                <Route exact path={`${path}xsound/convertTime`} component={XSound.ConvertTime} />
                <Route exact path={`${path}xsound/decode`} component={XSound.Decode} />
                <Route exact path={`${path}xsound/exitFullscreen`} component={XSound.ExitFullscreen} />
                <Route exact path={`${path}xsound/file`} component={XSound.File} />
                <Route exact path={`${path}xsound/free`} component={XSound.Free} />
                <Route exact path={`${path}xsound/fullscreen`} component={XSound.Fullscreen} />
                <Route exact path={`${path}xsound/get`} component={XSound.Get} />
                <Route exact path={`${path}xsound/getCurrentTime`} component={XSound.GetCurrentTime} />
                <Route exact path={`${path}xsound/noConflict`} component={XSound.NoConflict} />
                <Route exact path={`${path}xsound/read`} component={XSound.Read} />
                <Route exact path={`${path}xsound/toFrequencies`} component={XSound.ToFrequencies} />
                <Route exact path={`${path}oscillator/setup`} component={OscillatorModule.Setup} />
                <Route exact path={`${path}oscillator/ready`} component={OscillatorModule.Ready} />
            </Switch>
            <Nav />
        </div>
        <Footer />
    </React.Fragment>
);
