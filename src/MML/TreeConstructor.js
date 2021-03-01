'use strict';

import { TokenTypes } from './TokenDefinitions';

/**
 * This class is Tree Construction for MML (Music Macro Language).
 * @constructor
 */
export class TreeConstructor {
    /**
     * @param {Tokenizer} tokenizer This argument is the instance of `Tokenizer`.
     */
    constructor(tokenizer) {
        this.tokenizer  = tokenizer;  // The instance of `Tokenizer`
        this.stackOfMML = [];         /** @type Array.<Array.<Token>> */
    }

    /**
     * This method executes tree construction (parsing) from tokens.
     * @return {Array.<Array.<Token>>} This is returned as syntax tree.
     */
    parse() {
        let token         = this.tokenizer.get();
        let nextToken     = this.tokenizer.get();
        let nextNextToken = this.tokenizer.get();

        while (token.getType() !== TokenTypes.EOS) {
            switch (token.getType()) {
                case TokenTypes.TEMPO:
                    if (nextToken.getType() !== TokenTypes.NUMBER) {
                        return [];
                    }

                    // /T\d+/
                    this.stackOfMML.push([token, nextToken]);
                    break;
                case TokenTypes.OCTAVE:
                    if (nextToken.getType() !== TokenTypes.NUMBER) {
                        return [];
                    }

                    // /O\d+/
                    this.stackOfMML.push([token, nextToken]);
                    break;
                case TokenTypes.NOTE:
                    if (nextToken.getType() !== TokenTypes.NUMBER) {
                        return [];
                    }

                    // /([CDEFGAB]+(+|-)?)+\d+\.?/
                    this.stackOfMML.push([token, nextToken]);
                    break;
                case TokenTypes.REST:
                    if (nextToken.getType() !== TokenTypes.NUMBER) {
                        return [];
                    }

                    // /R\d+/
                    this.stackOfMML.push([token, nextToken]);
                    break;
                case TokenTypes.NUMBER:
                    // Noop
                    break;
                case TokenTypes.TIE:
                    // /&/
                    this.stackOfMML.push([token]);
                    break;
                default:
                    return [];
            }

            token         = nextToken;
            nextToken     = nextNextToken;
            nextNextToken = this.tokenizer.get();
        }

        return this.stackOfMML;
    }

    /**
     * This method releases the memory that stack has.
     */
    free() {
        this.stackOfMML.length = 0;
    }
}
