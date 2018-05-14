'use strict';

import React from 'react';
import { connect } from 'react-redux';

class VisualizerCreate extends React.Component {
    static CLASS_NAME = 'VisualizerCreate';

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <section className={VisualizerCreate.CLASS_NAME}>
                <section>
                    <div className="component-title">
                        <h1>Visualizer#create</h1>
                        <p className="returns">Returns : <span>string (Data URL | XML)</span></p>
                    </div>
                    <hr role="presentation" />
                    <p>
                        This method captures the drawn wave.
                    </p>
                </section>
                <section className="codepen">
                    <iframe height='265' scrolling='no' title='Visualizer#create | XSound - Web Audio API Library -' src='//codepen.io/Korilakkuma/embed/YLaQxq/?height=265&amp;theme-id=0&amp;default-tab=js,result&amp;embed-version=2' frameBorder='no' allowtransparency='true' allowFullScreen='true' style={{ width : '100%' }}>See the Pen <a href='https://codepen.io/Korilakkuma/pen/YLaQxq/'>Visualizer#create | XSound - Web Audio API Library -</a> by Tomohiro IKEDA (<a href='https://codepen.io/Korilakkuma'>@Korilakkuma</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>
                </section>
            </section>
        );
    }
}

export default connect()(VisualizerCreate);
