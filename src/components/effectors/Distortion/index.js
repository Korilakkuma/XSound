'use strict';

import React from 'react';
import { connect } from 'react-redux';

class Distortion extends React.Component {
    static TITLE      = 'Distortion';
    static CLASS_NAME = 'Distortion';

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <section className={Distortion.CLASS_NAME}>
                <section>
                    <div className="component-title">
                        <h1>distortion</h1>
                        <p className="applicable">Applicable : <span>*</span></p>
                    </div>
                    <hr role="presentation" />
                    <p>
                       This module is Distortion.
                    </p>
                    <table>
                        <caption>Parameters</caption>
                        <thead><tr><th scope="col"></th><th scope="col">Type</th><th scope="col">Value</th><th scope="col">Default</th></tr></thead>
                        <tbody>
                            <tr>
                                <th scope="row">curve</th>
                                <td><span className="param-type">string</span></td>
                                <td>&apos;clean&apos;, &apos;crunch&apos;, &apos;overdrive&apos;, &apos;distortion&apos;, &apos;fuzz&apos;</td>
                                <td>&apos;clean&apos;</td>
                            </tr>
                            <tr>
                                <th scope="row">samples</th>
                                <td><span className="param-type">number</span></td>
                                <td>value &gt; 0</td>
                                <td>4096</td>
                            </tr>
                            <tr>
                                <th scope="row">drive</th>
                                <td><span className="param-type">number</span></td>
                                <td>0 &lt;= value &lt;= 1</td>
                                <td>1</td>
                            </tr>
                            <tr>
                                <th scope="row">color</th>
                                <td><span className="param-type">number</span></td>
                                <td>10 &lt;= value &lt;= half the sample-rate</td>
                                <td>350</td>
                            </tr>
                            <tr>
                                <th scope="row">tone</th>
                                <td><span className="param-type">number</span></td>
                                <td>10 &lt;= value &lt;= half the sample-rate</td>
                                <td>350</td>
                            </tr>
                        </tbody>
                    </table>
                </section>
                <section className="codepen">
                    <iframe height='265' scrolling='no' title='Distortion | XSound - Web Audio API Library -' src='//codepen.io/Korilakkuma/embed/ELxEqa/?height=265&amp;theme-id=0&amp;default-tab=js,result&amp;embed-version=2' frameBorder='no' allowtransparency='true' allowFullScreen='true' style={{ width : '100%' }}>See the Pen <a href='https://codepen.io/Korilakkuma/pen/ELxEqa/'>Distortion | XSound - Web Audio API Library -</a> by Tomohiro IKEDA (<a href='https://codepen.io/Korilakkuma'>@Korilakkuma</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
                </section>
            </section>
        );
    }
}

export default connect()(Distortion);
