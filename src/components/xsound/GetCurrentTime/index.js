'use strict';

import React from 'react';
import { connect } from 'react-redux';

class GetCurrentTime extends React.Component {
    static CLASS_NAME = 'GetCurrentTime';

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <section className={GetCurrentTime.CLASS_NAME}>
                <section>
                    <div className="component-title">
                        <h1>getCurrentTime</h1>
                        <p className="returns">Returns : <span>number</span></p>
                    </div>
                    <hr role="presentation" />
                    <p>
                        This method returns <code>currentTime</code> property in <a href="https://webaudio.github.io/web-audio-api/#AudioContext" target="_blank" rel="noopener noreferrer nofollow">AudioContext</a>.
                    </p>
                </section>
                <section className="codepen">
                    <iframe height='265' scrolling='no' title='getCurrentTime | XSound - Web Audio API Library -' src='//codepen.io/Korilakkuma/embed/mpoBez/?height=265&amp;theme-id=0&amp;default-tab=js,result&amp;embed-version=2' frameBorder='no' allowtransparency='true' allowFullScreen='true' style={{ width : '100%' }}>See the Pen <a href='https://codepen.io/Korilakkuma/pen/mpoBez/'>getCurrentTime | XSound - Web Audio API Library -</a> by Tomohiro IKEDA (<a href='https://codepen.io/Korilakkuma'>@Korilakkuma</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
                </section>
            </section>
        );
    }
}

export default connect()(GetCurrentTime);
