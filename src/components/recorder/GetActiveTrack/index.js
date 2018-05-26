'use strict';

import React from 'react';
import { connect } from 'react-redux';

class GetActiveTrack extends React.Component {
    static TITLE      = 'Recorder#getActiveTrack';
    static CLASS_NAME = 'GetActiveTrack';

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <section className={GetActiveTrack.CLASS_NAME}>
                <section>
                    <div className="component-title">
                        <h1>getActiveTrack</h1>
                        <p className="returns">Returns : <span>number</span></p>
                    </div>
                    <hr role="presentation" />
                    <p>
                        This method gets the selected track number. If the selected track number does not exists, this method returns -1.
                    </p>
                </section>
                <section className="codepen">
                    <iframe height='265' scrolling='no' title='Recorder#getActiveTrack | XSound - Web Audio API Library -' src='//codepen.io/Korilakkuma/embed/PeXRMx/?height=265&amp;theme-id=0&amp;default-tab=js,result&amp;embed-version=2' frameBorder='no' allowtransparency='true' allowFullScreen='true' style={{ width : '100%' }}>See the Pen <a href='https://codepen.io/Korilakkuma/pen/PeXRMx/'>Recorder#getActiveTrack | XSound - Web Audio API Library -</a> by Tomohiro IKEDA (<a href='https://codepen.io/Korilakkuma'>@Korilakkuma</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
                </section>
            </section>
        );
    }
}

export default connect()(GetActiveTrack);
