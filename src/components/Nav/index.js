'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as NavActions from '../../actions/NavActions';

class Nav extends React.Component {
    static CLASS_NAME = 'Nav';

    static propTypes = {
        dispatch        : PropTypes.func.isRequired,
        expandedPanelId : PropTypes.string,
        selectedItem    : PropTypes.string
    };

    constructor(props) {
        super(props);

        this.path        = location.pathname;
        this.onClick     = this.onClick.bind(this);
        this.onClickLink = this.onClickLink.bind(this);
    }

    onClick(event) {
        const id = event.currentTarget.getAttribute('aria-controls');

        if ((document.getElementById(id) === null) || (document.getElementById(id).getAttribute('aria-hidden') === 'false')) {
            this.props.dispatch(NavActions.expandPanel(''));
        } else {
            this.props.dispatch(NavActions.expandPanel(id));
        }
    }

    onClickLink(event) {
        for (const element of document.querySelectorAll('.-selected')) {
            element.classList.remove('-selected');
        }

        event.currentTarget.classList.add('-selected');
    }

    shouldComponentUpdate() {
        return true;
    }

    render() {
        const { expandedPanelId, selectedItem } = this.props;

        return (
            <nav role="tablist" aria-multiselectable="false" className={Nav.CLASS_NAME}>
                <section role="presentation">
                    <h2><Link to={this.path} onClick={this.onClick}>Overview</Link></h2>
                </section>
                <section role="presentation">
                    <h2><button type="button" role="tab" aria-expanded={expandedPanelId === 'panel-xsound'} aria-selected={expandedPanelId === 'panel-xsound'} aria-controls="panel-xsound" tabIndex="0" onClick={this.onClick}>XSound</button></h2>
                    <dl id="panel-xsound" aria-hidden={expandedPanelId !== 'panel-xsound'}>
                        <dt>Properties</dt>
                        <dd><Link to={`${this.path}xsound/is-xsound`} onClick={this.onClickLink}>IS_XSOUND</Link></dd>
                        <dd><Link to={`${this.path}xsound/sample-rate`} onClick={this.onClickLink}>SAMPLE_RATE</Link></dd>
                        <dd><Link to={`${this.path}xsound/number-of-inputs`} onClick={this.onClickLink}>NUMBER_OF_INPUTS</Link></dd>
                        <dd><Link to={`${this.path}xsound/number-of-outputs`} onClick={this.onClickLink}>NUMBER_OF_OUTPUTS</Link></dd>
                        <dt>Methods</dt>
                        <dd><Link to={`${this.path}xsound/ajax`} onClick={this.onClickLink}>ajax</Link></dd>
                        <dd><Link to={`${this.path}xsound/clone`} onClick={this.onClickLink}>clone</Link></dd>
                        <dd><Link to={`${this.path}xsound/convert-time`} onClick={this.onClickLink}>convertTime</Link></dd>
                        <dd><Link to={`${this.path}xsound/decode`} onClick={this.onClickLink}>decode</Link></dd>
                        <dd><Link to={`${this.path}xsound/exit-fullscreen`} onClick={this.onClickLink}>exitFullscreen</Link></dd>
                        <dd><Link to={`${this.path}xsound/file`} onClick={this.onClickLink}>file</Link></dd>
                        <dd><Link to={`${this.path}xsound/free`} onClick={this.onClickLink}>free</Link></dd>
                        <dd><Link to={`${this.path}xsound/fullscreen`} onClick={this.onClickLink}>fullscreen</Link></dd>
                        <dd><Link to={`${this.path}xsound/get`} onClick={this.onClickLink}>get</Link></dd>
                        <dd><Link to={`${this.path}xsound/get-current-time`} onClick={this.onClickLink}>getCurrentTime</Link></dd>
                        <dd><Link to={`${this.path}xsound/no-conflict`} onClick={this.onClickLink}>noConflict</Link></dd>
                        <dd><Link to={`${this.path}xsound/read`} onClick={this.onClickLink}>read</Link></dd>
                        <dd><Link to={`${this.path}xsound/to-frequencies`} onClick={this.onClickLink}>toFrequencies</Link></dd>
                    </dl>
                </section>
                <section role="presentation">
                    <h2><button type="button" role="tab" aria-expanded={expandedPanelId === 'panel-oscillator'} aria-selected={expandedPanelId === 'panel-oscillator'} aria-controls="panel-oscillator" tabIndex="0" onClick={this.onClick}>Oscillator</button></h2>
                    <dl id="panel-oscillator" aria-hidden={expandedPanelId !== 'panel-oscillator'}>
                        <dt>Methods</dt>
                        <dd><Link to={`${this.path}oscillator/setup`} onClick={this.onClickLink}>setup</Link></dd>
                        <dd><Link to={`${this.path}oscillator/ready`} onClick={this.onClickLink}>ready</Link></dd>
                        <dd><Link to={`${this.path}oscillator/start`} onClick={this.onClickLink}>start</Link></dd>
                        <dd><Link to={`${this.path}oscillator/stop`} onClick={this.onClickLink}>stop</Link></dd>
                        <dd><Link to={`${this.path}oscillator/param`} onClick={this.onClickLink}>param</Link></dd>
                        <dd><Link to={`${this.path}oscillator/params`} onClick={this.onClickLink}>params</Link></dd>
                        <dd><Link to={`${this.path}oscillator/to-json`} onClick={this.onClickLink}>toJSON</Link></dd>
                        <dd><Link to={`${this.path}oscillator/get`} onClick={this.onClickLink}>get</Link></dd>
                        <dd><Link to={`${this.path}oscillator/length`} onClick={this.onClickLink}>length</Link></dd>
                        <dd><Link to={`${this.path}oscillator/oscillator/param`}>Oscillator#param</Link></dd>
                        <dd><Link to={`${this.path}oscillator/oscillator/state`}>Oscillator#state</Link></dd>
                        <dd><Link to={`${this.path}oscillator/oscillator/get`}>Oscillator#get</Link></dd>
                    </dl>
                </section>
                <section role="presentation">
                    <h2><button type="button" role="tab" aria-expanded={expandedPanelId === 'panel-oneshot'} aria-selected={expandedPanelId === 'panel-oneshot'} aria-controls="panel-oneshot" tabIndex="0" onClick={this.onClick}>One-shot</button></h2>
                    <dl id="panel-oneshot" aria-hidden={expandedPanelId !== 'panel-oneshot'}>
                        <dt>Methods</dt>
                        <dd><Link to={`${this.path}oneshot/setup`}>setup</Link></dd>
                        <dd><Link to={`${this.path}oneshot/ready`}>ready</Link></dd>
                        <dd><Link to={`${this.path}oneshot/start`}>start</Link></dd>
                        <dd><Link to={`${this.path}oneshot/stop`}>stop</Link></dd>
                        <dd><Link to={`${this.path}oneshot/param`}>param</Link></dd>
                        <dd><Link to={`${this.path}oneshot/params`}>params</Link></dd>
                        <dd><Link to={`${this.path}oneshot/to-json`}>toJSON</Link></dd>
                        <dd><Link to={`${this.path}oneshot/get`}>get</Link></dd>
                    </dl>
                </section>
                <section role="presentation">
                    <h2><button type="button" role="tab" aria-expanded={expandedPanelId === 'panel-audio'} aria-selected={expandedPanelId === 'panel-audio'} aria-controls="panel-audio" tabIndex="0" onClick={this.onClick}>Audio</button></h2>
                    <dl id="panel-audio" aria-hidden={expandedPanelId !== 'panel-audio'}>
                        <dt>Methods</dt>
                        <dd><Link to="/audio/setup">setup</Link></dd>
                        <dd><Link to="/audio/ready">ready</Link></dd>
                        <dd><Link to="/audio/start">start</Link></dd>
                        <dd><Link to="/audio/stop">stop</Link></dd>
                        <dd><Link to="/audio/param">param</Link></dd>
                        <dd><Link to="/audio/params">params</Link></dd>
                        <dd><Link to="/audio/to-json">toJSON</Link></dd>
                        <dd><Link to="/audio/get">get</Link></dd>
                        <dd><Link to="/audio/toggle">toggle</Link></dd>
                        <dd><Link to="/audio/is-buffer">isBuffer</Link></dd>
                        <dd><Link to="/audio/is-source">isSource</Link></dd>
                        <dd><Link to="/audio/is-paused">isPaused</Link></dd>
                    </dl>
                </section>
                <section role="presentation">
                    <h2><button type="button" role="tab" aria-expanded={expandedPanelId === 'panel-media'} aria-selected={expandedPanelId === 'panel-media'} aria-controls="panel-media" tabIndex="0" onClick={this.onClick}>Media</button></h2>
                    <dl id="panel-media" aria-hidden={expandedPanelId !== 'panel-media'}>
                        <dt>Methods</dt>
                        <dd><Link to="/media/setup">setup</Link></dd>
                        <dd><Link to="/media/ready">ready</Link></dd>
                        <dd><Link to="/media/start">start</Link></dd>
                        <dd><Link to="/media/stop">stop</Link></dd>
                        <dd><Link to="/media/param">param</Link></dd>
                        <dd><Link to="/media/params">params</Link></dd>
                        <dd><Link to="/media/to-json">toJSON</Link></dd>
                        <dd><Link to="/media/get">get</Link></dd>
                        <dd><Link to="/media/toggle">toggle</Link></dd>
                        <dd><Link to="/media/is-media">isMedia</Link></dd>
                        <dd><Link to="/media/is-source">isSource</Link></dd>
                        <dd><Link to="/media/is-paused">isPaused</Link></dd>
                    </dl>
                </section>
                <section role="presentation">
                    <h2><button type="button" role="tab" aria-expanded={expandedPanelId === 'panel-stream'} aria-selected={expandedPanelId === 'panel-stream'} aria-controls="panel-stream" tabIndex="0" onClick={this.onClick}>Stream</button></h2>
                    <dl id="panel-stream" aria-hidden={expandedPanelId !== 'panel-stream'}>
                        <dt>Methods</dt>
                        <dd><Link to="/stream/setup">setup</Link></dd>
                        <dd><Link to="/stream/ready">ready</Link></dd>
                        <dd><Link to="/stream/start">start</Link></dd>
                        <dd><Link to="/stream/stop">stop</Link></dd>
                        <dd><Link to="/stream/param">param</Link></dd>
                        <dd><Link to="/stream/params">params</Link></dd>
                        <dd><Link to="/stream/to-json">toJSON</Link></dd>
                        <dd><Link to="/stream/get">get</Link></dd>
                        <dd><Link to="/stream/toggle">toggle</Link></dd>
                        <dd><Link to="/stream/is-streaming">isStreaming</Link></dd>
                    </dl>
                </section>
                <section role="presentation">
                    <h2><button type="button" role="tab" aria-expanded={expandedPanelId === 'panel-mixer'} aria-selected={expandedPanelId === 'panel-mixer'} aria-controls="panel-mixer" tabIndex="0" onClick={this.onClick}>Mixer</button></h2>
                    <dl id="panel-mixer" aria-hidden={expandedPanelId !== 'panel-mixer'}>
                        <dt>Methods</dt>
                        <dd><Link to="/mixer/mix">mix</Link></dd>
                        <dd><Link to="/mixer/get">get</Link></dd>
                    </dl>
                </section>
                <section role="presentation">
                    <h2><button type="button" role="tab" aria-expanded={expandedPanelId === 'panel-mexpandedPanelIdi'} aria-selected={expandedPanelId === 'panel-midi'} aria-controls="panel-midi" tabIndex="0" onClick={this.onClick}>MIDI</button></h2>
                    <dl id="panel-midi" aria-hidden={expandedPanelId !== 'panel-midi'}>
                        <dt>Methods</dt>
                        <dd><Link to="/midi/setup">setup</Link></dd>
                        <dd><Link to="/midi/get">get</Link></dd>
                    </dl>
                </section>
                <section role="presentation">
                    <h2><button type="button" role="tab" aria-expanded={expandedPanelId === 'panel-mml'} aria-selected={expandedPanelId === 'panel-mml'} aria-controls="panel-mml" tabIndex="0" onClick={this.onClick}>MML</button></h2>
                    <dl id="panel-mml" aria-hidden={expandedPanelId !== 'panel-mml'}>
                        <dt>Methods</dt>
                        <dd><Link to="/mml/setup">setup</Link></dd>
                        <dd><Link to="/mml/ready">ready</Link></dd>
                        <dd><Link to="/mml/start">start</Link></dd>
                        <dd><Link to="/mml/stop">stop</Link></dd>
                        <dd><Link to="/mml/get">get</Link></dd>
                        <dd><Link to="/mml/is-sequences">isSequences</Link></dd>
                        <dd><Link to="/mml/is-paused">isPaused</Link></dd>
                        <dd><Link to="/mml/create">create</Link></dd>
                    </dl>
                </section>
                <section role="presentation">
                    <h2><button type="button" role="tab" aria-expanded={expandedPanelId === 'panel-effectors'} aria-selected={expandedPanelId === 'panel-effectors'} aria-controls="panel-effectors" tabIndex="0" onClick={this.onClick}>Effectors</button></h2>
                    <dl id="panel-effectors" aria-hidden={expandedPanelId !== 'panel-effectors'}>
                        <dt>Modules</dt>
                        <dd><Link to="/effectors/autopanner">autopanner</Link></dd>
                        <dd><Link to="/effectors/chorus">chorus</Link></dd>
                        <dd><Link to="/effectors/compressor">compressor</Link></dd>
                        <dd><Link to="/effectors/delay">delay</Link></dd>
                        <dd><Link to="/effectors/distortion">distortion</Link></dd>
                        <dd><Link to="/effectors/envelope-generator">envelopegenerator</Link></dd>
                        <dd><Link to="/effectors/equalizer">equalizer</Link></dd>
                        <dd><Link to="/effectors/filter">filter</Link></dd>
                        <dd><Link to="/effectors/flanger">flanger</Link></dd>
                        <dd><Link to="/effectors/glide">glide</Link></dd>
                        <dd><Link to="/effectors/noisegate">noisegate</Link></dd>
                        <dd><Link to="/effectors/phaser">phaser</Link></dd>
                        <dd><Link to="/effectors/reverb">reverb</Link></dd>
                        <dd><Link to="/effectors/ringmodulator">ringmodulator</Link></dd>
                        <dd><Link to="/effectors/tremolo">tremolo</Link></dd>
                        <dd><Link to="/effectors/vocalcanceler">vocalcanceler</Link></dd>
                        <dd><Link to="/effectors/wah">wah</Link></dd>
                    </dl>
                </section>
                <section role="presentation">
                    <h2><button type="button" role="tab" aria-expanded={expandedPanelId === 'panel-analyser'} aria-selected={expandedPanelId === 'panel-analyser'} aria-controls="panel-analyser" tabIndex="0" onClick={this.onClick}>Analyser</button></h2>
                    <dl id="panel-analyser" aria-hidden={expandedPanelId !== 'panel-analyser'}>
                        <dt>Methods</dt>
                        <dd><Link to="/analyser/domain">domain</Link></dd>
                        <dd><Link to="/analyser/param">param</Link></dd>
                        <dd><Link to="/analyser/get">get</Link></dd>
                        <dd><Link to="/analyser/domain-setup">domain#setup</Link></dd>
                        <dd><Link to="/analyser/domain-param">domain#param</Link></dd>
                        <dd><Link to="/analyser/domain-state">domain#state</Link></dd>
                        <dd><Link to="/analyser/domain-create">domain#create</Link></dd>
                        <dd><Link to="/analyser/time-overview-update">TimeOverview#update</Link></dd>
                        <dd><Link to="/analyser/time-overview-drag">TimeOverview#drag</Link></dd>
                    </dl>
                </section>
                <section role="presentation">
                    <h2><button type="button" role="tab" aria-expanded={expandedPanelId === 'panel-recorder'} aria-selected={expandedPanelId === 'panel-recorder'} aria-controls="panel-recorder" tabIndex="0" onClick={this.onClick}>Recorder</button></h2>
                    <dl id="panel-recorder" aria-hidden={expandedPanelId !== 'panel-recorder'}>
                        <dt>Methods</dt>
                        <dd><Link to="/recorder/setup">setup</Link></dd>
                        <dd><Link to="/recorder/ready">ready</Link></dd>
                        <dd><Link to="/recorder/start">start</Link></dd>
                        <dd><Link to="/recorder/stop">stop</Link></dd>
                        <dd><Link to="/recorder/param">param</Link></dd>
                        <dd><Link to="/recorder/clear">clear</Link></dd>
                        <dd><Link to="/recorder/create">create</Link></dd>
                        <dd><Link to="/recorder/get-active-track">getActiveTrack</Link></dd>
                    </dl>
                </section>
                <section role="presentation">
                    <h2><button type="button" role="tab" aria-expanded={expandedPanelId === 'panel-session'} aria-selected={expandedPanelId === 'panel-session'} aria-controls="panel-session" tabIndex="0" onClick={this.onClick}>Session</button></h2>
                    <dl id="panel-session" aria-hidden={expandedPanelId !== 'panel-session'}>
                        <dt>Methods</dt>
                        <dd><Link to="/session/setup">setup</Link></dd>
                        <dd><Link to="/session/start">start</Link></dd>
                        <dd><Link to="/session/close">close</Link></dd>
                        <dd><Link to="/session/get">get</Link></dd>
                        <dd><Link to="/session/is-connected">isConnected</Link></dd>
                        <dd><Link to="/session/state">state</Link></dd>
                    </dl>
                </section>
            </nav>
        );
    }
}

function mapStateToProps(state) {
    return {
        expandedPanelId : state.expandedPanelId
    };
}

export default connect(mapStateToProps)(Nav);
