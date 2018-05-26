'use strict';

import React from 'react';
import { connect } from 'react-redux';

class IsStreaming extends React.Component {
    static TITLE      = 'StreamModule#isStreaming';
    static CLASS_NAME = 'IsStreaming';

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <section className={IsStreaming.CLASS_NAME}>
                <section>
                    <div className="component-title">
                        <h1>isStreaming</h1>
                        <p className="returns">Returns : <span>boolean</span></p>
                    </div>
                    <hr role="presentation" />
                    <p>
                        This method is to check streaming.
                    </p>
                </section>
                <section className="codepen">
                    <iframe height='265' scrolling='no' title='StreamModule#isStreaming | XSound - Web Audio API Library -' src='//codepen.io/Korilakkuma/embed/ZxXzZM/?height=265&amp;theme-id=0&amp;default-tab=js,result&amp;embed-version=2' frameBorder='no' allowtransparency='true' allowFullScreen='true' style={{ width : '100%' }} allow="microphone *; camera *">See the Pen <a href='https://codepen.io/Korilakkuma/pen/ZxXzZM/'>StreamModule#isStreaming | XSound - Web Audio API Library -</a> by Tomohiro IKEDA (<a href='https://codepen.io/Korilakkuma'>@Korilakkuma</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
                </section>
            </section>
        );
    }
}

export default connect()(IsStreaming);
