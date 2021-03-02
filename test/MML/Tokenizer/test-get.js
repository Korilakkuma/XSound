'use strict';

import { TokenTypes } from '../../../src/MML/TokenDefinitions';
import { Token } from '../../../src/MML/Token';
import { Tokenizer } from '../../../src/MML/Tokenizer';

describe('Tokenizer', () => {
    it('should return expected token', () => {
        const tokenizer = new Tokenizer('T62 O3 R16 A16 B-16 O4 D16 F12 A12 O5 F12 C2&C2. R4 DB-F2.');

        let actual = tokenizer.get();

        const expectedTokens = [
            { type : TokenTypes.TEMPO,  token : 'T' },
            { type : TokenTypes.NUMBER, token : '62' },
            { type : TokenTypes.OCTAVE, token : 'O' },
            { type : TokenTypes.NUMBER, token : '3' },
            { type : TokenTypes.REST,   token : 'R' },
            { type : TokenTypes.NUMBER, token : '16' },
            { type : TokenTypes.NOTE,   token : 'A' },
            { type : TokenTypes.NUMBER, token : '16' },
            { type : TokenTypes.NOTE,   token : 'B-' },
            { type : TokenTypes.NUMBER, token : '16' },
            { type : TokenTypes.OCTAVE, token : 'O' },
            { type : TokenTypes.NUMBER, token : '4' },
            { type : TokenTypes.NOTE,   token : 'D' },
            { type : TokenTypes.NUMBER, token : '16' },
            { type : TokenTypes.NOTE,   token : 'F' },
            { type : TokenTypes.NUMBER, token : '12' },
            { type : TokenTypes.NOTE,   token : 'A' },
            { type : TokenTypes.NUMBER, token : '12' },
            { type : TokenTypes.OCTAVE, token : 'O' },
            { type : TokenTypes.NUMBER, token : '5' },
            { type : TokenTypes.NOTE,   token : 'F' },
            { type : TokenTypes.NUMBER, token : '12' },
            { type : TokenTypes.NOTE,   token : 'C' },
            { type : TokenTypes.NUMBER, token : '2' },
            { type : TokenTypes.TIE,    token : '&' },
            { type : TokenTypes.NOTE,   token : 'C' },
            { type : TokenTypes.NUMBER, token : '2.' },
            { type : TokenTypes.REST,   token : 'R' },
            { type : TokenTypes.NUMBER, token : '4' },
            { type : TokenTypes.NOTE,   token : 'DB-F' },
            { type : TokenTypes.NUMBER, token : '2.' }
        ].map(({ type, token }) => {
            return new Token(type, token);
        });

        while (actual.getType() !== TokenTypes.EOS) {
            const expected = expectedTokens.shift();

            expect(actual).toEqual(jasmine.any(Token));
            expect(actual.getType()).toEqual(expected.getType());
            expect(actual.getToken()).toEqual(expected.getToken());
            expect(actual.getValue()).toEqual(expected.getValue());

            actual = tokenizer.get();
        }

        expect(actual.getType()).toEqual(TokenTypes.EOS);
    });

    it('should return `EOS`', () => {
        const tokenizer = new Tokenizer('');

        const actual = tokenizer.get();

        expect(actual.getType()).toEqual(TokenTypes.EOS);
    });
});
