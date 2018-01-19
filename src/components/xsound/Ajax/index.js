'use strict';

import React from 'react';
import { connect } from 'react-redux';

class Ajax extends React.Component {
    static CLASS_NAME = 'Ajax';

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <section className={Ajax.CLASS_NAME}>
                <section>
                    <div className="component-title">
                        <h1>ajax</h1>
                        <p className="returns">Returns : <span>undefined</span></p>
                    </div>
                    <hr role="presentation" />
                    <p>
                        This method gets the instance of ArrayBuffer by <abbr title="Asynchronous JavaScript and XML">Ajax</abbr>.
                    </p>
                </section>
                <section className="codepen">
                    <iframe height='265' scrolling='no' title='ajax | XSound - Web Audio API Library -' src='//codepen.io/Korilakkuma/embed/PExBqJ/?height=265&amp;theme-id=0&amp;default-tab=js,result&amp;embed-version=2' frameBorder='no' allowtransparency='true' allowFullScreen='true' style={{ width : '100%'  }}>See the Pen <a href='https://codepen.io/Korilakkuma/pen/PExBqJ/'>ajax | XSound - Web Audio API Library -</a> by Tomohiro IKEDA (<a href='https://codepen.io/Korilakkuma'>@Korilakkuma</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
                </section>
            </section>
        );
    }
}

export default connect()(Ajax);
