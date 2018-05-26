'use strict';

import React from 'react';
import { connect } from 'react-redux';

class Glide extends React.Component {
    static TITLE      = 'Glide';
    static CLASS_NAME = 'Glide';

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <section className={Glide.CLASS_NAME}>
                <section>
                    <div className="component-title">
                        <h1>glide</h1>
                        <p className="applicable">Applicable : <span>OscillatorModule</span></p>
                    </div>
                    <hr role="presentation" />
                    <p>
                        This module is Glide.
                    </p>
                    <table>
                        <caption>Parameters</caption>
                        <thead><tr><th scope="col"></th><th scope="col">Type</th><th scope="col">Value</th><th scope="col">Default</th></tr></thead>
                        <tbody>
                            <tr>
                                <th scope="row">time</th>
                                <td><span className="param-type">number</span></td>
                                <td>value &gt;= 0</td>
                                <td>0</td>
                            </tr>
                            <tr>
                                <th scope="row">type</th>
                                <td><span className="param-type">string</span></td>
                                <td>&apos;linear&apos; or &apos;exponential&apos;</td>
                                <td>&apos;linear&apos;</td>
                            </tr>
                        </tbody>
                    </table>
                </section>
                <section className="codepen">
                    <iframe height='265' scrolling='no' title='Glide | XSound - Web Audio API Library -' src='//codepen.io/Korilakkuma/embed/OZNgRa/?height=265&amp;theme-id=0&amp;default-tab=js,result&amp;embed-version=2' frameBorder='no' allowtransparency='true' allowFullScreen='true' style={{ width : '100%' }}>See the Pen <a href='https://codepen.io/Korilakkuma/pen/OZNgRa/'>Glide | XSound - Web Audio API Library -</a> by Tomohiro IKEDA (<a href='https://codepen.io/Korilakkuma'>@Korilakkuma</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
                </section>
            </section>
        );
    }
}

export default connect()(Glide);
