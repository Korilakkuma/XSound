'use strict';

import React from 'react';
import { connect } from 'react-redux';

class Compressor extends React.Component {
    static CLASS_NAME = 'Compressor';

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <section className={Compressor.CLASS_NAME}>
                <section>
                    <div className="component-title">
                        <h1>compressor</h1>
                        <p className="applicable">Applicable : <span>*</span></p>
                    </div>
                    <hr role="presentation" />
                    <p>
                        This module is Compressor.
                    </p>
                    <table>
                        <caption>Parameters</caption>
                        <thead><tr><th scope="col"></th><th scope="col">Type</th><th scope="col">Value</th><th scope="col">Default</th></tr></thead>
                        <tbody>
                            <tr>
                                <th scope="row">threshold</th>
                                <td><span className="param-type">number</span></td>
                                <td>-100 &lt;= value &lt;= 0</td>
                                <td>24</td>
                            </tr>
                            <tr>
                                <th scope="row">knee</th>
                                <td><span className="param-type">number</span></td>
                                <td>0 &lt;= value &lt;= 40</td>
                                <td>30</td>
                            </tr>
                            <tr>
                                <th scope="row">ratio</th>
                                <td><span className="param-type">number</span></td>
                                <td>1 &lt;= value &lt;= 20</td>
                                <td>12</td>
                            </tr>
                            <tr>
                                <th scope="row">attack</th>
                                <td><span className="param-type">number</span></td>
                                <td>0 &lt;= value &lt;= 1</td>
                                <td>0.003</td>
                            </tr>
                            <tr>
                                <th scope="row">release</th>
                                <td><span className="param-type">number</span></td>
                                <td>0 &lt;= value &lt;= 1</td>
                                <td>0.25</td>
                            </tr>
                        </tbody>
                    </table>
                </section>
                <section className="codepen">
                    <iframe height='265' scrolling='no' title='Compressor | XSound - Web Audio API Library -' src='//codepen.io/Korilakkuma/embed/rdEvdY/?height=265&amp;theme-id=0&amp;default-tab=js,result&amp;embed-version=2' frameBorder='no' allowtransparency='true' allowFullScreen='true' style={{ width : '100%' }}>See the Pen <a href='https://codepen.io/Korilakkuma/pen/rdEvdY/'>Compressor | XSound - Web Audio API Library -</a> by Tomohiro IKEDA (<a href='https://codepen.io/Korilakkuma'>@Korilakkuma</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
                </section>
            </section>
        );
    }
}

export default connect()(Compressor);
