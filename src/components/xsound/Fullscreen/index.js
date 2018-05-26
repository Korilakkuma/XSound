'use strict';

import React from 'react';
import { connect } from 'react-redux';

class Fullscreen extends React.Component {
    static TITLE      = 'XSound.fullscreen';
    static CLASS_NAME = 'Fullscreen';

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <section className={Fullscreen.CLASS_NAME}>
                <section>
                    <div className="component-title">
                        <h1>fullscreen</h1>
                        <p className="returns">Returns : <span>undefined</span></p>
                    </div>
                    <hr role="presentation" />
                    <p>
                        This method changes HTMLElement to full screen.
                    </p>
                </section>
                <section className="codepen">
                    <iframe height='265' scrolling='no' title='fullscreen | XSound - Web Audio API Library -' src='//codepen.io/Korilakkuma/embed/ZrbLQo/?height=265&amp;theme-id=0&amp;default-tab=js,result&amp;embed-version=2' frameBorder='no' allowtransparency='true' allowFullScreen='true' style={{ width : '100%' }}>See the Pen <a href='https://codepen.io/Korilakkuma/pen/ZrbLQo/'>fullscreen | XSound - Web Audio API Library -</a> by Tomohiro IKEDA (<a href='https://codepen.io/Korilakkuma'>@Korilakkuma</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
                </section>
            </section>
        );
    }
}

export default connect()(Fullscreen);
