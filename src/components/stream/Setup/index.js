'use strict';

import React from 'react';
import { connect } from 'react-redux';

class Setup extends React.Component {
    static TITLE      = 'StreamModule#setup';
    static CLASS_NAME = 'Setup';

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <section className={Setup.CLASS_NAME}>
                <section>
                    <div className="component-title">
                        <h1>setup</h1>
                        <p className="returns">Returns : <span>StreamModule</span></p>
                    </div>
                    <hr role="presentation" />
                    <p>
                        This method setups streaming.
                    </p>
                    <table>
                        <caption>Arguments</caption>
                        <thead><tr><th scope="col"></th><th scope="col">Type</th><th scope="col">Description</th></tr></thead>
                        <tbody>
                            <tr>
                                <th scope="row">1st</th>
                                <td><span className="argument-type">Object</span></td>
                                <td>This value is to determine constraints for WebRTC.</td>
                            </tr>
                            <tr>
                                <th scope="row">2nd</th>
                                <td><span className="argument-type">Function</span></td>
                                <td>This function is invoked during streaming.</td>
                            </tr>
                            <tr>
                                <th scope="row">3rd</th>
                                <td><span className="argument-type">Function</span></td>
                                <td>This function is invoked on error.</td>
                            </tr>
                        </tbody>
                    </table>
                </section>
                <section className="codepen">
                    <iframe height='265' scrolling='no' title='StreamModule#setup | XSound - Web Audio API Library -' src='//codepen.io/Korilakkuma/embed/YapbRv/?height=265&amp;theme-id=0&amp;default-tab=js,result&amp;embed-version=2' frameBorder='no' allowtransparency='true' allowFullScreen='true' style={{ width : '100%' }} allow="microphone *; camera *">See the Pen <a href='https://codepen.io/Korilakkuma/pen/YapbRv/'>StreamModule#setup | XSound - Web Audio API Library -</a> by Tomohiro IKEDA (<a href='https://codepen.io/Korilakkuma'>@Korilakkuma</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
                </section>
            </section>
        );
    }
}

export default connect()(Setup);
