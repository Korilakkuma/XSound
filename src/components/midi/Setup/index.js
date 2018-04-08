'use strict';

import React from 'react';
import { connect } from 'react-redux';

class Setup extends React.Component {
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
                        <p className="returns">Returns : <span>MIDI</span></p>
                    </div>
                    <hr role="presentation" />
                    <p>
                        This method setups callback functions.
                    </p>
                    <table>
                        <caption>Arguments</caption>
                        <thead><tr><th scope="col"></th><th scope="col">Type</th><th scope="col">Description</th></tr></thead>
                        <tbody>
                            <tr>
                                <th scope="row">1st</th>
                                <td><span className="argument-type">boolean</span></td>
                                <td>
                                    This value is to determine whether using system exclusive message.
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">2nd</th>
                                <td><span className="argument-type">Function</span></td>
                                <td>
                                    This callback function is invoked when access to the device is successful.
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">3rd</th>
                                <td><span className="argument-type">Function</span></td>
                                <td>
                                    This callback function is invoked when access to the device is failure.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </section>
                <section className="codepen">
                    <iframe height='265' scrolling='no' title='MIDI#setup | XSound - Web Audio API Library -' src='//codepen.io/Korilakkuma/embed/EEoWxq/?height=265&amp;theme-id=0&amp;default-tab=js,result&amp;embed-version=2' frameBorder='no' allowtransparency='true' allowFullScreen='true' style={{ width : '100%' }} allow='midi *'>See the Pen <a href='https://codepen.io/Korilakkuma/pen/EEoWxq/'>MIDI#setup | XSound - Web Audio API Library -</a> by Tomohiro IKEDA (<a href='https://codepen.io/Korilakkuma'>@Korilakkuma</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
                </section>
            </section>
        );
    }
}

export default connect()(Setup);
