import { TokenMap, Token } from '/src/MML/Token';

/**
 * This class is for MML Tokenization.
 * @constructor
 */
export class Tokenizer {
  public static id = 0;

  private tokens: string[] = [];
  private notes: string[] = [];
  private numbers: string[] = [];

  /**
   * @param {string} mml This argument is MML string.
   */
  constructor(mml: string) {
    // `reverse` for getting token by `pop`
    this.tokens = mml.trim().toUpperCase().split('').reverse();
  }

  /**
   * This method executes tokenization from MML.
   * @return {Token|null} Return value is instance of `Token`.
   */
  public get(): Token | null {
    let token     = this.tokens.pop();
    let tokenType = TokenMap.get(token);

    Tokenizer.id++;

    if (!tokenType) {
      return new Token(Tokenizer.id.toString(10), 'UNKNOWN', token);
    }

    while ((tokenType === 'SPACE')) {
      token     = this.tokens.pop();
      tokenType = TokenMap.get(token);

      if (!tokenType) {
        return new Token(Tokenizer.id.toString(10), 'UNKNOWN', token);
      }
    }

    if (tokenType === 'EOS') {
      return new Token(Tokenizer.id.toString(10), 'EOS', token);
    }

    this.notes.length   = 0;
    this.numbers.length = 0;

    switch (tokenType) {
      case 'TEMPO':
        if (token) {
          return new Token(Tokenizer.id.toString(10), 'TEMPO', token);
        }

        break;
      case 'OCTAVE':
        if (token) {
          return new Token(Tokenizer.id.toString(10), 'OCTAVE', token);
        }

        break;
      case 'NOTE':
        if (token) {
          this.notes.push(token);

          // Look-ahead
          token = this.tokens.pop();

          if (!token) {
            return new Token(Tokenizer.id.toString(10), 'NOTE', this.notes.join(''));
          }

          tokenType = TokenMap.get(token);

          if (!tokenType) {
            return new Token(Tokenizer.id.toString(10), 'UNKNOWN', token);
          }

          while (tokenType === 'NOTE') {
            this.notes.push(token);

            token = this.tokens.pop();

            if (!token) {
              return new Token(Tokenizer.id.toString(10), 'NOTE', this.notes.join(''));
            }

            tokenType = TokenMap.get(token);

            if (!tokenType) {
              return new Token(Tokenizer.id.toString(10), 'UNKNOWN', token);
            }
          }

          // Look-behind
          this.tokens.push(token);

          return new Token(Tokenizer.id.toString(10), 'NOTE', this.notes.join(''));
        }

        break;
      case 'REST':
        if (token) {
          return new Token(Tokenizer.id.toString(10), 'REST', token);
        }

        break;
      case 'NUMBER':
        if (token) {
          this.numbers.push(token);

          // Look-ahead
          token = this.tokens.pop();

          if (!token) {
            return new Token(Tokenizer.id.toString(10), 'NUMBER', this.numbers.join(''));
          }

          tokenType = TokenMap.get(token);

          if (!tokenType) {
            return new Token(Tokenizer.id.toString(10), 'UNKNOWN', token);
          }

          while (tokenType === 'NUMBER') {
            this.numbers.push(token);

            token = this.tokens.pop();

            if (!token) {
              return new Token(Tokenizer.id.toString(10), 'NUMBER', this.numbers.join(''));
            }

            tokenType = TokenMap.get(token);

            if (!tokenType) {
              return new Token(Tokenizer.id.toString(10), 'UNKNOWN', token);
            }
          }

          // Look-behind
          this.tokens.push(token);

          return new Token(Tokenizer.id.toString(10), 'NUMBER', this.numbers.join(''));
        }

        break;
      case 'TIE':
        if (token) {
          return new Token(Tokenizer.id.toString(10), 'TIE', token);
        }

        break;
      default:
        if (token) {
          return new Token(Tokenizer.id.toString(10), 'UNKNOWN', token);
        }

        break;
    }

    return null;
  }
}
