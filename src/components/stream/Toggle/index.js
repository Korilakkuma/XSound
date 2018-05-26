'use strict';

import React from 'react';
import { connect } from 'react-redux';

class Toggle extends React.Component {
    static TITLE      = 'StreamModule#toggle';
    static CLASS_NAME = 'Toggle';

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <section className={Toggle.CLASS_NAME}>
                <section>
                    <div className="component-title">
                        <h1>toggle</h1>
                        <p className="returns">Returns : <span>StreamModule</span></p>
                    </div>
                    <hr role="presentation" />
                    <p>
                        This method starts or stops streaming.
                    </p>
                    <table>
                        <caption>Arguments</caption>
                        <thead><tr><th scope="col"></th><th scope="col">Type</th><th scope="col">Description</th></tr></thead>
                        <tbody>
                            <tr>
                                <th scope="row">1st</th>
                                <td><span className="argument-type">Array</span></td>
                                <td>This value is the array for changing connection.</td>
                            </tr>
                            <tr>
                                <th scope="row">2nd</th>
                                <td><span className="argument-type">Function</span></td>
                                <td>This value is <a href="http://webaudio.github.io/web-audio-api/#the-scriptprocessornode-interface---deprecated" target="_blank" rel="noopener noreferrer nofollow">onaudioprocess</a> event hanlder.</td>
                            </tr>
                        </tbody>
                    </table>
                </section>
                <section className="codepen">
                    <iframe height='265' scrolling='no' title='StreamModule#toggle | XSound - Web Audio API Library -' src='//codepen.io/Korilakkuma/embed/KoXPGZ/?height=265&amp;theme-id=0&amp;default-tab=js,result&amp;embed-version=2' frameBorder='no' allowtransparency='true' allowFullScreen='true' style={{ width : '100%' }} allow="microphone *; camera *">See the Pen <a href='https://codepen.io/Korilakkuma/pen/KoXPGZ/'>StreamModule#toggle | XSound - Web Audio API Library -</a> by Tomohiro IKEDA (<a href='https://codepen.io/Korilakkuma'>@Korilakkuma</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
                </section>
            </section>
        );
    }
}

export default connect()(Toggle);
