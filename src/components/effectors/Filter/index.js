'use strict';

import React from 'react';
import { connect } from 'react-redux';

class Filter extends React.Component {
    static CLASS_NAME = 'Filter';

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <section className={Filter.CLASS_NAME}>
                <section>
                    <div className="component-title">
                        <h1>filter</h1>
                        <p className="applicable">Applicable : <span>*</span></p>
                    </div>
                    <hr role="presentation" />
                    <p>
                        This module is Filter.
                    </p>
                    <table>
                        <caption>Parameters</caption>
                        <thead><tr><th scope="col"></th><th scope="col">Type</th><th scope="col">Value</th><th scope="col">Default</th></tr></thead>
                        <tbody>
                            <tr>
                                <th scope="row">type</th>
                                <td><span className="param-type">string</span></td>
                                <td>&apos;lowpass&apos;, &apos;highpass&apos;, &apos;bandpass&apos;, &apos;lowshelf&apos;, &apos;highshelf&apos;, &apos;peaking&apos;, &apos;notch&apos;, &apos;allpass&apos;</td>
                                <td>&apos;lowpass&apos;</td>
                            </tr>
                            <tr>
                                <th scope="row">frequency</th>
                                <td><span className="param-type">number</span></td>
                                <td>10 &lt;= value &lt;= half the sample-rate</td>
                                <td>350</td>
                            </tr>
                            <tr>
                                <th scope="row">Q</th>
                                <td><span className="param-type">number</span></td>
                                <td>0.0001 &lt;= value &lt;= 1000</td>
                                <td>1</td>
                            </tr>
                            <tr>
                                <th scope="row">gain</th>
                                <td><span className="param-type">number</span></td>
                                <td>-40 &lt;= value &lt;= 40</td>
                                <td>0</td>
                            </tr>
                            <tr>
                                <th scope="row">range</th>
                                <td><span className="param-type">number</span></td>
                                <td>0 &lt;= value &lt;= 1</td>
                                <td>0.1</td>
                            </tr>
                            <tr>
                                <th scope="row">attack</th>
                                <td><span className="param-type">number</span></td>
                                <td>0 &lt;= value &lt;= 1</td>
                                <td>0.01</td>
                            </tr>
                            <tr>
                                <th scope="row">decay</th>
                                <td><span className="param-type">number</span></td>
                                <td>0 &lt; value &lt;= 1</td>
                                <td>0.3</td>
                            </tr>
                            <tr>
                                <th scope="row">sustain</th>
                                <td><span className="param-type">number</span></td>
                                <td>0 &lt;= value &lt;= 1</td>
                                <td>1.0</td>
                            </tr>
                            <tr>
                                <th scope="row">release</th>
                                <td><span className="param-type">number</span></td>
                                <td>0 &lt; value &lt;= 1</td>
                                <td>1</td>
                            </tr>
                        </tbody>
                    </table>
                </section>
                <section className="codepen">
                    <iframe height='265' scrolling='no' title='Filter | XSound - Web Audio API Library -' src='//codepen.io/Korilakkuma/embed/BxoRmG/?height=265&amp;theme-id=0&amp;default-tab=js,result&amp;embed-version=2' frameBorder='no' allowtransparency='true' allowFullScreen='true' style={{ width : '100%' }}>See the Pen <a href='https://codepen.io/Korilakkuma/pen/BxoRmG/'>Filter | XSound - Web Audio API Library -</a> by Tomohiro IKEDA (<a href='https://codepen.io/Korilakkuma'>@Korilakkuma</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
                </section>
            </section>
        );
    }
}

export default connect()(Filter);
