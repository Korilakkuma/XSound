'use strict';

import React from 'react';
import { connect } from 'react-redux';

class Free extends React.Component {
    static CLASS_NAME = 'Free';

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <section className={Free.CLASS_NAME}>
                <section>
                    <div className="component-title">
                        <h1>free</h1>
                        <p className="returns">Returns : <span>undefined</span></p>
                    </div>
                    <hr role="presentation" />
                    <p>
                        This method releases memory for sound source. Namely, this method executes garbage collection (<abbr title="Garbage Collection">GC</abbr>) explicitly.
                    </p>
                    <table>
                        <caption>Arguments</caption>
                        <thead><tr><th scope="col"></th><th scope="col">Type</th><th scope="col">Description</th></tr></thead>
                        <tbody>
                            <tr>
                                <th>1st</th>
                                <td><span className="argument-type">Array</span> or <span className="argument-type">SoundModule</span></td>
                                <td>
                                    This argument is the array that contains sound source object.
                                    Or, This argument is sound source object.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </section>
                <section className="codepen">
                    <iframe height='265' scrolling='no' title='free | XSound - Web Audio API Library -' src='//codepen.io/Korilakkuma/embed/ypwoXW/?height=265&amp;theme-id=0&amp;default-tab=js,result&amp;embed-version=2' frameBorder='no' allowtransparency='true' allowFullScreen='true' style={{ width : '100%' }}>See the Pen <a href='https://codepen.io/Korilakkuma/pen/ypwoXW/'>free | XSound - Web Audio API Library -</a> by Tomohiro IKEDA (<a href='https://codepen.io/Korilakkuma'>@Korilakkuma</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
                </section>
            </section>
        );
    }
}

export default connect()(Free);
