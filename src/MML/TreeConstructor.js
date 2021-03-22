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
                    }

                    break;
                case TokenTypes.OCTAVE:
                    if ((this.syntaxTree.length > 0) && (nextToken.getType() === TokenTypes.NUMBER)) {
                        const left = new Tree(nextToken, null, null);  // Leaf
                        const tree = new Tree(token, left, null);

                        const parentNode = this.syntaxTree[this.syntaxTree.length - 1];

                        parentNode.concat(tree);

                        // /O\d+/
                        this.syntaxTree.push(tree);
                    }

                    break;
                case TokenTypes.NOTE:
                    if ((this.syntaxTree.length > 0) && (nextToken.getType() === TokenTypes.NUMBER)) {
                        const left = new Tree(nextToken, null, null);  // Leaf
                        const tree = new Tree(token, left, null);

                        const parentNode = this.syntaxTree[this.syntaxTree.length - 1];

                        parentNode.concat(tree);

                        // /([CDEFGAB]+(+|-)?)+\d+\.?/
                        this.syntaxTree.push(tree);
                    }

                    break;
                case TokenTypes.REST:
                    if ((this.syntaxTree.length > 0) && (nextToken.getType() === TokenTypes.NUMBER)) {
                        const left  = new Tree(nextToken, null, null);  // Leaf
                        const tree  = new Tree(token, left, null);

                        const parentNode = this.syntaxTree[this.syntaxTree.length - 1];

                        parentNode.concat(tree);

                        // /R\d+/
                        this.syntaxTree.push(tree);
                    }

                    break;
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
                    }

                    break;
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
                    return this.syntaxTree;
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
