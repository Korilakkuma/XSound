'use strict';

import { TokenTypes } from './Token';
import { Tree } from './Tree';

/**
 * This class is Tree Construction (syntax tree) for MML (Music Macro Language).
 * @constructor
 */
export class TreeConstructor {
    /**
     * @param {Tokenizer} tokenizer This argument is the instance of `Tokenizer`.
     */
    constructor(tokenizer) {
        this.tokenizer  = tokenizer;  // The instance of `Tokenizer`
        this.syntaxTree = [];         /** @type Array.<Tree> */
    }

    /**
     * This method executes tree construction (parsing) from tokens.
     * @return {Array.<Tree>} This is returned as syntax tree.
     */
    parse() {
        let token     = this.tokenizer.get();
        let nextToken = this.tokenizer.get();

        while (true) {
            switch (token.getType()) {
                case TokenTypes.TEMPO:
                    if (nextToken.getType() === TokenTypes.NUMBER) {
                        const left = new Tree(nextToken, null, null);  // Leaf
                        const tree = new Tree(token, left, null);

                        // /T\d+/
                        this.syntaxTree.push(tree);

                        break;
                    }

                    return new MMLSyntaxError(MMLSyntaxError.ERRORS.TEMPO, token);
                case TokenTypes.OCTAVE:
                    if ((this.syntaxTree.length > 0) && (nextToken.getType() === TokenTypes.NUMBER)) {
                        const left = new Tree(nextToken, null, null);  // Leaf
                        const tree = new Tree(token, left, null);

                        const parentNode = this.syntaxTree[this.syntaxTree.length - 1];

                        parentNode.concat(tree);

                        // /O\d+/
                        this.syntaxTree.push(tree);

                        break;
                    }

                    return new MMLSyntaxError(MMLSyntaxError.ERRORS.OCTAVE, token);
                case TokenTypes.NOTE:
                    if ((this.syntaxTree.length > 0) && (nextToken.getType() === TokenTypes.NUMBER)) {
                        const left = new Tree(nextToken, null, null);  // Leaf
                        const tree = new Tree(token, left, null);

                        const parentNode = this.syntaxTree[this.syntaxTree.length - 1];

                        parentNode.concat(tree);

                        // /([CDEFGAB]+(+|-)?)+\d+\.?/
                        this.syntaxTree.push(tree);

                        break;
                    }

                    return new MMLSyntaxError(MMLSyntaxError.ERRORS.NOTE, token);
                case TokenTypes.REST:
                    if ((this.syntaxTree.length > 0) && (nextToken.getType() === TokenTypes.NUMBER)) {
                        const left  = new Tree(nextToken, null, null);  // Leaf
                        const tree  = new Tree(token, left, null);

                        const parentNode = this.syntaxTree[this.syntaxTree.length - 1];

                        parentNode.concat(tree);

                        // /R\d+/
                        this.syntaxTree.push(tree);

                        break;
                    }

                    return new MMLSyntaxError(MMLSyntaxError.ERRORS.REST, token);
                case TokenTypes.NUMBER:
                    // Noop
                    break;
                case TokenTypes.TIE:
                    if (this.syntaxTree.length > 0) {
                        const tree = new Tree(token, null, null);

                        const parentNode = this.syntaxTree[this.syntaxTree.length - 1];

                        parentNode.concat(tree);

                        // /&/
                        this.syntaxTree.push(tree);

                        break;
                    }

                    return new MMLSyntaxError(MMLSyntaxError.ERRORS.TIE, token);
                case TokenTypes.EOS:
                    if (this.syntaxTree.length > 0) {
                        const tree = new Tree(token, null, null);

                        const parentNode = this.syntaxTree[this.syntaxTree.length - 1];

                        parentNode.concat(tree);

                        this.syntaxTree.push(tree);
                    } else {
                        const tree = new Tree(token, null, null);

                        this.syntaxTree.push(tree);
                    }

                    return this.syntaxTree;
                default:
                    return new MMLSyntaxError(MMLSyntaxError.ERRORS.UNKNOWN, token);
            }

            token     = nextToken;
            nextToken = this.tokenizer.get();
        }
    }

    /**
     * This method releases the memory that stack has.
     */
    free() {
        this.syntaxTree.length = 0;
    }
}

/**
 * This class is error class for MML syntax error (extends `Error`).
 * @constructor
 */
export class MMLSyntaxError extends Error {
    static ERRORS = {
        TEMPO   : 'tempo',
        OCTAVE  : 'octave',
        NOTE    : 'note',
        REST    : 'rest',
        TIE     : 'tie',
        UNKNOWN : 'unknown'
    };

    /**
     * @param {string} error This argument is one of 'tempo', 'octave', 'note', 'rest', 'tie', 'unknown'.
     * @param {Token} token This argument is the instance of `Token` that error occurs in.
     */
    constructor(error, token) {
        super(error);

        this.token = token;
        this.error = error;
    }
}
