'use strict';

import React from 'react';
import { connect } from 'react-redux';

class Clear extends React.Component {
    static CLASS_NAME = 'Clear';

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <section className={Clear.CLASS_NAME}>
                <section>
                    <div className="component-title">
                        <h1>clear</h1>
                        <p className="returns">Returns : <span>Recorder</span></p>
                    </div>
                    <hr role="presentation" />
                    <p>
                        This method clears the recorded sound data.
                    </p>
                    <table>
                        <caption>Arguments</caption>
                        <thead><tr><th scope="col"></th><th scope="col">Type</th><th scope="col">Description</th></tr></thead>
                        <tbody>
                            <tr>
                                <th scope="row">1st</th>
                                <td><span className="argument-type">number</span> or <span className="argument-type">string</span></td>
                                <td>This value is the target track number. If this value is &apos;all&apos;, the all of tracks are target.</td>
                            </tr>
                        </tbody>
                    </table>
                </section>
                <section className="codepen">
                    <iframe height='265' scrolling='no' title='Recorder#clear | XSound - Web Audio API Library -' src='//codepen.io/Korilakkuma/embed/VxVeZE/?height=265&amp;theme-id=0&amp;default-tab=js,result&amp;embed-version=2' frameBorder='no' allowtransparency='true' allowFullScreen='true' style={{ width : '100%' }}>See the Pen <a href='https://codepen.io/Korilakkuma/pen/VxVeZE/'>Recorder#clear | XSound - Web Audio API Library -</a> by Tomohiro IKEDA (<a href='https://codepen.io/Korilakkuma'>@Korilakkuma</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
                </section>
            </section>
        );
    }
}

export default connect()(Clear);
