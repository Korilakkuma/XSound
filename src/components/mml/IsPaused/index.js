'use strict';

import React from 'react';
import { connect } from 'react-redux';

class IsPaused extends React.Component {
    static TITLE      = 'MML#isPaused';
    static CLASS_NAME = 'IsPaused';

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <section className={IsPaused.CLASS_NAME}>
                <section>
                    <div className="component-title">
                        <h1>isPaused</h1>
                        <p className="returns">Returns : <span>boolean</span></p>
                    </div>
                    <hr role="presentation" />
                    <p>
                        This method is to check pause.
                    </p>
                </section>
                <section className="codepen">
                    <iframe height='265' scrolling='no' title='MML#isPaused | XSound - Web Audio API Library -' src='//codepen.io/Korilakkuma/embed/GxzPoj/?height=265&amp;theme-id=0&amp;default-tab=js,result&amp;embed-version=2' frameBorder='no' allowtransparency='true' allowFullScreen='true' style={{ width : '100%' }}>See the Pen <a href='https://codepen.io/Korilakkuma/pen/GxzPoj/'>MML#isPaused | XSound - Web Audio API Library -</a> by Tomohiro IKEDA (<a href='https://codepen.io/Korilakkuma'>@Korilakkuma</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
                </section>
            </section>
        );
    }
}

export default connect()(IsPaused);
