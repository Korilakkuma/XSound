export type TokenType = 'TEMPO' | 'OCTAVE' | 'NOTE' | 'REST' | 'NUMBER' | 'TIE' | 'SPACE' | 'EOS' | 'UNKNOWN';

/**
 * MML characters are corresponds to tokens by this map.
 * Namely, this map is definitions of MML Tokens.
 */
export const TokenMap = new Map<string|undefined, TokenType>([
  ['T', 'TEMPO'],
  ['O', 'OCTAVE'],
  ['C', 'NOTE'],
  ['D', 'NOTE'],
  ['E', 'NOTE'],
  ['F', 'NOTE'],
  ['G', 'NOTE'],
  ['A', 'NOTE'],
  ['B', 'NOTE'],
  ['+', 'NOTE'],
  ['-', 'NOTE'],
  ['#', 'NOTE'],
  ['R', 'REST'],
  ['0', 'NUMBER'],
  ['1', 'NUMBER'],
  ['2', 'NUMBER'],
  ['3', 'NUMBER'],
  ['4', 'NUMBER'],
  ['5', 'NUMBER'],
  ['6', 'NUMBER'],
  ['7', 'NUMBER'],
  ['8', 'NUMBER'],
  ['9', 'NUMBER'],
  ['.', 'NUMBER'],
  ['&', 'TIE'],
  [' ', 'SPACE'],
  [undefined, 'EOS']
]);

/**
 * This class is entity for MML token.
 * This class has token type, token data and token value if token is number.
 */
export class Token {
  private _id: string;
  private _type: TokenType;
  private _token: string | undefined;
  private _value: number;

  /**
   * @param {string} id This argument is string that identifies MML token.
   * @param {TokenType} type This argument is one of 'TEMPO', 'OCTAVE', 'NOTE', 'REST', 'NUMBER', 'TIE', 'SPACE', 'EOS', 'UNKNOWN'.
   * @param {string|undefined} token This argument is string that constructs of token.
   */
  constructor(id: string, type: TokenType, token: string | undefined) {
    this._id    = id;
    this._type  = type;
    this._token = token;
    this._value = token ? Number(token) : -1;
  }

  /**
   * This method is getter for token type.
   */
  public get type(): TokenType {
    return this._type;
  }

  /**
   * This method is getter for token.
   */
  public get token(): string | undefined {
    return this._token;
  }

  /**
   * This method is getter for token value if token is number.
   */
  public get value(): number {
    return Number.isNaN(this._value) ? -1 : this._value;
  }

  /**
   * This method returns fields that `Token` has as JSON.
   */
  public toString(): string {
    return JSON.stringify({
      id   : this._id,
      type : this._type,
      token: this._token,
      value: this._value
    });
  }
}
