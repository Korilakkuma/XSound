import { Token } from '../../src/MML/Token';

/**
 * This class is entity for MML syntax tree.
 * @constructor
 */
export class Tree {
  private static indent = 0;

  private _id: string;

  private _operator: Token;

  /* eslint-disable no-use-before-define */
  private _left: Tree | null;
  private _right: Tree | null;
  /* eslint-enable no-use-before-define */

  /**
   * @param {string} id This argument is string that identifies syntax tree node.
   * @param {Token} operator This argument is instance of `Token` as syntax tree node.
   * @param {Tree} left This argument is instance of `Tree` as left partial tree.
   * @param {Tree} right This argument is instance of `Tree` as right partial tree.
   */
  constructor(id: string, operator: Token, left: Tree | null, right: Tree | null) {
    this._id       = id;
    this._operator = operator;
    this._left     = left;
    this._right    = right;
  }

  /**
   * This method concatenates partial tree as right partial tree.
   * @param {Tree} operator This argument is instance of `Tree` as syntax tree node.
   */
  public concat(node: Tree): void {
    this._right = node;  // Side Effect (Because of pointers that before and after trees have)
  }

  /**
   * This method is getter for operator.
   */
  public get operator(): Token {
    return this._operator;
  }

  /**
   * This method is getter for left partial tree
   */
  public get left(): Tree | null {
    return this._left;
  }

  /**
   * This method is getter for right partial tree
   */
  public get right(): Tree | null {
    return this._right;
  }

  /** @override */
  public toString(): string {
    let space = '';

    for (let i = 0; i < Tree.indent; i++) {
      space += '    ';
    }

    Tree.indent++;

    // Return syntax tree string
    return `
          ${space}  ${`${this._operator.token} (id = ${this._id})`}
          ${space}  /\\
          ${space}${this._left !== null ? `${this._left._operator.token} (id = ${this._left._id})` : ''}
          ${space}${((this._right !== null) && (this._right._operator.token !== undefined)) ? this.toString.call(this._right) : 'EOS'}
        `;
  }
}

/**
 * This class is error class for MML syntax error (extends `Error`).
 * @constructor
 */
export class MMLSyntaxError extends Error {
  private _token: Token;

  /**
   * @param {Token} token This argument is instance of `Token` that error occurs in.
   */
  constructor(token: Token) {
    super();

    this._token = token;
  }

  /**
   * This method is getter for instance of `Token`.
   */
  public get token(): Token {
    return this._token;
  }
}