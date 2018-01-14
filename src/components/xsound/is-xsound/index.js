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
                    <h1>IS_XSOUND <span className="type">Type : <span>boolean</span></span></h1>
                    <hr />
                    <p>
                        This property is to determine whether this library is usable.
                        If this library is usable, this value is true.
                        Otherwise this value is false.
                    </p>
                </section>
                <section>
<textarea>
console.log(&quot;X.IS_XSOUND&quot;);
console.log(X.IS_XSOUND);
</textarea>
                </section>
            </section>
        );
    }
}

export default connect()(IsXSound);

