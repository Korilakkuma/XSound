'use strict';

import React from 'react';
import { connect } from 'react-redux';

class NoConflict extends React.Component {
    static CLASS_NAME = 'NoConflict';

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <section className={NoConflict.CLASS_NAME}>
                <section>
                    <div className="component-title">
                        <h1>noConflict</h1>
                        <p className="returns">Returns : <span>XSound</span></p>
                    </div>
                    <hr role="presentation" />
                    <p>
                        This method deletes global object that is defined by this library.
                    </p>
                    <table>
                        <caption>Arguments</caption>
                        <thead><tr><th scope="col"></th><th scope="col">Type</th><th scope="col">Description</th></tr></thead>
                        <tbody>
                            <tr>
                                <th scope="row">1st</th>
                                <td><span className="argument-type">undefined</span> or <span className="argument-type">boolean</span></td>
                                <td>
                                    If argument is <var>true</var>, the both of global objects are deleted.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </section>
                <section className="codepen">
                    <iframe height='265' scrolling='no' title='noConflict | XSound - Web Audio API Library -' src='//codepen.io/Korilakkuma/embed/opVGya/?height=265&amp;theme-id=0&amp;default-tab=js,result&amp;embed-version=2' frameBorder='no' allowtransparency='true' allowFullScreen='true' style={{ width : '100%' }}>See the Pen <a href='https://codepen.io/Korilakkuma/pen/opVGya/'>noConflict | XSound - Web Audio API Library -</a> by Tomohiro IKEDA (<a href='https://codepen.io/Korilakkuma'>@Korilakkuma</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
                </section>
            </section>
        );
    }
}

export default connect()(NoConflict);
