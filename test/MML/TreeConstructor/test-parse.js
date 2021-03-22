'use strict';

import { Tokenizer } from '../../../src/MML/Tokenizer';
import { TreeConstructor } from '../../../src/MML/TreeConstructor';

describe('TreeConstructor', () => {
    const tokenizer       = new Tokenizer('T62 O3 R16 A16 B-16 O4 D16 F12 A12 O5 F12 C2&C2. R4 DB-F2.');
    const treeConstructor = new TreeConstructor(tokenizer);

    it('should return expected token', () => {
        const syntaxTrees         = treeConstructor.parse();
        const expectedSyntaxTrees = [
            'T',
            '62',
            'O',
            '3',
            'R',
            '16',
            'A',
            '16',
            'B-',
            '16',
            'O',
            '4',
            'D',
            '16',
            'F',
            '12',
            'A',
            '12',
            'O',
            '5',
            'F',
            '12',
            'C',
            '2',
            '&',
            'C',
            '2.',
            'R',
            '4',
            'DB-F',
            '2.',
            'EOS'
        ];

        syntaxTrees[0].toString()
            .split('\n')
            .map(actual => actual.trim())
            .filter(actual => (actual !== '') && (actual !== '/\\'))
            .forEach((actual, index) => {
                expect(actual).toEqual(expectedSyntaxTrees[index]);
            });
    });
});
