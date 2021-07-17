'use strict';

/**
 * This class is structure for Tree Construction.
 * @constructor
 */
export class Tree {
    static indent = 0;

    /**
     * @param {Token} operator This argument is the instance of `Token` as Tree Node.
     * @param {Tree} left This argument is the instance of `Tree` as left partial tree.
     * @param {Tree} right This argument is the instance of `Tree` as right partial tree.
     */
    constructor(operator, left, right) {
        this.operator = operator;
        this.left     = left;
        this.right    = right;
    }

    /**
     * This method concatenates partial tree as right partial tree.
     * @param {Token} operator This argument is the instance of `Token` as Tree Node.
     */
    concat(node) {
        this.right = node;
    }

    /**
     * This method is getter for operator.
     */
    getOperator() {
        return this.operator;
    }

    /**
     * This method is getter for left partial tree
     */
    getLeft() {
        return this.left;
    }

    /**
     * This method is getter for right partial tree
     */
    getRight() {
        return this.right;
    }

    /** @override */
    toString() {
        let space = '';

        for (let i = 0; i < Tree.indent; i++) {
            space += '    ';
        }

        Tree.indent++;

        // Return syntax tree string
        return `
          ${space}  ${this.operator.getToken()}
          ${space}  /\\
          ${space}${this.left !== null ? this.left.getOperator().getToken() : ''}
          ${space}${((this.right !== null) && (this.right.getOperator().getToken() !== undefined)) ? this.toString.call(this.right) : 'EOS'}
        `;
    }
}
