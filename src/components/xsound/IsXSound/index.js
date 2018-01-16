'use strict';

import React from 'react';
import { connect } from 'react-redux';

class IsXSound extends React.Component {
    static CLASS_NAME = 'IsXSound';

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <section>
                <section>
                    <h1>IS_XSOUND<span className="type">Type : <span>boolean</span></span></h1>
                    <hr />
                    <p>
                        This property is to determine whether this library is usable.
                        If this library is usable, this value is true.
                        Otherwise this value is false.
                    </p>
                </section>
                <section className="codepen">
                    <iframe height='265' scrolling='no' title='IS_XSOUND | XSound - Web Audio API Library -' src='//codepen.io/Korilakkuma/embed/NXBEjK/?height=265&amp;theme-id=0&default-tab=js,result&amp;embed-version=2' frameBorder='no' allowtransparency='true' allowFullScreen='true' style={{ width : '100%' }}>See the Pen <a href='https://codepen.io/Korilakkuma/pen/NXBEjK/'>NXBEjK</a> by Tomohiro IKEDA (<a href='https://codepen.io/Korilakkuma'>@Korilakkuma</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
                </section>
            </section>
        );
    }
}

export default connect()(IsXSound);
