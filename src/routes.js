'use strict';

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PageLoadingBar from './components/PageLoadingBar';
import Header from './components/Header';
import Home from './components/Home';
import * as XSound from './components/xsound';
import * as OscillatorModule from './components/oscillator';
import * as OneshotModule from './components/oneshot';
import * as AudioModule from './components/audio';
import * as MediaModule from './components/media';
import * as StreamModule from './components/stream';
import * as MixerModule from './components/mixer';
import * as MIDI from './components/midi';
import * as MML from './components/mml';
import * as Effectors from './components/effectors';
import * as Analyser from './components/analyser';
import * as Recorder from './components/recorder';
import * as Session from './components/session';
import NotFound from './components/NotFound';
import Nav from './components/Nav';
import Footer from './components/Footer';

const path = '/'; // location.pathname;

const onAnimationEnd = event => {
    event.currentTarget.classList.remove('-loading');
    event.currentTarget.removeEventListener('animationend', onAnimationEnd, false);
};

const render = Component => ({ history, match }) => {
    const pageLoadingBar = document.getElementById('page-loading-bar');

    if (pageLoadingBar) {
        pageLoadingBar.classList.add('-loading');
        pageLoadingBar.addEventListener('animationend', onAnimationEnd, false);
    }

    if (Component.TITLE === 'Home') {
        document.title = 'XSound - Web Audio API Library -';
    } else {
        document.title = `${Component.TITLE} | XSound - Web Audio API Library -`;
    }

    return <Component history={history} match={match} />;
};

