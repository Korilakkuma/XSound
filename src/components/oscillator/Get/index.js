'use strict';

import React from 'react';
import { connect } from 'react-redux';

class Get extends React.Component {
    static TITLE      = 'OscillatorModule#get';
    static CLASS_NAME = 'Get';

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <section className={Get.CLASS_NAME}>
                <section>
                    <div className="component-title">
                        <h1>get</h1>
                        <p className="returns">Returns : <span>Oscillator | Array</span></p>
                    </div>
                    <hr role="presentation" />
                    <p>
                        This method gets the instance of Oscillator or the array that contains the instance of Oscillator.
                    </p>
                </section>
                <table>
                    <caption>Arguments</caption>
                    <thead><tr><th scope="col"></th><th scope="col">Type</th><th scope="col">Description</th></tr></thead>
                    <tbody>
                        <tr>
                            <th scope="row">1st</th>
                            <td><span className="argument-type">number</span></td>
                            <td>This value is oscillator index.</td>
                        </tr>
                    </tbody>
                </table>
                <section className="codepen">
                    <iframe height='265' scrolling='no' title='OscillatorModule#get | XSound - Web Audio API Library -' src='//codepen.io/Korilakkuma/embed/wyqLjo/?height=265&amp;theme-id=0&amp;default-tab=js,result&amp;embed-version=2' frameBorder='no' allowtransparency='true' allowFullScreen='true' style={{ width : '100%' }}>See the Pen <a href='https://codepen.io/Korilakkuma/pen/wyqLjo/'>OscillatorModule#get | XSound - Web Audio API Library -</a> by Tomohiro IKEDA (<a href='https://codepen.io/Korilakkuma'>@Korilakkuma</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
                </section>
            </section>
        );
    }
}

export default connect()(Get);
