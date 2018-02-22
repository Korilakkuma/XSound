'use strict';

import React from 'react';
import { connect } from 'react-redux';

class Ready extends React.Component {
    static CLASS_NAME = 'Ready';

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <section className={Ready.CLASS_NAME}>
                <section>
                    <div className="component-title">
                        <h1>ready</h1>
                        <p className="returns">Returns : <span>OneshotModule</span></p>
                    </div>
                    <hr role="presentation" />
                    <p>
                        This method sets sound scheduling.
                    </p>
                    <table>
                        <caption>Arguments</caption>
                        <thead><tr><th scope="col"></th><th scope="col">Type</th><th scope="col">Description</th></tr></thead>
                        <tbody>
                            <tr>
                                <th scope="row">1st</th>
                                <td><span className="argument-type">number</span></td>
                                <td>This value is the start time.</td>
                            </tr>
                            <tr>
                                <th scope="row">2nd</th>
                                <td><span className="argument-type">number</span></td>
                                <td>This value is the duration time.</td>
                            </tr>
                        </tbody>
                    </table>
                </section>
                <section className="codepen">
                    <iframe height='265' scrolling='no' title='OneshotModule#ready | XSound - Web Audio API Library -' src='//codepen.io/Korilakkuma/embed/EQRRKo/?height=265&amp;theme-id=0&amp;default-tab=js,result&amp;embed-version=2' frameBorder='no' allowtransparency='true' allowFullScreen='true' style={{ width : '100%' }}>See the Pen <a href='https://codepen.io/Korilakkuma/pen/EQRRKo/'>OneshotModule#ready | XSound - Web Audio API Library -</a> by Tomohiro IKEDA (<a href='https://codepen.io/Korilakkuma'>@Korilakkuma</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
                </section>
            </section>
        );
    }
}

export default connect()(Ready);
