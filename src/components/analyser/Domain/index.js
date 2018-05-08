'use strict';

import React from 'react';
import { connect } from 'react-redux';

class Domain extends React.Component {
    static CLASS_NAME = 'Domain';

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <section className={Domain.CLASS_NAME}>
                <section>
                    <div className="component-title">
                        <h1>domain</h1>
                        <p className="returns">Returns : <span>TimeOverview | Time | FFT</span></p>
                    </div>
                    <hr role="presentation" />
                    <p>
                        This method gets the instance of TimeOverview or Time or FFT.
                    </p>
                    <table>
                        <caption>Arguments</caption>
                        <thead><tr><th scope="col"></th><th scope="col">Type</th><th scope="col">Description</th></tr></thead>
                        <tbody>
                            <tr>
                                <th scope="row">1st</th>
                                <td><span className="argument-type">string</span></td>
                                <td>This value is one of &apos;timeOverviewL&apos;, &apos;timeOverviewR&apos;, &apos;time&apos;, &apos;fft&apos;.</td>
                            </tr>
                        </tbody>
                    </table>
                </section>
                <section className="codepen">
                    <iframe height='265' scrolling='no' title='Analyser#domain | XSound - Web Audio API Library -' src='//codepen.io/Korilakkuma/embed/xjrqWx/?height=265&amp;theme-id=0&amp;default-tab=js,result&amp;embed-version=2' frameBorder='no' allowtransparency='true' allowFullScreen='true' style={{ width : '100%' }}>See the Pen <a href='https://codepen.io/Korilakkuma/pen/xjrqWx/'>Analyser#domain | XSound - Web Audio API Library -</a> by Tomohiro IKEDA (<a href='https://codepen.io/Korilakkuma'>@Korilakkuma</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
                </section>
            </section>
        );
    }
}

export default connect()(Domain);
