'use strict';

import React from 'react';
import { connect } from 'react-redux';

class Read extends React.Component {
    static CLASS_NAME = 'Read';

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <section className={Read.CLASS_NAME}>
                <section>
                    <div className="component-title">
                        <h1>read</h1>
                        <p className="returns">Returns : <span>undefined</span></p>
                    </div>
                    <hr role="presentation" />
                    <p>
                        This method reads the instance of <code>File</code> (extends <code>Blob</code>).
                    </p>
                    <table>
                        <caption>Arguments</caption>
                        <thead><tr><th scope="col"></th><th scope="col">Type</th><th scope="col">Description</th></tr></thead>
                        <tbody>
                            <tr>
                                <th scope="row">1st</th>
                                <td><span className="argument-type">object</span></td>
                                <td>
                                    This argument is plain object that has the following properties.
                                    <dl>
                                        <dt>file<span className="argument-type">File (Blob)</span></dt>
                                        <dd>This value is the instance of <code>File</code> (extends <code>Blob</code>).</dd>
                                        <dt>type<span className="argument-type">string</span></dt>
                                        <dd>This value is one of &apos;ArrayBuffer&apos;, &apos;DataURL&apos;, &apos;Text&apos;</dd>
                                        <dt>success<span className="argumnet-type">function</span></dt>
                                        <dd>This function is invoked on success.</dd>
                                        <dt>error<span className="argument-type">function</span></dt>
                                        <dd>This function is invoked on error.</dd>
                                        <dt>progress<span className="argument-type">function</span></dt>
                                        <dd>This function is invoked while file is read.</dd>
                                    </dl>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </section>
                <section className="codepen">
                    <iframe height='265' scrolling='no' title='read | XSound - Web Audio API Library -' src='//codepen.io/Korilakkuma/embed/baPoKO/?height=265&amp;theme-id=0&amp;default-tab=js,result&amp;embed-version=2' frameBorder='no' allowtransparency='true' allowFullScreen='true' style={{ width : '100%' }}>See the Pen <a href='https://codepen.io/Korilakkuma/pen/baPoKO/'>read | XSound - Web Audio API Library -</a> by Tomohiro IKEDA (<a href='https://codepen.io/Korilakkuma'>@Korilakkuma</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
                </section>
            </section>
        );
    }
}

export default connect()(Read);
