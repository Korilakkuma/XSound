'use strict';

import React from 'react';
import { connect } from 'react-redux';

class ExitFullscreen extends React.Component {
    static CLASS_NAME = 'ExitFullscreen';

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <section className={ExitFullscreen.CLASS_NAME}>
                <section>
                    <div className="component-title">
                        <h1>exitFullscreen</h1>
                        <p className="returns">Returns : <span>undefined</span></p>
                    </div>
                    <hr role="presentation" />
                    <p>
                        This method exits full screen.
                    </p>
                </section>
                <section className="codepen">
                    <iframe height='265' scrolling='no' title='exitFullscreen | XSound - Web Audio API Library -' src='//codepen.io/Korilakkuma/embed/LQpWpZ/?height=265&amp;theme-id=0&amp;default-tab=js,result&amp;embed-version=2' frameBorder='no' allowtransparency='true' allowFullScreen='true' style={{ width : '100%' }}>See the Pen <a href='https://codepen.io/Korilakkuma/pen/LQpWpZ/'>exitFullscreen | XSound - Web Audio API Library -</a> by Tomohiro IKEDA (<a href='https://codepen.io/Korilakkuma'>@Korilakkuma</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
                </section>
            </section>
        );
    }
}

export default connect()(ExitFullscreen);
