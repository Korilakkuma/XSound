'use strict';

/**
 * This class has token type, token data and token value if token is number.
 * @constructor
 */
export class Token {
    /**
     * @param {TokenTypes} type This argument is the one of enumeration values that is defined by `TokenTypes`.
     * @param {string} token This argument is a string that constructs of token.
     */
    constructor(type, token) {
        this.type  = type;
        this.token = token;
        this.value = parseInt(token, 10);
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
        return isNaN(this.value) ? null : this.value;
    }
}
