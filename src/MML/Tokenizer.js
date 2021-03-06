'use strict';

import { TokenMap, TokenTypes, Token } from './Token';

/**
 * This class is Tokenization for MML (Music Macro Language).
 * @constructor
 */
export class Tokenizer {
    /**
     * @param {string} mml This argument is MML string.
     */
    constructor(mml) {
        if (typeof mml === 'string') {
            // `reverse` for getting token by `pop`
            this.tokens = mml.trim().toUpperCase().split('').reverse();
        } else {
            this.tokens = [];
        }

        this.notes   = [];
        this.numbers = [];
    }

    /**
     * This method executes tokenization from MML.
     * @return {Token} This is returned as the instance of `Token`.
     */
    get() {
        let token = this.tokens.pop();

        while (TokenTypes[TokenMap.get(token)] === TokenTypes.SPACE) {
            token = this.tokens.pop();
        }

        if (TokenTypes[TokenMap.get(token)] === TokenTypes.EOS) {
            return new Token(TokenTypes.EOS, token);
        }

        this.notes.length   = 0;
        this.numbers.length = 0;

        switch (TokenTypes[TokenMap.get(token)]) {
            case TokenTypes.TEMPO:
                return new Token(TokenTypes.TEMPO, token);
            case TokenTypes.OCTAVE:
                return new Token(TokenTypes.OCTAVE, token);
            case TokenTypes.NOTE:
                this.notes.push(token);

                // Look-ahead
                token = this.tokens.pop();

                while (TokenTypes[TokenMap.get(token)] === TokenTypes.NOTE) {
                    this.notes.push(token);

                    token = this.tokens.pop();
                }

                // Look-behind
                this.tokens.push(token);

                return new Token(TokenTypes.NOTE, this.notes.join(''));
            case TokenTypes.REST:
                return new Token(TokenTypes.REST, token);
            case TokenTypes.NUMBER:
                this.numbers.push(token);

                // Look-ahead
                token = this.tokens.pop();

                while (TokenTypes[TokenMap.get(token)] === TokenTypes.NUMBER) {
                    this.numbers.push(token);

                    token = this.tokens.pop();
                }

                // Look-behind
                this.tokens.push(token);

                return new Token(TokenTypes.NUMBER, this.numbers.join(''));
            case TokenTypes.TIE:
                return new Token(TokenTypes.TIE, token);
            default:
                return new Token(TokenTypes.UNKNOWN, token);
        }
    }
}
