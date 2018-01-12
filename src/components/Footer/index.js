'use strict';

import React from 'react';
import { connect } from 'react-redux';

class Footer extends React.Component {
    static CLASS_NAME = 'Footer';

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <footer className={Footer.CLASS_NAME}>
                <p>XSound maintained by <a href="https://github.com/Korilakkuma">Korilakkuma</a></p>
            </footer>
        );
    }
}

export default connect()(Footer);
