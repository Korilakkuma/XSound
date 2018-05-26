'use strict';

import React from 'react';
import { connect } from 'react-redux';

class Get extends React.Component {
    static TITLE      = 'MIDI#get';
    static CLASS_NAME = 'Get';

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <section className={Get.CLASS_NAME}>
                <section>
                    <div className="component-title">
                        <h1>get</h1>
                        <p className="returns">Returns : <span>MIDIAccess</span></p>
                    </div>
                    <hr role="presentation" />
                    <p>
                        This method gets the instance of MIDIAccess.
                    </p>
                </section>
                <section className="codepen">
                    <iframe height='265' scrolling='no' title='MIDI#get | XSound - Web Audio API Library -' src='//codepen.io/Korilakkuma/embed/wmXGyj/?height=265&amp;theme-id=0&amp;default-tab=js,result&amp;embed-version=2' frameBorder='no' allowtransparency='true' allowFullScreen='true' style={{ width : '100%' }} allow='midi *'>See the Pen <a href='https://codepen.io/Korilakkuma/pen/wmXGyj/'>MIDI#get | XSound - Web Audio API Library -</a> by Tomohiro IKEDA (<a href='https://codepen.io/Korilakkuma'>@Korilakkuma</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
                </section>
            </section>
        );
    }
}

export default connect()(Get);
