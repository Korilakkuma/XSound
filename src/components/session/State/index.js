'use strict';

import React from 'react';
import { connect } from 'react-redux';

class State extends React.Component {
    static TITLE      = 'Session#state';
    static CLASS_NAME = 'State';

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <section className={State.CLASS_NAME}>
                <section>
                    <div className="component-title">
                        <h1>state</h1>
                        <p className="returns">Returns : <span>boolean | Session</span></p>
                    </div>
                    <hr role="presentation" />
                    <p>
                        This method gets or sets state of session.
                    </p>
                    <table>
                        <caption>Arguments</caption>
                        <thead><tr><th scope="col"></th><th scope="col">Type</th><th scope="col">Description</th></tr></thead>
                        <tbody>
                            <tr>
                                <th scope="row">1st</th>
                                <td><span className="argumnet-type">boolean</span> or <span className="argument-type">undefined</span></td>
                                <td>This value is to determine session state. If this value is undefined, this method is getter.</td>
                            </tr>
                        </tbody>
                    </table>
                </section>
                <section className="codepen">
                    <iframe height='265' scrolling='no' title='Session#state | XSound - Web Audio API Library -' src='//codepen.io/Korilakkuma/embed/pVGYGB/?height=265&amp;theme-id=0&amp;default-tab=js,result&amp;embed-version=2' frameBorder='no' allowtransparency='true' allowFullScreen='true' style={{ width : '100%' }}>See the Pen <a href='https://codepen.io/Korilakkuma/pen/pVGYGB/'>Session#state | XSound - Web Audio API Library -</a> by Tomohiro IKEDA (<a href='https://codepen.io/Korilakkuma'>@Korilakkuma</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
                </section>
            </section>
        );
    }
}

export default connect()(State);
