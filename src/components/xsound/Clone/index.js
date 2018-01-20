'use strict';

import React from 'react';
import { connect } from 'react-redux';

class Clone extends React.Component {
    static CLASS_NAME = 'Clone';

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <section className={Clone.CLASS_NAME}>
                <section>
                    <div className="component-title">
                        <h1>clone</h1>
                        <p className="returns">Returns : <span>function</span></p>
                    </div>
                    <hr role="presentation" />
                    <p>
                        This method clones <var>XSound</var> function.
                    </p>
                </section>
                <section className="codepen">
                    <iframe height='265' scrolling='no' title='clone | XSound - Web Audio API Library -' src='//codepen.io/Korilakkuma/embed/VygjVP/?height=265&amp;theme-id=0&amp;default-tab=js,result&amp;embed-version=2' frameBorder='no' allowtransparency='true' allowFullScreen='true' style={{ width : '100%' }}>See the Pen <a href='https://codepen.io/Korilakkuma/pen/VygjVP/'>clone | XSound - Web Audio API Library -</a> by Tomohiro IKEDA (<a href='https://codepen.io/Korilakkuma'>@Korilakkuma</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
                </section>
            </section>
        );
    }
}

export default connect()(Clone);
