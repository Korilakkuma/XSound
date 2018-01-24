'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as HeaderActions from '../../actions/HeaderActions';

class Header extends React.Component {
    static CLASS_NAME  = 'Header';
    static BREAK_POINT = 768;

    static propTypes = {
        dispatch : PropTypes.func.isRequired,
        hidden   : PropTypes.bool.isRequired
    };

    constructor(props) {
        super(props);

        this.githubButtons = null;
        this.forkme        = null;

        this.resize = this.resize.bind(this);
    }

    resize() {
        const dispatch = this.props.dispatch;

        if (window.innerWidth < Header.BREAK_POINT) {
            dispatch(HeaderActions.changeHidden(true));
        } else {
            dispatch(HeaderActions.changeHidden(false));
        }
    }

    shouldComponentUpdate(nextProps) {
        return this.props.hidden !== nextProps.hidden;
    }

    render() {
        const hidden = this.props.hidden;

        return (
            <header className={Header.CLASS_NAME}>
                <p ref={node => this.githubButtons = node} hidden={hidden} className={`${Header.CLASS_NAME}__github-buttons`}>
                    <iframe src="https://ghbtns.com/github-btn.html?user=Korilakkuma&amp;repo=XSound&amp;type=star&amp;count=true&amp;size=small" frameBorder="0" scrolling="0" width="130" height="30"></iframe>
                    <iframe src="https://ghbtns.com/github-btn.html?user=Korilakkuma&amp;repo=XSound&amp;type=fork&amp;count=true&amp;size=small" frameBorder="0" scrolling="0" width="130" height="30"></iframe>
                </p>
                <p ref={node => this.forkme = node} hidden={hidden} className={`${Header.CLASS_NAME}__forkme`}>
                    <a href="https://github.com/Korilakkuma/XSound" target="_blank" rel="noopener noreferrer">View on GitHub</a>
                </p>
                <h1 className={`${Header.CLASS_NAME}__title`}>XSound</h1>
                <h2 className={`${Header.CLASS_NAME}__subtitle`}>Web Audio API Library</h2>
            </header>
        );
    }

    componentDidMount() {
        this.resize();

        window.addEventListener('resize', this.resize, false);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize, false);
    }
}

function mapStateToProps(state) {
    return {
        hidden : state.hidden
    };
}

export default connect(mapStateToProps)(Header);
