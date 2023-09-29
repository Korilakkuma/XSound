import { Tokenizer } from './Tokenizer';
import { Tree, MMLSyntaxError } from './Tree';

/**
 * This class is Tree Construction (syntax tree) for MML (Music Macro Language).
 * @constructor
 */
export class TreeConstructor {
  public static id = 0;

  private tokenizer: Tokenizer;
  private syntaxTree: Tree[] = [];

  /**
   * @param {Tokenizer} tokenizer This argument is instance of `Tokenizer`.
   */
  constructor(tokenizer: Tokenizer) {
    this.tokenizer = tokenizer;
  }

  /**
   * This method executes tree construction (parsing) from tokens.
   * @return {Array<Tree>|MMLSyntaxError} Return value is syntax tree.
   */
  public parse(): Tree[] | MMLSyntaxError {
    Tokenizer.id = 0;

    let token     = this.tokenizer.get();
    let nextToken = this.tokenizer.get();

    while (true) {
      if (!token || !nextToken) {
        return this.syntaxTree;
      }

      TreeConstructor.id += 2;

      switch (token.type) {
        case 'TEMPO': {
          if (nextToken.type === 'NUMBER') {
            const left = new Tree((TreeConstructor.id - 0).toString(10), nextToken, null, null);  // Leaf
            const tree = new Tree((TreeConstructor.id - 1).toString(10), token, left, null);

            // /T\d+/
            this.syntaxTree.push(tree);

            break;
          }

          return new MMLSyntaxError(token);
        }

        case 'OCTAVE': {
          if ((this.syntaxTree.length > 0) && (nextToken.type === 'NUMBER')) {
            const left = new Tree((TreeConstructor.id - 0).toString(10), nextToken, null, null);  // Leaf
            const tree = new Tree((TreeConstructor.id - 1).toString(10), token, left, null);

            const parentNode = this.syntaxTree[this.syntaxTree.length - 1];

            parentNode.concat(tree);

            // /O\d+/
            this.syntaxTree.push(tree);

            break;
          }

          return new MMLSyntaxError(token);
        }

        case 'NOTE': {
          if ((this.syntaxTree.length > 0) && (nextToken.type === 'NUMBER')) {
            const left = new Tree((TreeConstructor.id - 0).toString(10), nextToken, null, null);  // Leaf
            const tree = new Tree((TreeConstructor.id - 1).toString(10), token, left, null);

            const parentNode = this.syntaxTree[this.syntaxTree.length - 1];

            parentNode.concat(tree);

            // /(?:[CDEFGABR][#+-]?)+\d+\.?/
            this.syntaxTree.push(tree);

            break;
          }

          return new MMLSyntaxError(token);
        }

        case 'REST': {
          if ((this.syntaxTree.length > 0) && (nextToken.type === 'NUMBER')) {
            const left = new Tree((TreeConstructor.id - 0).toString(10), nextToken, null, null);  // Leaf
            const tree = new Tree((TreeConstructor.id - 1).toString(10), token, left, null);

            const parentNode = this.syntaxTree[this.syntaxTree.length - 1];

            parentNode.concat(tree);

            // /R\d+/
            this.syntaxTree.push(tree);

            break;
          }

          return new MMLSyntaxError(token);
        }

        case 'NUMBER': {
          TreeConstructor.id -= 2;
          break;
        }

        case 'TIE': {
          if (this.syntaxTree.length > 0) {
            TreeConstructor.id--;

            const tree = new Tree((TreeConstructor.id - 0).toString(10), token, null, null);

            const parentNode = this.syntaxTree[this.syntaxTree.length - 1];

            parentNode.concat(tree);

            // /&/
            this.syntaxTree.push(tree);

            break;
          }

          return new MMLSyntaxError(token);
        }

        case 'EOS': {
          if (this.syntaxTree.length > 0) {
            const tree = new Tree((TreeConstructor.id - 1).toString(10), token, null, null);

            const parentNode = this.syntaxTree[this.syntaxTree.length - 1];

            parentNode.concat(tree);

            this.syntaxTree.push(tree);
          } else {
            const tree = new Tree((TreeConstructor.id - 1).toString(10), token, null, null);

            this.syntaxTree.push(tree);
          }

          return this.syntaxTree;
        }
      }

      token     = nextToken;
      nextToken = this.tokenizer.get();
    }
  }

  /**
   * This method releases memory that stack has.
   */
  public free(): void {
    this.syntaxTree.length = 0;
  }
}
