'use strict';

import React from 'react';
import { connect } from 'react-redux';

class ToJSON extends React.Component {
    static TITLE      = 'OneshotModule#toJSON';
    static CLASS_NAME = 'ToJSON';

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <section className={ToJSON.CLASS_NAME}>
                <section>
                    <div className="component-title">
                        <h1>toJSON</h1>
                        <p className="returns">Returns : <span>string (JSON)</span></p>
                    </div>
                    <hr role="presentation" />
                    <p>
                        This method gets the JSON for parameters.
                    </p>
                </section>
                <section className="codepen">
                    <iframe height='265' scrolling='no' title='OneshotModule#toJSON | XSound - Web Audio API Library -' src='//codepen.io/Korilakkuma/embed/NyLeBL/?height=265&amp;theme-id=0&amp;default-tab=js,result&amp;embed-version=2' frameBorder='no' allowtransparency='true' allowFullScreen='true' style={{ width : '100%' }}>See the Pen <a href='https://codepen.io/Korilakkuma/pen/NyLeBL/'>OneshotModule#toJSON | XSound - Web Audio API Library -</a> by Tomohiro IKEDA (<a href='https://codepen.io/Korilakkuma'>@Korilakkuma</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
                </section>
            </section>
        );
    }
}

export default connect()(ToJSON);
