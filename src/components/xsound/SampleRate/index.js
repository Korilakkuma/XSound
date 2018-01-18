'use strict';

import React from 'react';
import { connect } from 'react-redux';

class SampleRate extends React.Component {
    static CLASS_NAME = 'SampleRate';

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <section className={SampleRate.CLASS_NAME}>
                <section>
                    <div className="component-title">
                        <h1>SAMPLE_RATE</h1>
                        <p className="type">Type : <span>number</span></p>
                    </div>
                    <hr role="presentation" />
                    <p>
                        This property is sample rate for <abbr>PCM</abbr> (Pulse Code Modulation).
                    </p>
                </section>
                <section className="codepen">
                    <iframe height='265' scrolling='no' title='SAMPLE_RATE | XSound - Web Audio API Library -' src='//codepen.io/Korilakkuma/embed/MrqBMp/?height=265&amp;theme-id=0&amp;default-tab=js,result&amp;embed-version=2' frameBorder='no' allowtransparency='true' allowFullScreen='true' style={{ width : '100%' }}>See the Pen <a href='https://codepen.io/Korilakkuma/pen/MrqBMp/'>SAMPLE_RATE | XSound - Web Audio API Library -</a> by Tomohiro IKEDA (<a href='https://codepen.io/Korilakkuma'>@Korilakkuma</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
                </section>
            </section>
        );
    }
}

export default connect()(SampleRate);
