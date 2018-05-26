'use strict';

import React from 'react';
import { connect } from 'react-redux';

class ToFrequencies extends React.Component {
    static TITLE      = 'XSound.toFrequencies';
    static CLASS_NAME = 'ToFrequencies';

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <section className={ToFrequencies.CLASS_NAME}>
                <section>
                    <div className="component-title">
                        <h1>toFrequencies</h1>
                        <p className="returns">Returns : <span>Array</span></p>
                    </div>
                    <hr role="presentation" />
                    <p>
                        This method returns array that contains frequency.
                    </p>
                    <table>
                        <caption>Arguments</caption>
                        <thead><tr><th scope="col"></th><th scope="col">Type</th><th scope="col">Description</th></tr></thead>
                        <tbody>
                            <tr>
                                <th scope="row">1st</th>
                                <td><span className="argument-type">Array</span> or <span className="argument-type">number</span></td>
                                <td>This value means the index that corresponds to 88 keyboards of Piano.</td>
                            </tr>
                        </tbody>
                    </table>
                </section>
                <section className="codepen">
                    <iframe height='265' scrolling='no' title='toFrequencies | XSound - Web Audio API Library -' src='//codepen.io/Korilakkuma/embed/LQGZwE/?height=265&amptheme-id=0&amp;default-tab=js,result&amp;embed-version=2' frameBorder='no' allowtransparency='true' allowFullScreen='true' style={{ width : '100%' }}>See the Pen <a href='https://codepen.io/Korilakkuma/pen/LQGZwE/'>toFrequencies | XSound - Web Audio API Library -</a> by Tomohiro IKEDA (<a href='https://codepen.io/Korilakkuma'>@Korilakkuma</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
                </section>
            </section>
        );
    }
}

export default connect()(ToFrequencies);
