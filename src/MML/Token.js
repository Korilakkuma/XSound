'use strict';

import { TokenMap, TokenTypes } from './TokenDefinitions';

/**
 * This class has token type, token data and token value if token is number.
 * @constructor
 */
export class Token {
    /**
     * @param {TokenTypes|string} token This argument is the token that is defined by `TokenTypes`.
     *     Otherwise, this is chords or digits.
     */
    constructor(token) {
        this.token = token;

        const value = parseInt(token, 10);

        if (token && isNaN(value)) {
            this.type  = TokenTypes[TokenMap.get(token.charAt(0))];
            this.value = null;
        } else if (token) {
            this.type  = TokenTypes.NUMBER;
            this.value = value;
        } else {
            this.type  = TokenTypes[TokenMap.get(token)];
            this.value = null;
        }
    }

    /**
     * This method is getter for token type.
     */
    getType() {
        return this.type || null;
    }

    /**
     * This method is getter for token.
     */
    getToken() {
        return this.token;
    }

    /**
     * This method is getter for token value if token is number.
     */
    getValue() {
        return this.value;
    }
}
