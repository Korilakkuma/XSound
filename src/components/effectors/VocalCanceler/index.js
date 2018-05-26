'use strict';

import React from 'react';
import { connect } from 'react-redux';

class VocalCanceler extends React.Component {
    static TITLE      = 'Vocal Canceler';
    static CLASS_NAME = 'VocalCanceler';

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <section className={VocalCanceler.CLASS_NAME}>
                <section>
                    <div className="component-title">
                        <h1>vocalcanceler</h1>
                        <p className="applicable">Applicable : <span>AudioModule | MediaModule</span></p>
                    </div>
                    <hr role="presentation" />
                    <p>
                        This module is Vocal Canceler.
                    </p>
                    <table>
                        <caption>Parameters</caption>
                        <thead><tr><th scope="col"></th><th scope="col">Type</th><th scope="col">Value</th><th scope="col">Default</th></tr></thead>
                        <tbody>
                            <tr>
                                <th scope="row">depth</th>
                                <td><span className="param-type">number</span></td>
                                <td>0 &lt;= value &lt;= 1</td>
                                <td>0</td>
                            </tr>
                        </tbody>
                    </table>
                </section>
                <section className="codepen">
                    <iframe height='265' scrolling='no' title='VocalCanceler | XSound - Web Audio API Library -' src='//codepen.io/Korilakkuma/embed/jxmvpQ/?height=265&amp;theme-id=0&amp;default-tab=js,result&amp;embed-version=2' frameBorder='no' allowtransparency='true' allowFullScreen='true' style={{ width : '100%' }}>See the Pen <a href='https://codepen.io/Korilakkuma/pen/jxmvpQ/'>VocalCanceler | XSound - Web Audio API Library -</a> by Tomohiro IKEDA (<a href='https://codepen.io/Korilakkuma'>@Korilakkuma</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
                </section>
            </section>
        );
    }
}

export default connect()(VocalCanceler);
