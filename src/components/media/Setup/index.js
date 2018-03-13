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
                        <p className="returns">Returns : <span>MediaModule</span></p>
                    </div>
                    <hr role="presentation" />
                    <p>
                        This method setups HTMLMediaElement, media formats and event listeners.
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
                                        <dt>media<span className="argument-type">HTMLAudioElement</span> or <span className="argument-type">HTMLVideoElement</span></dt>
                                        <dd>This value is the instance of HTMLAudioElement or HTMLVideoElement.</dd>
                                        <dt>formats<span className="argument-type">Array</span></dt>
                                        <dd>This value is the array that contains media formats.</dd>
                                        <dt>listeners<span className="argument-type">Object</span></dt>
                                        <dd>This value is the associative array that contains event listeners that are defined by HTMLMediaElement.</dd>
                                        <dt>autoplay<span className="argument-type">boolean</span></dt>
                                        <dd>This value should be true in the case of autoplay. The default value is false.</dd>
                                    </dl>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </section>
                <section className="codepen">
                    <iframe height='265' scrolling='no' title='MediaModule#setup | XSound - Web Audio API Library -' src='//codepen.io/Korilakkuma/embed/BYXeZb/?height=265&amp;theme-id=0&amp;default-tab=js,result&amp;embed-version=2' frameBorder='no' allowtransparency='true' allowFullScreen='true' style={{ width : '100%' }}>See the Pen <a href='https://codepen.io/Korilakkuma/pen/BYXeZb/'>MediaModule#setup | XSound - Web Audio API Library -</a> by Tomohiro IKEDA (<a href='https://codepen.io/Korilakkuma'>@Korilakkuma</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
                </section>
            </section>
        );
    }
}

export default connect()(Setup);
