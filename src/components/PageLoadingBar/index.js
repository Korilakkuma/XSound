'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class PageLoadingBar extends React.Component {
    static CLASS_NAME  = 'PageLoadingBar';

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <div id="page-loading-bar" className={PageLoadingBar.CLASS_NAME}>
                <div role="progressbar" />
            </div>
        );
    }
}

export default connect()(PageLoadingBar);
