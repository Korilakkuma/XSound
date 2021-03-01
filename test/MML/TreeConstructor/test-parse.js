'use strict';

import { Token } from '../../../src/MML/Token';
import { Tokenizer } from '../../../src/MML/Tokenizer';
import { TreeConstructor } from '../../../src/MML/TreeConstructor';

describe('TreeConstructor', () => {
    const tokenizer       = new Tokenizer('T62 O3 R16 A16 B-16 O4 D16 F12 A12 O5 F12 C2&C2. R4 DB-F2.');
    const treeConstructor = new TreeConstructor(tokenizer);

    it('should return expected token', () => {
        const actualMMLs   = treeConstructor.parse();
        const expectedMMLs = [['T', '62'], ['O', '3'], ['R', '16'], ['A', '16'], ['B-', '16'], ['O', '4'], ['D', '16'], ['F', '12'], ['A', '12'], ['O', '5'], ['F', '12'], ['C', '2'], ['&'], ['C', '2.'], ['R', '4'], ['DB-F', '2.']].map(tokens => tokens.map(t => new Token(t)));

        actualMMLs.forEach((actualMML, index) => {
            actualMML.forEach((actual, tokenIndex) => {
                const expected = expectedMMLs[index][tokenIndex];

                expect(actual).toEqual(jasmine.any(Token));
                expect(actual.getType()).toEqual(expected.getType());
                expect(actual.getToken()).toEqual(expected.getToken());
                expect(actual.getValue()).toEqual(expected.getValue());
            });
        });
    });
});
