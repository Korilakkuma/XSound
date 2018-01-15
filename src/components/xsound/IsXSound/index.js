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

    componentWillMount() {
        const script = document.createElement('script');

        script.src   = 'https://production-assets.codepen.io/assets/embed/ei.js';
        script.async = true;

        document.body.appendChild(script);
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
                <section>
                    <p data-height="265" data-theme-id="0" data-slug-hash="NXBEjK" data-default-tab="js,result" data-user="Korilakkuma" data-embed-version="2" data-pen-title="NXBEjK" className="codepen">See the Pen <a href="https://codepen.io/Korilakkuma/pen/NXBEjK/">NXBEjK</a> by Tomohiro IKEDA (<a href="https://codepen.io/Korilakkuma">@Korilakkuma</a>) on <a href="https://codepen.io">CodePen</a>.</p>
                </section>
            </section>
        );
    }
}

export default connect()(IsXSound);

