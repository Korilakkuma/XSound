'use strict';

import React from 'react';
import { connect } from 'react-redux';

class Phaser extends React.Component {
    static TITLE      = 'Phaser';
    static CLASS_NAME = 'Phaser';

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <section className={Phaser.CLASS_NAME}>
                <section>
                    <div className="component-title">
                        <h1>phaser</h1>
                        <p className="applicable">Applicable : <span>*</span></p>
                    </div>
                    <hr role="presentation" />
                    <p>
                        This module is Phaser.
                    </p>
                    <table>
                        <caption>Parameters</caption>
                        <thead><tr><th scope="col"></th><th scope="col">Type</th><th scope="col">Value</th><th scope="col">Default</th></tr></thead>
                        <tbody>
                            <tr>
                                <th scope="row">stage</th>
                                <td><span className="param-type">number</span></td>
                                <td>0, 2, 4, 8, 12, 24</td>
                                <td>12</td>
                            </tr>
                            <tr>
                                <th scope="row">frequency</th>
                                <td><span className="param-type">number</span></td>
                                <td>10 &lt;= value &lt;= half the sample-rate</td>
                                <td>350</td>
                            </tr>
                            <tr>
                                <th scope="row">resonance</th>
                                <td><span className="param-type">number</span></td>
                                <td>0.0001 &lt;= value &lt;= 1000</td>
                                <td>1</td>
                            </tr>
                            <tr>
                                <th scope="row">depth</th>
                                <td><span className="param-type">number</span></td>
                                <td>0 &lt;= value &lt;= 1</td>
                                <td>0</td>
                            </tr>
                            <tr>
                                <th scope="row">rate</th>
                                <td><span className="param-type">number</span></td>
                                <td>value &gt;= 0</td>
                                <td>0</td>
                            </tr>
                            <tr>
                                <th scope="row">mix</th>
                                <td><span className="param-type">number</span></td>
                                <td>0 &lt;= value &lt;= 1</td>
                                <td>0</td>
                            </tr>
                            <tr>
                                <th scope="row">feedback</th>
                                <td><span className="param-type">number</span></td>
                                <td>0 &lt;= value &lt;= 1</td>
                                <td>0</td>
                            </tr>
                        </tbody>
                    </table>
                </section>
                <section className="codepen">
                    <iframe height='265' scrolling='no' title='Phaser | XSound - Web Audio API Library -' src='//codepen.io/Korilakkuma/embed/KRMXvR/?height=265&amp;theme-id=0&amp;default-tab=js,result&amp;embed-version=2' frameBorder='no' allowtransparency='true' allowFullScreen='true' style={{ width : '100%' }}>See the Pen <a href='https://codepen.io/Korilakkuma/pen/KRMXvR/'>Phaser | XSound - Web Audio API Library -</a> by Tomohiro IKEDA (<a href='https://codepen.io/Korilakkuma'>@Korilakkuma</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
                </section>
            </section>
        );
    }
}

export default connect()(Phaser);
