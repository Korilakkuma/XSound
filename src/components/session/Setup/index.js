'use strict';

import React from 'react';
import { connect } from 'react-redux';

class Setup extends React.Component {
    static TITLE      = 'Session#setup';
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
                        <p className="returns">Returns : <span>Session</span></p>
                    </div>
                    <hr role="presentation" />
                    <p>
                        This method connects to WebSocket server.
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
                                        <dt>tls <span className="argument-type">boolean</span></dt>
                                        <dd>If this value is true, &apos;wss&apos; is used. Otherwise, &apos;ws&apos; is used.</dd>
                                        <dt>host <span className="argument-type">string</span></dt>
                                        <dd>This value is either IP address or hostname.</dd>
                                        <dt>port <span className="argument-type">number</span></dt>
                                        <dd>This value is port number.</dd>
                                        <dt>path <span className="argument-type">string</span></dt>
                                        <dd>This value is WebSocket server&apos;s path.</dd>
                                        <dt>open <span className="argument-type">Function</span></dt>
                                        <dd>This function is invoked when connection to WebSocket server is established.</dd>
                                        <dt>close <span className="argument-type">Function</span></dt>
                                        <dd>This function is invoked when connection to WebSocket server is closed.</dd>
                                        <dt>error <span className="argument-type">Function</span></dt>
                                        <dd>This function is invoked on error.</dd>
                                    </dl>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </section>
                <section className="codepen">
                    <iframe height='265' scrolling='no' title='Session#setup | XSound - Web Audio API Library -' src='//codepen.io/Korilakkuma/embed/bMOMNy/?height=265&amp;theme-id=0&amp;default-tab=js,result&amp;embed-version=2' frameBorder='no' allowtransparency='true' allowFullScreen='true' style={{ width : '100%' }}>See the Pen <a href='https://codepen.io/Korilakkuma/pen/bMOMNy/'>Session#setup | XSound - Web Audio API Library -</a> by Tomohiro IKEDA (<a href='https://codepen.io/Korilakkuma'>@Korilakkuma</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
                </section>
            </section>
        );
    }
}

export default connect()(Setup);
