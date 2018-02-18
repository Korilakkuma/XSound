'use strict';

import React from 'react';
import { connect } from 'react-redux';

class OscillatorGet extends React.Component {
    static CLASS_NAME = 'OscillatorGet';

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <section className={OscillatorGet.CLASS_NAME}>
                <section>
                    <div className="component-title">
                        <h1>Oscillator#get</h1>
                        <p className="returns">Returns : <span>OscillatorNode</span></p>
                    </div>
                    <hr role="presentation" />
                    <p>
                        This method gets the instance of <code>OscillatorNode</code>.
                    </p>
                </section>
                <section className="codepen">
                    <iframe height='265' scrolling='no' title='Oscillator#get | XSound - Web Audio API Library -' src='//codepen.io/Korilakkuma/embed/vdRRPj/?height=265&amp;theme-id=0&amp;default-tab=js,result&amp;embed-version=2' frameBorder='no' allowtransparency='true' allowFullScreen='true' style={{ width : '100%' }}>See the Pen <a href='https://codepen.io/Korilakkuma/pen/vdRRPj/'>Oscillator#get | XSound - Web Audio API Library -</a> by Tomohiro IKEDA (<a href='https://codepen.io/Korilakkuma'>@Korilakkuma</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
                </section>
            </section>
        );
    }
}

export default connect()(OscillatorGet);
