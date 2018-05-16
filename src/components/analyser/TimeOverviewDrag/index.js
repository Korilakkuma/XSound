'use strict';

import React from 'react';
import { connect } from 'react-redux';

class TimeOverviewDrag extends React.Component {
    static CLASS_NAME = 'TimeOverviewDrag';

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <section className={TimeOverviewDrag.CLASS_NAME}>
                <section>
                    <div className="component-title">
                        <h1>TimeOverview#drag</h1>
                        <p className="returns">Returns : <span>TimeOverview</span></p>
                    </div>
                    <hr role="presentation" />
                    <p>
                        This method sets current time by drag.
                    </p>
                    <table>
                        <caption>Arguments</caption>
                        <thead><tr><th scope="col"></th><th scope="col">Type</th><th scope="col">Description</th></tr></thead>
                        <tbody>
                            <tr>
                                <th scope="row">1st</th>
                                <td><span className="argument-type">Function</span></td>
                                <td>This function is invoked during drag.</td>
                            </tr>
                        </tbody>
                    </table>
                </section>
                <section className="codepen">
                    <iframe height='265' scrolling='no' title='TimeOverview#drag | XSound - Web Audio API Library -' src='//codepen.io/Korilakkuma/embed/wjjoxa/?height=265&amp;theme-id=0&amp;default-tab=js,result&amp;embed-version=2' frameBorder='no' allowtransparency='true' allowFullScreen='true' style={{ width : '100%' }}>See the Pen <a href='https://codepen.io/Korilakkuma/pen/wjjoxa/'>TimeOverview#drag | XSound - Web Audio API Library -</a> by Tomohiro IKEDA (<a href='https://codepen.io/Korilakkuma'>@Korilakkuma</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
                </section>
            </section>
        );
    }
}

export default connect()(TimeOverviewDrag);
