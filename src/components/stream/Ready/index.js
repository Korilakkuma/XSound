'use strict';

import React from 'react';
import { connect } from 'react-redux';

class Ready extends React.Component {
    static TITLE      = 'StreamModule#ready';
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
                        <p className="returns">Returns : <span>StreamModule</span></p>
                    </div>
                    <hr role="presentation" />
                    <p>
                        This method does not do anything.
                    </p>
                </section>
                <section className="codepen">
                    <iframe height='265' scrolling='no' title='StreamModule#ready | XSound - Web Audio API Library -' src='//codepen.io/Korilakkuma/embed/oqYrbM/?height=265&amp;theme-id=0&amp;default-tab=js,result&amp;embed-version=2' frameBorder='no' allowtransparency='true' allowFullScreen='true' style={{ width : '100%' }} allow="microphone *; camera *">See the Pen <a href='https://codepen.io/Korilakkuma/pen/oqYrbM/'>StreamModule#ready | XSound - Web Audio API Library -</a> by Tomohiro IKEDA (<a href='https://codepen.io/Korilakkuma'>@Korilakkuma</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
                </section>
            </section>
        );
    }
}

export default connect()(Ready);
