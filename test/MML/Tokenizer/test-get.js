'use strict';

import { Tokenizer } from '../../../src/MML/Tokenizer';

describe('Tokenizer', () => {
    it('should return expected token', () => {
        const tokenizer = new Tokenizer('T62 O3 R16 A16 B-16 O4 D16 F12 A12 O5 F12 C2&C2. R4 DB-F2.');

        let actual = tokenizer.get();

        const expected = ['T', '62', 'O', '3', 'R', '16', 'A', '16', 'B-', '16', 'O', '4', 'D', '16', 'F', '12', 'A', '12', 'O', '5', 'F', '12', 'C', '2', '&', 'C', '2', '.', 'R', '4', 'DB-F', '2', '.'];

        while (actual !== Tokenizer.EOS) {
            expect(actual).toEqual(expected.shift());
            actual = tokenizer.get();
        }

        expect(actual).toEqual(Tokenizer.EOS);
    });

    it('should return `EOS`', () => {
        const tokenizer = new Tokenizer('');

        expect(tokenizer.get()).toEqual(Tokenizer.EOS);
    });
});
