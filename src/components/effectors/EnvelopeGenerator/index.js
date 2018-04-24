'use strict';

import React from 'react';
import { connect } from 'react-redux';

class EnvelopeGenerator extends React.Component {
    static CLASS_NAME = 'EnvelopeGenerator';

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <section className={EnvelopeGenerator.CLASS_NAME}>
                <section>
                    <div className="component-title">
                        <h1>envelopegenerator</h1>
                        <p className="applicable">Applicable : <span>OscillatorModule | OneshotModule</span></p>
                    </div>
                    <hr role="presentation" />
                    <p>
                        This module is Envelope Generator.
                    </p>
                    <table>
                        <caption>Parameters</caption>
                        <thead><tr><th scope="col"></th><th scope="col">Type</th><th scope="col">Value</th><th scope="col">Default</th></tr></thead>
                        <tbody>
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
                                <td>0.5</td>
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
                    <iframe height='265' scrolling='no' title='EnvelopeGenerator | XSound - Web Audio API Library -' src='//codepen.io/Korilakkuma/embed/wjBmyJ/?height=265&amp;theme-id=0&amp;default-tab=js,result&amp;embed-version=2' frameBorder='no' allowtransparency='true' allowFullScreen='true' style={{ width : '100%' }}>See the Pen <a href='https://codepen.io/Korilakkuma/pen/wjBmyJ/'>EnvelopeGenerator | XSound - Web Audio API Library -</a> by Tomohiro IKEDA (<a href='https://codepen.io/Korilakkuma'>@Korilakkuma</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
                </section>
            </section>
        );
    }
}

export default connect()(EnvelopeGenerator);
