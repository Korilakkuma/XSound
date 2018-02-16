'use strict';

import React from 'react';
import { connect } from 'react-redux';

class OscillatorParam extends React.Component {
    static CLASS_NAME = 'OscillatorParam';

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <section className={OscillatorParam.CLASS_NAME}>
                <section>
                    <div className="component-title">
                        <h1>Oscillator#param</h1>
                        <p className="returns">Returns : <span>number | string | Oscillator</span></p>
                    </div>
                    <hr role="presentation" />
                    <p>
                        This method gets or sets parameters of each oscillator.
                    </p>
                    <table>
                        <caption>Arguments</caption>
                        <thead><tr><th scope="col"></th><th scope="col">Type</th><th scope="col">Description</th></tr></thead>
                        <tbody>
                            <tr>
                                <th scope="row">1st</th>
                                <td><span className="argument-type">string</span></td>
                                <td>This value is key for parameters.</td>
                            </tr>
                            <tr>
                                <th scope="row">2nd</th>
                                <td><span className="argument-type">number</span> or <span className="argument-type">string</span> or <span className="argument-type">undefined</span></td>
                                <td>This value is value for parameters. If this value is <code>undefined</code>, this method is getter.</td>
                            </tr>
                        </tbody>
                    </table>
                    <p>or,</p>
                    <table>
                        <caption>Arguments</caption>
                        <thead><tr><th scope="col"></th><th scope="col">Type</th><th scope="col">Description</th></tr></thead>
                        <tbody>
                            <tr>
                                <th scope="row">1st</th>
                                <td><span className="argument-type">object</span></td>
                                <td>This value is associative array for parameters.</td>
                            </tr>
                        </tbody>
                    </table>
                </section>
                <section className="codepen">
                    <iframe height='265' scrolling='no' title='Oscillator#param | XSound - Web Audio API Library -' src='//codepen.io/Korilakkuma/embed/MQQjXr/?height=265&amp;theme-id=0&amp;default-tab=js,result&amp;embed-version=2' frameBorder='no' allowtransparency='true' allowFullScreen='true' style={{ width : '100%' }}>See the Pen <a href='https://codepen.io/Korilakkuma/pen/MQQjXr/'>Oscillator#param | XSound - Web Audio API Library -</a> by Tomohiro IKEDA (<a href='https://codepen.io/Korilakkuma'>@Korilakkuma</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
                </section>
            </section>
        );
    }
}

export default connect()(OscillatorParam);
