'use strict';

/**
 * This class is Tokenization for MML (Music Macro Language).
 * @constructor
 */
export class Tokenizer {
    // Token types
    static TEMPO     = 'T';
    static OCTAVE    = 'O';
    static C         = 'C';
    static D         = 'D';
    static E         = 'E';
    static F         = 'F';
    static G         = 'G';
    static A         = 'A';
    static B         = 'B';
    static R         = 'R';
    static DIGITS_0  = '0';
    static DIGITS_1  = '1';
    static DIGITS_2  = '2';
    static DIGITS_3  = '3';
    static DIGITS_4  = '4';
    static DIGITS_5  = '5';
    static DIGITS_6  = '6';
    static DIGITS_7  = '7';
    static DIGITS_8  = '8';
    static DIGITS_9  = '9';
    static DOT       = '.';
    static SHARP     = '#';
    static HALF_UP   = '+';
    static HALF_DOWN = '-';
    static TIE       = '&';
    static SPACES    = /\s/;  // HACK: Use RegExp ...
    static EOS       = 'EOS';
    static ERROR     = 'Error';

    /**
     * @param {string} mml This argument is MML string.
     */
    constructor(mml) {
        if (String(mml).trim().length > 0) {
            // `reverse` for getting token by `pop`
            this.tokens = mml.trim().toUpperCase().split('').reverse();
        } else {
            this.tokens = [];
        }

        this.digits = [];
        this.symbols = [];
    }

    /**
     * This method executes tokenization from MML.
     * @return {string} This is returned as tokenized char.
     */
    get() {
        let token = this.trim(this.tokens.pop());

        // Symbols
        switch (token) {
            case Tokenizer.TEMPO :
            case Tokenizer.OCTAVE:
            case Tokenizer.C     :
            case Tokenizer.D     :
            case Tokenizer.E     :
            case Tokenizer.F     :
            case Tokenizer.G     :
            case Tokenizer.A     :
            case Tokenizer.B     :
            case Tokenizer.R     :
                this.symbols.push(token);

                // EOS ?
                if (this.tokens.length === 0) {
                    return Tokenizer.Error;
                }

                // Look-ahead
                token = this.trim(this.tokens.pop());

                if (token === Tokenizer.SHARP) {
                    token = Tokenizer.HALF_UP;
                }

                while (true) {
                    switch (token) {
                        case Tokenizer.C        :
                        case Tokenizer.D        :
                        case Tokenizer.E        :
                        case Tokenizer.F        :
                        case Tokenizer.G        :
                        case Tokenizer.A        :
                        case Tokenizer.B        :
                        case Tokenizer.HALF_UP  :
                        case Tokenizer.HALF_DOWN:
                            this.symbols.push(token);

                            // EOS ?
                            if (this.tokens.length === 0) {
                                return Tokenizer.ERROR;
                            }

                            // Look-ahead
                            token = this.trim(this.tokens.pop());
                            break;
                        default:
                            // Digits
                            switch (token) {
                                case Tokenizer.DIGITS_1:
                                case Tokenizer.DIGITS_2:
                                case Tokenizer.DIGITS_3:
                                case Tokenizer.DIGITS_4:
                                case Tokenizer.DIGITS_5:
                                case Tokenizer.DIGITS_6:
                                case Tokenizer.DIGITS_7:
                                case Tokenizer.DIGITS_8:
                                case Tokenizer.DIGITS_9:
                                    this.digits.push(token);

                                    if (this.tokens.length === 0) {
                                        return `${this.symbols.join('')}${this.digits.join('')}`;
                                    }

                                    // Look-ahead
                                    token = this.trim(this.tokens.pop());

                                    while (true) {
                                        switch (token) {
                                            case Tokenizer.DIGITS_0:
                                            case Tokenizer.DIGITS_1:
                                            case Tokenizer.DIGITS_2:
                                            case Tokenizer.DIGITS_3:
                                            case Tokenizer.DIGITS_4:
                                            case Tokenizer.DIGITS_5:
                                            case Tokenizer.DIGITS_6:
                                            case Tokenizer.DIGITS_7:
                                            case Tokenizer.DIGITS_8:
                                            case Tokenizer.DIGITS_9:
                                            case Tokenizer.DOT     :
                                                this.digits.push(token);
                                                token = this.trim(this.tokens.pop());
                                                break;
                                            default:
                                                // Look-back
                                                this.tokens.push(token);

                                                const s = this.symbols.join('');
                                                const d = this.digits.join('');

                                                this.symbols.length = 0;
                                                this.digits.length  = 0;

                                                return `${s}${d}`;
                                        }
                                    }
                            }
                    }
                }
            case Tokenizer.TIE:
                return Tokenizer.TIE;
            default:
                return Tokenizer.EOS;
        }
    }

    /**
     * This method skips tokens that does not means as MML token.
     * @param {string} token This argument is a token  from MML.
     * @return {string} This is returned as token that is not white space.
     */
    trim(token) {
        while (Tokenizer.SPACES.test(token)) {
            token = this.tokens.pop();
        }

        return token;
    }
}
