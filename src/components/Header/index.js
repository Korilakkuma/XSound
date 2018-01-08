'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class Header extends React.Component {
    static CLASS_NAME  = 'Header';
    static BREAK_POINT = 768;

    constructor(props) {
        super(props);

        this.githubButtons = null;
        this.forkme        = null;

        this.resize = this.resize.bind(this);
    }

    resize() {
        if (window.innerWidth < Header.BREAK_POINT) {
            this.githubButtons.setAttribute('hidden', '');
            this.forkme.setAttribute('hidden', '');
        } else {
            this.githubButtons.removeAttribute('hidden');
            this.forkme.removeAttribute('hidden');
        }
    }

    shouldComponentUpdate() {
        return true;
    }

    render() {
        return (
            <header className={Header.CLASS_NAME}>
                <p ref={node => this.githubButtons = node} className={`${Header.CLASS_NAME}__github-buttons`}>
                    <iframe src="https://ghbtns.com/github-btn.html?user=Korilakkuma&amp;repo=XSound&amp;type=star&amp;count=true&amp;size=small" frameBorder="0" scrolling="0" width="130" height="30"></iframe>
                    <iframe src="https://ghbtns.com/github-btn.html?user=Korilakkuma&amp;repo=XSound&amp;type=fork&amp;count=true&amp;size=small" frameBorder="0" scrolling="0" width="130" height="30"></iframe>
                </p>
                <p ref={node => this.forkme = node} className={`${Header.CLASS_NAME}__forkme`}>
                    <a href="https://github.com/Korilakkuma/XSound" target="_blank" rel="noopener noreferrer" className="image-link">View on GitHub</a>
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

export default connect(state => state)(Header);
