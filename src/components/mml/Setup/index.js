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
                        <p className="returns">Returns : <span>MML</span></p>
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
                                <td><span className="argument-type">Object</span></td>
                                <td>
                                    This argument is plain object that has the following properties.
                                    <dl className="list-marker">
                                        <dt>start<span className="argument-type">Function</span></dt>
                                        <dd>This callback function is invoked when the MML starts.</dd>
                                        <dt>stop<span className="argument-type">Function</span></dt>
                                        <dd>This callback function is invoked when the MML stops.</dd>
                                        <dt>ended<span className="argument-type">Function</span></dt>
                                        <dd>This callback function is invoked when the MML ended.</dd>
                                        <dt>error<span className="argument-type">Function</span></dt>
                                        <dd>This callback function is invoked when the MML is incorrect.</dd>
                                    </dl>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </section>
                <section className="codepen">
                    <iframe height='265' scrolling='no' title='MML#setup | XSound - Web Audio API Library -' src='//codepen.io/Korilakkuma/embed/zWLxBP/?height=265&amp;theme-id=0&amp;default-tab=js,result&amp;embed-version=2' frameBorder='no' allowtransparency='true' allowFullScreen='true' style={{ width : '100%' }}>See the Pen <a href='https://codepen.io/Korilakkuma/pen/zWLxBP/'>MML#setup | XSound - Web Audio API Library -</a> by Tomohiro IKEDA (<a href='https://codepen.io/Korilakkuma'>@Korilakkuma</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
                </section>
            </section>
        );
    }
}

export default connect()(Setup);