export default (
    <React.Fragment>
        <PageLoadingBar />
        <Header />
        <div className="Routes">
            <Switch>
                <Route exact path={path} render={render(Home)} />
                <Route exact path={`${path}xsound/is-xsound`} render={render(XSound.IsXSound)} />
                <Route exact path={`${path}xsound/sample-rate`} render={render(XSound.SampleRate)} />
                <Route exact path={`${path}xsound/number-of-inputs`} render={render(XSound.NumberOfInputs)} />
                <Route exact path={`${path}xsound/number-of-outputs`} render={render(XSound.NumberOfOutputs)} />
                <Route exact path={`${path}xsound/ajax`} render={render(XSound.Ajax)} />
                <Route exact path={`${path}xsound/clone`} render={render(XSound.Clone)} />
                <Route exact path={`${path}xsound/convert-time`} render={render(XSound.render)} />
                <Route exact path={`${path}xsound/decode`} render={render(XSound.Decode)} />
                <Route exact path={`${path}xsound/exit-fullscreen`} render={render(XSound.ExitFullscreen)} />
                <Route exact path={`${path}xsound/file`} render={render(XSound.File)} />
                <Route exact path={`${path}xsound/free`} render={render(XSound.Free) } />
                <Route exact path={`${path}xsound/fullscreen`} render={render(XSound.Fullscreen)} />
                <Route exact path={`${path}xsound/get`} render={render(XSound.Get)} />
                <Route exact path={`${path}xsound/get-current-time`} render={render(XSound.GetCurrentTime)} />
                <Route exact path={`${path}xsound/no-conflict`} render={render(XSound.NoConflict)} />
                <Route exact path={`${path}xsound/read`} render={render(XSound.Read)} />
                <Route exact path={`${path}xsound/to-frequencies`} render={render(XSound.ToFrequencies)} />
                <Route exact path={`${path}oscillator/setup`} render={render(OscillatorModule.Setup)} />
                <Route exact path={`${path}oscillator/ready`} render={render(OscillatorModule.Ready)} />
                <Route exact path={`${path}oscillator/start`} render={render(OscillatorModule.Start)} />
                <Route exact path={`${path}oscillator/stop`} render={render(OscillatorModule.Stop)} />
                <Route exact path={`${path}oscillator/param`} render={render(OscillatorModule.Param)} />
                <Route exact path={`${path}oscillator/params`} render={render(OscillatorModule.Params)} />
                <Route exact path={`${path}oscillator/to-json`} render={render(OscillatorModule.ToJSON)} />
                <Route exact path={`${path}oscillator/get`} render={render(OscillatorModule.Get)} />
                <Route exact path={`${path}oscillator/length`} render={render(OscillatorModule.Length)} />
                <Route exact path={`${path}oscillator/oscillator/param`} render={render(OscillatorModule.OscillatorParam)} />
                <Route exact path={`${path}oscillator/oscillator/state`} render={render(OscillatorModule.OscillatorState)} />
                <Route exact path={`${path}oscillator/oscillator/get`} render={render(OscillatorModule.OscillatorGet)} />
                <Route exact path={`${path}oneshot/setup`} render={render(OneshotModule.Setup)} />
                <Route exact path={`${path}oneshot/ready`} render={render(OneshotModule.Ready)} />
                <Route exact path={`${path}oneshot/start`} render={render(OneshotModule.Start)} />
                <Route exact path={`${path}oneshot/stop`} render={render(OneshotModule.Stop)} />
                <Route exact path={`${path}oneshot/param`} render={render(OneshotModule.Param)} />
                <Route exact path={`${path}oneshot/params`} render={render(OneshotModule.Params)} />
                <Route exact path={`${path}oneshot/to-json`} render={render(OneshotModule.ToJSON)} />
                <Route exact path={`${path}oneshot/get`} render={render(OneshotModule.Get)} />
                <Route exact path={`${path}audio/setup`} render={render(AudioModule.Setup)} />
                <Route exact path={`${path}audio/ready`} render={render(AudioModule.Ready)} />
                <Route exact path={`${path}audio/start`} render={render(AudioModule.Start)} />
                <Route exact path={`${path}audio/stop`} render={render(AudioModule.Stop)} />
                <Route exact path={`${path}audio/param`} render={render(AudioModule.Param)} />
                <Route exact path={`${path}audio/params`} render={render(AudioModule.Params)} />
                <Route exact path={`${path}audio/to-json`} render={render(AudioModule.ToJSON)} />
                <Route exact path={`${path}audio/get`} render={render(AudioModule.Get)} />
                <Route exact path={`${path}audio/toggle`} render={render(AudioModule.Toggle)} />
                <Route exact path={`${path}audio/is-buffer`} render={render(AudioModule.IsBuffer)} />
                <Route exact path={`${path}audio/is-source`} render={render(AudioModule.IsSource)} />
                <Route exact path={`${path}audio/is-paused`} render={render(AudioModule.IsPaused)} />
                <Route exact path={`${path}media/setup`} render={render(MediaModule.Setup)} />
                <Route exact path={`${path}media/ready`} render={render(MediaModule.Ready)} />
                <Route exact path={`${path}media/start`} render={render(MediaModule.Start)} />
                <Route exact path={`${path}media/stop`} render={render(MediaModule.Stop)} />
                <Route exact path={`${path}media/param`} render={render(MediaModule.Param)} />
                <Route exact path={`${path}media/params`} render={render(MediaModule.Params)} />
                <Route exact path={`${path}media/to-json`} render={render(MediaModule.ToJSON)} />
                <Route exact path={`${path}media/get`} render={render(MediaModule.Get)} />
                <Route exact path={`${path}media/toggle`} render={render(MediaModule.Toggle)} />
                <Route exact path={`${path}media/is-media`} render={render(MediaModule.IsMedia)} />
                <Route exact path={`${path}media/is-source`} render={render(MediaModule.IsSource)} />
                <Route exact path={`${path}media/is-paused`} render={render(MediaModule.IsPaused)} />
                <Route exact path={`${path}stream/setup`} render={render(StreamModule.Setup)} />
                <Route exact path={`${path}stream/ready`} render={render(StreamModule.Ready)} />
                <Route exact path={`${path}stream/start`} render={render(StreamModule.Start)} />
                <Route exact path={`${path}stream/stop`} render={render(StreamModule.Stop)} />
                <Route exact path={`${path}stream/param`} render={render(StreamModule.Param)} />
                <Route exact path={`${path}stream/params`} render={render(StreamModule.Params)} />
                <Route exact path={`${path}stream/to-json`} render={render(StreamModule.ToJSON)} />
                <Route exact path={`${path}stream/get`} render={render(StreamModule.Get)} />
                <Route exact path={`${path}stream/toggle`} render={render(StreamModule.Toggle)} />
                <Route exact path={`${path}stream/is-streaming`} render={render(StreamModule.IsStreaming)} />
                <Route exact path={`${path}mixer/mix`} render={render(MixerModule.Mix)} />
                <Route exact path={`${path}mixer/get`} render={render(MixerModule.Get)} />
                <Route exact path={`${path}midi/setup`} render={render(MIDI.Setup)} />
                <Route exact path={`${path}midi/get`} render={render(MIDI.Get)} />
                <Route exact path={`${path}mml/setup`} render={render(MML.Setup)} />
                <Route exact path={`${path}mml/ready`} render={render(MML.Ready)} />
                <Route exact path={`${path}mml/start`} render={render(MML.Start)} />
                <Route exact path={`${path}mml/stop`} render={render(MML.Stop)} />
                <Route exact path={`${path}mml/get`} render={render(MML.Get)} />
                <Route exact path={`${path}mml/is-sequences`} render={render(MML.IsSequences)} />
                <Route exact path={`${path}mml/is-paused`} render={render(MML.IsPaused)} />
                <Route exact path={`${path}mml/create`} render={render(MML.Create)} />
                <Route exact path={`${path}effectors/autopanner`} render={render(Effectors.Autopanner)} />
                <Route exact path={`${path}effectors/chorus`} render={render(Effectors.Chorus)} />
                <Route exact path={`${path}effectors/compressor`} render={render(Effectors.Compressor)} />
                <Route exact path={`${path}effectors/delay`} render={render(Effectors.Delay)} />
                <Route exact path={`${path}effectors/distortion`} render={render(Effectors.Distortion)} />
                <Route exact path={`${path}effectors/envelopegenerator`} render={render(Effectors.EnvelopeGenerator)} />
                <Route exact path={`${path}effectors/equalizer`} render={render(Effectors.Equalizer)} />
                <Route exact path={`${path}effectors/filter`} render={render(Effectors.Filter)} />
                <Route exact path={`${path}effectors/flanger`} render={render(Effectors.Flanger)} />
                <Route exact path={`${path}effectors/glide`} render={render(Effectors.Glide)} />
                <Route exact path={`${path}effectors/noisegate`} render={render(Effectors.NoiseGate)} />
                <Route exact path={`${path}effectors/phaser`} render={render(Effectors.Phaser)} />
                <Route exact path={`${path}effectors/reverb`} render={render(Effectors.Reverb)} />
                <Route exact path={`${path}effectors/ringmodulator`} render={render(Effectors.Ringmodulator)} />
                <Route exact path={`${path}effectors/tremolo`} render={render(Effectors.Tremolo)} />
                <Route exact path={`${path}effectors/vocalcanceler`} render={render(Effectors.VocalCanceler)} />
                <Route exact path={`${path}effectors/wah`} render={render(Effectors.Wah)} />
                <Route exact path={`${path}analyser/domain`} render={render(Analyser.Domain)} />
                <Route exact path={`${path}analyser/param`} render={render(Analyser.Param)} />
                <Route exact path={`${path}analyser/get`} render={render(Analyser.Get)} />
                <Route exact path={`${path}analyser/visualizer/setup`} render={render(Analyser.VisualizerSetup)} />
                <Route exact path={`${path}analyser/visualizer/param`} render={render(Analyser.VisualizerParam)} />
                <Route exact path={`${path}analyser/visualizer/state`} render={render(Analyser.VisualizerState)} />
                <Route exact path={`${path}analyser/visualizer/create`} render={render(Analyser.VisualizerCreate)} />
                <Route exact path={`${path}analyser/time-overview/update`} render={render(Analyser.TimeOverviewUpdate)} />
                <Route exact path={`${path}analyser/time-overview/drag`} render={render(Analyser.TimeOverviewDrag)} />
                <Route exact path={`${path}recorder/setup`} render={render(Recorder.Setup)} />
                <Route exact path={`${path}recorder/ready`} render={render(Recorder.Ready)} />
                <Route exact path={`${path}recorder/start`} render={render(Recorder.Start)} />
                <Route exact path={`${path}recorder/stop`} render={render(Recorder.Stop)} />
                <Route exact path={`${path}recorder/param`} render={render(Recorder.Param)} />
                <Route exact path={`${path}recorder/clear`} render={render(Recorder.Clear)} />
                <Route exact path={`${path}recorder/create`} render={render(Recorder.Create)} />
                <Route exact path={`${path}recorder/get-active-track`} render={render(Recorder.GetActiveTrack)} />
                <Route exact path={`${path}session/setup`} render={render(Session.Setup)} />
                <Route exact path={`${path}session/start`} render={render(Session.Start)} />
                <Route exact path={`${path}session/close`} render={render(Session.Close)} />
                <Route exact path={`${path}session/get`} render={render(Session.Get)} />
                <Route exact path={`${path}session/is-connected`} render={render(Session.IsConnected)} />
                <Route exact path={`${path}session/state`} render={render(Session.State)} />
                <Route exact render={render(NotFound)} />
            </Switch>
            <Nav />
        </div>
        <Footer />
    </React.Fragment>
);
