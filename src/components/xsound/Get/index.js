'use strict';

import React from 'react';
import { connect } from 'react-redux';

class Get extends React.Component {
    static TITLE      = 'XSound.get';
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
                        <p className="returns">Returns : <span>AudioContext</span></p>
                    </div>
                    <hr role="presentation" />
                    <p>
                        This method returns the instance of <a href="https://webaudio.github.io/web-audio-api/#AudioContext" target="_blank" rel="noopener noreferrer nofollow">AudioContext</a>.
                    </p>
                </section>
                <section className="codepen">
                    <iframe height='265' scrolling='no' title='get | XSound - Web Audio API Library -' src='//codepen.io/Korilakkuma/embed/aEMyPp/?height=265&amp;theme-id=0&amp;default-tab=js,result&amp;embed-version=2' frameBorder='no' allowtransparency='true' allowFullScreen='true' style={{ width : '100%' }}>See the Pen <a href='https://codepen.io/Korilakkuma/pen/aEMyPp/'>get | XSound - Web Audio API Library -</a> by Tomohiro IKEDA (<a href='https://codepen.io/Korilakkuma'>@Korilakkuma</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
                </section>
            </section>
        );
    }
}

export default connect()(Get);
