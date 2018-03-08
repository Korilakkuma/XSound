'use strict';

import React from 'react';
import { connect } from 'react-redux';

class Get extends React.Component {
    static CLASS_NAME = 'Get';

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <section className={Get.CLASS_NAME}>
                <section>
                    <div className="component-title">
                        <h1>get</h1>
                        <p className="returns">Returns : <span>AudioBufferSourceNode</span></p>
                    </div>
                    <hr role="presentation" />
                    <p>
                        This method gets the instance of AudioBufferSourceNode.
                    </p>
                </section>
                <section className="codepen">
                    <iframe height='265' scrolling='no' title='AudioModule#get | XSound - Web Audio API Library -' src='//codepen.io/Korilakkuma/embed/rJbbJj/?height=265&amp;theme-id=0&amp;default-tab=js,result&amp;embed-version=2' frameBorder='no' allowtransparency='true' allowFullScreen='true' style={{ width : '100%' }}>See the Pen <a href='https://codepen.io/Korilakkuma/pen/rJbbJj/'>AudioModule#get | XSound - Web Audio API Library -</a> by Tomohiro IKEDA (<a href='https://codepen.io/Korilakkuma'>@Korilakkuma</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
                </section>
            </section>
        );
    }
}

export default connect()(Get);
