'use strict';

import React from 'react';
import { connect } from 'react-redux';

class Decode extends React.Component {
    static CLASS_NAME = 'Decode';

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <section className={Decode.CLASS_NAME}>
                <section>
                    <div className="component-title">
                        <h1>decode</h1>
                        <p className="returns">Returns : <span>Promise</span></p>
                    </div>
                    <hr role="presentation" />
                    <p>
                        This method creates the instance of <code>AudioBuffer</code> by decoding <code>ArrayBuffer</code>.
                    </p>
                    <table>
                        <caption>Arguments</caption>
                        <thead><tr><th scope="col"></th><th scope="col">Type</th><th scope="col">Description</th></tr></thead>
                        <tbody>
                            <tr>
                                <th scope="row">1st</th>
                                <td><span className="argument-type">AudioContext</span></td>
                                <td>
                                    This argument is the instance of <code>AudioContext</code>.
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">2nd</th>
                                <td><span className="argument-type">ArrayBuffer</span></td>
                                <td>
                                    This argument is the instance of <code>ArrayBuffer</code>.
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">3rd</th>
                                <td><span className="argument-type">function</span></td>
                                <td>
                                    This argument is function that is invoked on success.
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">4th</th>
                                <td><span className="argument-type">function</span></td>
                                <td>
                                    This argument is function that is invoked on error.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </section>
                <section className="codepen">
                    <iframe height='265' scrolling='no' title='decode | XSound - Web Audio API Library -' src='//codepen.io/Korilakkuma/embed/zpeaZp/?height=265&amp;theme-id=0&amp;default-tab=js,result&amp;embed-version=2' frameBorder='no' allowtransparency='true' allowFullScreen='true' style={{ width : '100%' }}>See the Pen <a href='https://codepen.io/Korilakkuma/pen/zpeaZp/'>decode | XSound - Web Audio API Library -</a> by Tomohiro IKEDA (<a href='https://codepen.io/Korilakkuma'>@Korilakkuma</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
                </section>
            </section>
        );
    }
}

export default connect()(Decode);
