'use strict';

import React from 'react';
import { connect } from 'react-redux';

class Create extends React.Component {
    static CLASS_NAME = 'Create';

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <section className={Create.CLASS_NAME}>
                <section>
                    <div className="component-title">
                        <h1>create</h1>
                        <p className="returns">Returns : <span>string (Data URL or Object URL)</span></p>
                    </div>
                    <hr role="presentation" />
                    <p>
                        This method creates WAVE file from the recorded sound.
                    </p>
                    <table>
                        <caption>Arguments</caption>
                        <thead><tr><th scope="col"></th><th scope="col">Type</th><th scope="col">Description</th></tr></thead>
                        <tbody>
                            <tr>
                                <th scope="row">1st</th>
                                <td><span className="argument-type">number</span> or <span className="argument-type">string</span></td>
                                <td>This value is the target track number. If this value is &apos;all&apos;, the all of tracks are target.</td>
                            </tr>
                            <tr>
                                <th scope="row">2nd</th>
                                <td><span className="argument-type">number</span></td>
                                <td>This value is the number of channels. So, this value is either 1 or 2.</td>
                            </tr>
                            <tr>
                                <td scope="row">3rd</td>
                                <td><span className="argument-type">number</span></td>
                                <td>This value is quantization bit. So, this value is either 8 (bit) or 16 (bit).</td>
                            </tr>
                        </tbody>
                    </table>
                </section>
                <section className="codepen">
                    <iframe height='265' scrolling='no' title='Recorder#create | XSound - Web Audio API Library -' src='//codepen.io/Korilakkuma/embed/erQxgP/?height=265&amp;theme-id=0&amp;default-tab=js,result&amp;embed-version=2' frameBorder='no' allowtransparency='true' allowFullScreen='true' style={{ width : '100%' }}>See the Pen <a href='https://codepen.io/Korilakkuma/pen/erQxgP/'>Recorder#create | XSound - Web Audio API Library -</a> by Tomohiro IKEDA (<a href='https://codepen.io/Korilakkuma'>@Korilakkuma</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
                </section>
            </section>
        );
    }
}

export default connect()(Create);
