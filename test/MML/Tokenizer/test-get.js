'use strict';

import { TokenTypes } from '../../../src/MML/TokenDefinitions';
import { Token } from '../../../src/MML/Token';
import { Tokenizer } from '../../../src/MML/Tokenizer';

describe('Tokenizer', () => {
    it('should return expected token', () => {
        const tokenizer = new Tokenizer('T62 O3 R16 A16 B-16 O4 D16 F12 A12 O5 F12 C2&C2. R4 DB-F2.');

        let actual = tokenizer.get();

        const expectedTokens = ['T', '62', 'O', '3', 'R', '16', 'A', '16', 'B-', '16', 'O', '4', 'D', '16', 'F', '12', 'A', '12', 'O', '5', 'F', '12', 'C', '2', '&', 'C', '2.', 'R', '4', 'DB-F', '2.'].map(token => new Token(token));

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
