'use strict';

import React from 'react';
import { connect } from 'react-redux';

class ConvertTime extends React.Component {
    static CLASS_NAME = 'ConvertTime';

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <section className={ConvertTime.CLASS_NAME}>
                <section>
                    <div className="component-title">
                        <h1>convertTime</h1>
                        <p className="returns">Returns : <span>object</span></p>
                    </div>
                    <hr role="presentation" />
                    <p>
                        This method returns the associative array that has 3 keys of &apos;minutes&apos;, &apos;seconds&apos;, and &apos;milliseconds&apos;.
                    </p>
                    <table>
                        <caption>Arguments</caption>
                        <thead><tr><th scope="col"></th><th scope="col">Type</th><th scope="col">Description</th></tr></thead>
                        <tbody>
                            <tr>
                                <th scope="row">1st</th>
                                <td><span className="type">number</span></td>
                                <td>
                                    The unit of this value is seconds.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </section>
                <section className="codepen">
                    <iframe height='265' scrolling='no' title='convertTime | XSound - Web Audio API Library -' src='//codepen.io/Korilakkuma/embed/vpbKwZ/?height=265&amp;theme-id=0&amp;default-tab=js,result&amp;embed-version=2' frameBorder='no' allowtransparency='true' allowFullScreen='true' style={{ width : '100%' }}>See the Pen <a href='https://codepen.io/Korilakkuma/pen/vpbKwZ/'>convertTime | XSound - Web Audio API Library -</a> by Tomohiro IKEDA (<a href='https://codepen.io/Korilakkuma'>@Korilakkuma</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
                </section>
            </section>
        );
    }
}

export default connect()(ConvertTime);
