'use strict';

import React from 'react';
import { connect } from 'react-redux';

class Home extends React.Component {
    static CLASS_NAME = 'Home';

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <section className={Home.CLASS_NAME}>
                <section>
                    <h1>XSound</h1>
                    <hr />
                    <p>Web Audio API Library</p>
                </section>
                <section>
                    <h1>Overview</h1>
                    <hr />
                    <p>
                        This is full stack library for Web Audio API.<br />
                        In concrete, this library may be useful to implement the following features.
                    </p>
                    <ul className="list-marker">
                        <li>Create Sound</li>
                        <li>Play the One-Shot Audio</li>
                        <li>Play the Audio</li>
                        <li>Play the Media</li>
                        <li>Streaming (by WebRTC)</li>
                        <li>MIDI (by Web MIDI API)</li>
                        <li>MML (Music Macro Language)</li>
                        <li>Effectors (Compressor / Wah / Equalizer / Tremolo / Phaser / Chorus / Delay / Reverb ...etc)</li>
                        <li>Visualization (Overview in Time Domain / Time Domain / Spectrum)</li>
                        <li>Recording (Create WAVE file)</li>
                        <li>Session (by WebSocket)</li>
                    </ul>
                    <p>
                        <img src="https://user-images.githubusercontent.com/4006693/33797345-b6317092-dd49-11e7-9a16-6a96f9bd8bb3.jpg" alt="Browser Support" />
                    </p>
                </section>
                <section>
                    <h1>Getting Started</h1>
                    <hr />
<pre><code>X('oscillator').setup(true).ready().start(440);</code></pre>
                </section>
                <section>
                    <h1>Demo</h1>
                    <hr />
                    <p>
                        The application that uses this library is in the following URL.
                    </p>
                    <ul className="list-marker">
                        <li><a href="https://korilakkuma.github.io/X-Sound/" target="_blank" rel="noopener noreferrer">X Sound</a></li>
                        <li><a href="https://weblike-curtaincall.ssl-lolipop.jp/portfolio-music-v/" target="_blank" rel="noopener noreferrer">Music V</a></li>
                        <li><a href="https://github.com/Korilakkuma/Music-Tweet" target="_blank" rel="noopener noreferrer">Music Tweet</a></li>
                    </ul>
                    <p>Now, I'm creating website for Web Audio API. Please refer to the following site for understanding this API Document.</p>
                    <ul className="list-marker">
                        <li><a href="https://weblike-curtaincall.ssl-lolipop.jp/portfolio-web-sounder/" target="_blank" rel="noopener noreferrer">WEB SOUNDER</a></li>
                    </ul>
                </section>
                <section>
                    <h1>Installation</h1>
                    <hr />
<pre><code>$ npm install --save xsound</code></pre>
                </section>
                <section>
                    <h1>Usage</h1>
                    <hr />
<pre><code>&lt;script type="text/javascript" src="xsound.js"&gt;&lt;/script&gt;</code></pre>
                    <p>In the case of using WebSocket,</p>
<pre><code>$ node xsound-server-session-websocket.js</code></pre>
                    <p>or,</p>
<pre><code>$ node xsound-server-session-ws.js</code></pre>
                    <p>
                        Default port number is 8000.<br />
                        This port number can be changed by designating argument.<br />
                        For example,
                    </p>
<pre><code>$ node xsound-server-session-websocket.js 8080</code></pre>
                    <p>In the case of recording log, the path of log file must be designated by the 2nd argument.</p>
<pre><code>$ node xsound-server-session-websocket.js 8080 websocket.log</code></pre>
                </section>
            </section>
        );
    }
}

export default connect()(Home);
