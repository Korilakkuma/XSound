'use strict';

import React from 'react';
import { connect } from 'react-redux';

class IsMedia extends React.Component {
    static TITLE      = 'MediaModule#isMedia';
    static CLASS_NAME = 'IsMedia';

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <section className={IsMedia.CLASS_NAME}>
                <section>
                    <div className="component-title">
                        <h1>isMedia</h1>
                        <p className="returns">Returns : <span>boolean</span></p>
                    </div>
                    <hr role="presentation" />
                    <p>
                        This method is to check for presence or absence of HTMLMediaElement.
                    </p>
                </section>
                <section className="codepen">
                    <iframe height='265' scrolling='no' title='MediaModule#isMedia | XSound - Web Audio API Library -' src='//codepen.io/Korilakkuma/embed/geLYaj/?height=265&amp;theme-id=0&amp;default-tab=js,result&amp;embed-version=2' frameBorder='no' allowtransparency='true' allowFullScreen='true' style={{ width : '100%' }}>See the Pen <a href='https://codepen.io/Korilakkuma/pen/geLYaj/'>MediaModule#isMedia | XSound - Web Audio API Library -</a> by Tomohiro IKEDA (<a href='https://codepen.io/Korilakkuma'>@Korilakkuma</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
                </section>
            </section>
        );
    }
}

export default connect()(IsMedia);
