'use strict';

import React from 'react';
import { connect } from 'react-redux';

class VisualizerState extends React.Component {
    static CLASS_NAME = 'VisualizerState';

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <section className={VisualizerState.CLASS_NAME}>
                <section>
                    <div className="component-title">
                        <h1>Visualizer#state</h1>
                        <p className="returns">Returns : <span>boolean | (TimeOverview | Time | FFT)</span></p>
                    </div>
                    <hr role="presentation" />
                    <p>
                        This method gets or sets state of analyser.
                    </p>
                    <table>
                        <caption>Arguments</caption>
                        <thead><tr><th scope="col"></th><th scope="col">Type</th><th scope="col">Description</th></tr></thead>
                        <tbody>
                            <tr>
                                <th scope="row">1st</th>
                                <td><span className="argument-type">boolean</span> or <span className="argument-type">undefined</span></td>
                                <td>This value is to determine analyser state. If this value is undefined, this method is getter.</td>
                            </tr>
                        </tbody>
                    </table>
                </section>
                <section className="codepen">
                    <iframe height='265' scrolling='no' title='Visualizer#state | XSound - Web Audio API Library -' src='//codepen.io/Korilakkuma/embed/QrQgJz/?height=265&amp;theme-id=0&amp;default-tab=js,result&amp;embed-version=2' frameBorder='no' allowtransparency='true' allowFullScreen='true' style={{ width : '100%' }}>See the Pen <a href='https://codepen.io/Korilakkuma/pen/QrQgJz/'>Visualizer#state | XSound - Web Audio API Library -</a> by Tomohiro IKEDA (<a href='https://codepen.io/Korilakkuma'>@Korilakkuma</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
                </section>
            </section>
        );
    }
}

export default connect()(VisualizerState);
