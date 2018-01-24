'use strict';

import React from 'react';
import { connect } from 'react-redux';

class NumberOfOutputs extends React.Component {
    static CLASS_NAME = 'NumberOfOutputs';

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <section className={NumberOfOutputs.CLASS_NAME}>
                <section>
                    <div className="component-title">
                        <h1>NUMBER_OF_OUTPUTS</h1>
                        <p className="type">Type : <span>number</span></p>
                    </div>
                    <hr role="presentation" />
                    <p>
                        This property is the number of output channels for <a href="http://webaudio.github.io/web-audio-api/#the-scriptprocessornode-interface---deprecated" target="_blank" rel="noopener noreferrer nofollow">ScriptProcessorNode</a>.
                        The default value is 2.
                    </p>
                </section>
                <section className="codepen">
                    <iframe height='265' scrolling='no' title='NUMBER_OF_OUTPUTS | XSound - Web Audio API Library -' src='//codepen.io/Korilakkuma/embed/XVyYXY/?height=265&amp;theme-id=0&amp;default-tab=js,result&amp;embed-version=2' frameBorder='no' allowtransparency='true' allowFullScreen='true' style={{ width : '100%' }}>See the Pen <a href='https://codepen.io/Korilakkuma/pen/XVyYXY/'>NUMBER_OF_OUTPUTS | XSound - Web Audio API Library -</a> by Tomohiro IKEDA (<a href='https://codepen.io/Korilakkuma'>@Korilakkuma</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
                </section>
            </section>
        );
    }
}

export default connect()(NumberOfOutputs);
