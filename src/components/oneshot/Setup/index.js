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
                        <p className="returns">Returns : <span>OneshotModule</span></p>
                    </div>
                    <hr role="presentation" />
                    <p>
                        This method setups one-shot audios.
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
                                        <dt>resources<span className="argument-type">Array</span></dt>
                                        <dd>This value is the array that contains one-shot URL or the instances of AudioBuffer.</dd>
                                        <dt>settings<span className="argument-type">Object</span></dt>
                                        <dd>Please refer to the following sample code.</dd>
                                        <dt>timeout<span className="argument-type">number</span></dt>
                                        <dd>This value is Ajax timeout.</dd>
                                        <dt>success<span className="argument-type">Function</span></dt>
                                        <dd>This function is invoked on load success.</dd>
                                        <dt>error<span className="argument-type">Function</span></dt>
                                        <dd>This function is invoked on load error.</dd>
                                        <dt>progress<span className="argument-type">Function</span></dt>
                                        <dd>This function is invoked while file is loaded.</dd>
                                    </dl>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </section>
                <section className="codepen">
                    <iframe height='265' scrolling='no' title='OneshotModule#setup | XSound - Web Audio API Library -' src='//codepen.io/Korilakkuma/embed/LQmmrm/?height=265&amp;theme-id=0&amp;default-tab=js,result&amp;embed-version=2' frameBorder='no' allowtransparency='true' allowFullScreen='true' style={{ width : '100%' }}>See the Pen <a href='https://codepen.io/Korilakkuma/pen/LQmmrm/'>OneshotModule#setup | XSound - Web Audio API Library -</a> by Tomohiro IKEDA (<a href='https://codepen.io/Korilakkuma'>@Korilakkuma</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
                </section>
            </section>
        );
    }
}

export default connect()(Setup);
