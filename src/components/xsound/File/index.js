'use strict';

import React from 'react';
import { connect } from 'react-redux';

class File extends React.Component {
    static TITLE      = 'XSound.file';
    static CLASS_NAME = 'File';

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <section className={File.CLASS_NAME}>
                <section>
                    <div className="component-title">
                        <h1>file</h1>
                        <p className="returns">Returns : <span>File (extends Blob)</span></p>
                    </div>
                    <hr role="presentation" />
                    <p>
                        This method gets the instance of File (extends Blob) and reads this.
                    </p>
                    <table>
                        <caption>Arguments</caption>
                        <thead><tr><th scope="col"></th><th scope="col">Type</th><th scope="col">Description</th></tr></thead>
                        <tbody>
                            <tr>
                                <th scope="row">1st</th>
                                <td><span className="argument-type">Object</span></td>
                                <td>
                                    This argument is plain object that has the following properties.
                                    <dl className="list-marker">
                                        <dt>event<span className="argument-type">Event</span></dt>
                                        <dd>This value is event object.</dd>
                                        <dt>type<span className="argument-type">string</span></dt>
                                        <dd>This value is one of &apos;ArrayBuffer&apos;, &apos;DataURL&apos;, &apos;Text&apos;</dd>
                                        <dt>success<span className="argument-type">Function</span></dt>
                                        <dd>This function is invoked on read success.</dd>
                                        <dt>error<span className="argument-type">Function</span></dt>
                                        <dd>This function is invoked on read error.</dd>
                                        <dt>progress<span className="argument-type">Function</span></dt>
                                        <dd>This function is invoked while file is read.</dd>
                                    </dl>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </section>
                <section className="codepen">
                    <iframe height='265' scrolling='no' title='file | XSound - Web Audio API Library -' src='//codepen.io/Korilakkuma/embed/dJajbx/?height=265&amp;theme-id=0&amp;default-tab=js,result&amp;embed-version=2' frameBorder='no' allowtransparency='true' allowFullScreen='true' style={{ width : '100%' }}>See the Pen <a href='https://codepen.io/Korilakkuma/pen/dJajbx/'>file | XSound - Web Audio API Library -</a> by Tomohiro IKEDA (<a href='https://codepen.io/Korilakkuma'>@Korilakkuma</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
                </section>
            </section>
        );
    }
}

export default connect()(File);
