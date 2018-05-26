'use strict';

import React from 'react';
import { connect } from 'react-redux';

class TimeOverviewUpdate extends React.Component {
    static TITLE      = 'TimeOverview#update';
    static CLASS_NAME = 'TimeOverviewUpdate';

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <section className={TimeOverviewUpdate.CLASS_NAME}>
                <section>
                    <div className="component-title">
                        <h1>TimeOverview#update</h1>
                        <p className="returns">Returns : <span>TimeOverview</span></p>
                    </div>
                    <hr role="presentation" />
                    <p>
                        This method draws the current time of audio on Canvas or SVG.
                    </p>
                    <table>
                        <caption>Arguments</caption>
                        <thead><tr><th scope="col"></th><th scope="col">Type</th><th scope="col">Description</th></tr></thead>
                        <tbody>
                            <tr>
                                <th scope="row">1st</th>
                                <td><span className="argument-type">number</span></td>
                                <td>This value is the current time of audio.</td>
                            </tr>
                        </tbody>
                    </table>
                </section>
                <section className="codepen">
                    <iframe height='265' scrolling='no' title='TimeOverview#update | XSound - Web Audio API Library -' src='//codepen.io/Korilakkuma/embed/NMYgJB/?height=265&amp;theme-id=0&amp;default-tab=js,result&amp;embed-version=2' frameBorder='no' allowtransparency='true' allowFullScreen='true' style={{ width : '100%' }}>See the Pen <a href='https://codepen.io/Korilakkuma/pen/NMYgJB/'>TimeOverview#update | XSound - Web Audio API Library -</a> by Tomohiro IKEDA (<a href='https://codepen.io/Korilakkuma'>@Korilakkuma</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
                </section>
            </section>
        );
    }
}

export default connect()(TimeOverviewUpdate);
