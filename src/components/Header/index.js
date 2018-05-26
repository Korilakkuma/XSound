'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as HeaderActions from '../../actions/HeaderActions';

class Header extends React.Component {
    static CLASS_NAME  = 'Header';
    // static BREAK_POINT = 768;

    static propTypes = {
        dispatch : PropTypes.func.isRequired
        // hidden   : PropTypes.bool.isRequired
    };

    constructor(props) {
        super(props);

        // this.githubButtons = null;
        // this.forkme        = null;

        // this.resize = this.resize.bind(this);
    }

    /*
    resize() {
        const dispatch = this.props.dispatch;

        if (window.innerWidth < Header.BREAK_POINT) {
            dispatch(HeaderActions.changeHidden(true));
        } else {
            dispatch(HeaderActions.changeHidden(false));
        }
    }
    */

    shouldComponentUpdate() {
        return false;
        // return this.props.hidden !== nextProps.hidden;
    }

    render() {
        return (
            <header className={Header.CLASS_NAME}>
                <h1 className={`${Header.CLASS_NAME}__title`}>XSound</h1>
                <h2 className={`${Header.CLASS_NAME}__subtitle`}>Web Audio API Library</h2>
            </header>
        );
    }

    /*
    componentDidMount() {
        this.resize();
        window.addEventListener('resize', this.resize, false);
    }
    */

    /*
    componentWillUnmount() {
        window.removeEventListener('resize', this.resize, false);
    }
    */
}

function mapStateToProps(state) {
    return {
        hidden : state.hidden
    };
}

export default connect(mapStateToProps)(Header);
