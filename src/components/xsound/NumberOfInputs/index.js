'use strict';

import React from 'react';
import { connect } from 'react-redux';

class NumberOfInputs extends React.Component {
    static CLASS_NAME = 'NumberOfInputs';

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <section className={NumberOfInputs.CLASS_NAME}>
                <section>
                    <div className="component-title">
                        <h1>NUMBER_OF_INPUTS</h1>
                        <p className="type">Type : <span>number</span></p>
                    </div>
                    <hr role="presentation" />
                    <p>
                        This property is the number of input channels for <a href="http://webaudio.github.io/web-audio-api/#the-scriptprocessornode-interface---deprecated" target="_blank" rel="nofollow">ScriptProcessorNode</a>.
                        The default value is 2.
                    </p>
                </section>
                <section className="codepen">
                    <iframe height='265' scrolling='no' title='NUMBER_OF_INPUTS | XSound - Web Audio API Library -' src='//codepen.io/Korilakkuma/embed/EodRWJ/?height=265&amp;theme-id=0&amp;default-tab=js,result&amp;embed-version=2' frameBorder='no' allowtransparency='true' allowFullScreen='true' style={{ width : '100%' }}>See the Pen <a href='https://codepen.io/Korilakkuma/pen/EodRWJ/'>NUMBER_OF_INPUTS | XSound - Web Audio API Library -</a> by Tomohiro IKEDA (<a href='https://codepen.io/Korilakkuma'>@Korilakkuma</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
                </section>
            </section>
        );
    }
}

export default connect()(NumberOfInputs);
