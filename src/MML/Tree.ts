import type { Token } from '../../src/MML/Token';

/**
 * This class is entity for MML syntax tree.
 */
export class Tree {
  private static indent = 0;

  private _id: string;

  private _operator: Token;

   
  private _left: Tree | null;
  private _right: Tree | null;
   

  /**
   * @param {string} id This argument is string that identifies syntax tree node.
   * @param {Token} operator This argument is instance of `Token` as syntax tree node.
   * @param {Tree} left This argument is instance of `Tree` as left subtree.
   * @param {Tree} right This argument is instance of `Tree` as right subtree.
   */
  constructor(id: string, operator: Token, left: Tree | null, right: Tree | null) {
    this._id       = id;
    this._operator = operator;
    this._left     = left;
    this._right    = right;
  }

  /**
   * This method concatenates subtree as right subtree.
   * @param {Tree} node This argument is instance of `Tree` as syntax tree node.
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
   * This method is getter for left subtree.
   */
  public get left(): Tree | null {
    return this._left;
  }

  /**
   * This method is getter for right subtree.
   */
  public get right(): Tree | null {
    return this._right;
  }

  /**
   * This method clears indent.
   */
  public clear(): void {
    Tree.indent = 0;
  }

  /**
   * This method represents tree status as string.
   */
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
${space}${this._left?.operator.token ?? ''}${((this._right !== null) && (this._right._operator.token !== undefined)) ? this.toString.call(this._right) : 'EOS'}
`;
  }
}

/**
 * This class is error class for MML syntax error.
 */
export class MMLSyntaxError {
  private _token: Token;

  /**
   * @param {Token} token This argument is instance of `Token` that error occurs in.
   */
  constructor(token: Token) {
    this._token = token;
  }

  /**
   * This method is getter for instance of `Token`.
   */
  public get token(): Token {
    return this._token;
  }
}
