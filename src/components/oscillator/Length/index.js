'use strict';

import React from 'react';
import { connect } from 'react-redux';

class Length extends React.Component {
    static TITLE      = 'OscillatorModule#length';
    static CLASS_NAME = 'Length';

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <section className={Length.CLASS_NAME}>
                <section>
                    <div className="component-title">
                        <h1>length</h1>
                        <p className="returns">Returns : <span>number</span></p>
                    </div>
                    <hr role="presentation" />
                    <p>
                        This method gets the number of oscillators.
                    </p>
                </section>
                <section className="codepen">
                    <iframe height='265' scrolling='no' title='OscillatorModule#length | XSound - Web Audio API Library -' src='//codepen.io/Korilakkuma/embed/OQjKVm/?height=265&amp;theme-id=0&amp;default-tab=js,result&amp;embed-version=2' frameBorder='no' allowtransparency='true' allowFullScreen='true' style={{ width : '100%' }}>See the Pen <a href='https://codepen.io/Korilakkuma/pen/OQjKVm/'>OscillatorModule#length | XSound - Web Audio API Library -</a> by Tomohiro IKEDA (<a href='https://codepen.io/Korilakkuma'>@Korilakkuma</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
                </section>
            </section>
        );
    }
}

export default connect()(Length);
