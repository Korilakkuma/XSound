'use strict';

import React from 'react';
import { connect } from 'react-redux';

class Close extends React.Component {
    static TITLE      = 'Session#close';
    static CLASS_NAME = 'Close';

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <section className={Close.CLASS_NAME}>
                <section>
                    <div className="component-title">
                        <h1>close</h1>
                        <p className="returns">Returns : <span>Session</span></p>
                    </div>
                    <hr role="presentation" />
                    <p>
                        This method closes connection to WebSocket server.
                    </p>
                </section>
                <section className="codepen">
                    <iframe height='265' scrolling='no' title='Session#close | XSound - Web Audio API Library -' src='//codepen.io/Korilakkuma/embed/RyvrQq/?height=265&amp;theme-id=0&amp;default-tab=js,result&amp;embed-version=2' frameBorder='no' allowtransparency='true' allowFullScreen='true' style={{ width : '100%' }}>See the Pen <a href='https://codepen.io/Korilakkuma/pen/RyvrQq/'>Session#close | XSound - Web Audio API Library -</a> by Tomohiro IKEDA (<a href='https://codepen.io/Korilakkuma'>@Korilakkuma</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
                </section>
            </section>
        );
    }
}

export default connect()(Close);
