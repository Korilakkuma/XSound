'use strict';

import React from 'react';
import { connect } from 'react-redux';

class Ready extends React.Component {
    static TITLE      = 'MML#ready';
    static CLASS_NAME = 'Ready';

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <section className={Ready.CLASS_NAME}>
                <section>
                    <div className="component-title">
                        <h1>ready</h1>
                        <p className="returns">Returns : <span>MML</span></p>
                    </div>
                    <hr role="presentation" />
                    <p>
                        This method parses MML string.
                    </p>
                    <table>
                        <caption>Arguments</caption>
                        <thead><tr><th scope="col"></th><th scope="col">Type</th><th scope="col">Description</th></tr></thead>
                        <tbody>
                            <tr>
                                <th scope="row">1st</th>
                                <td><span className="argument-type">OscillatorModule</span> or <span className="argument-type">OneshotModule</span></td>
                                <td>This value is the instance of OscillatorModule or OneshotModule.</td>
                            </tr>
                            <tr>
                                <th scope="row">2nd</th>
                                <td><span className="argument-type">Array</span></td>
                                <td>This value is the array that contains MML string.</td>
                            </tr>
                        </tbody>
                    </table>
                    <table>
                        <caption>Description Rule</caption>
                        <thead><tr><th scope="col">Music</th><th scope="col">MML</th></tr></thead>
                        <tbody>
                            <tr><td>Scale</td><td>C D E F G A B</td></tr>
                            <tr><td>Duration</td><td>1 2 4 8 16 32 64 128 256</td></tr>
                            <tr><td>Triplet / Nonuplet</td><td>6 8 12 18 24 36 48 72 96 144 192</td></tr>
                            <tr><td>Sharp</td><td>+, #</td></tr>
                            <tr><td>Flat</td><td>-</td></tr>
                            <tr><td>Rest</td><td>R</td></tr>
                            <tr><td>Dotted note</td><td>.</td></tr>
                            <tr><td>Tie</td><td>&amp;</td></tr>
                            <tr><td>Octave</td><td>O</td></tr>
                            <tr><td>Tempo</td><td>T</td></tr>
                        </tbody>
                    </table>
                </section>
                <section className="codepen">
                    <iframe height='265' scrolling='no' title='MML#ready | XSound - Web Audio API Library -' src='//codepen.io/Korilakkuma/embed/NYLKya/?height=265&amp;theme-id=0&amp;default-tab=js,result&amp;embed-version=2' frameBorder='no' allowtransparency='true' allowFullScreen='true' style={{ width : '100%' }}>See the Pen <a href='https://codepen.io/Korilakkuma/pen/NYLKya/'>MML#ready | XSound - Web Audio API Library -</a> by Tomohiro IKEDA (<a href='https://codepen.io/Korilakkuma'>@Korilakkuma</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
                </section>
            </section>
        );
    }
}

export default connect()(Ready);
