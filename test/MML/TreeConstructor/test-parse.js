'use strict';

import { Tokenizer } from '../../../src/MML/Tokenizer';
import { TreeConstructor } from '../../../src/MML/TreeConstructor';

describe('TreeConstructor', () => {
    const tokenizer       = new Tokenizer('T62 O3 R16 A16 B-16 O4 D16 F12 A12 O5 F12 C2&C2. R4 DB-F2.');
    const treeConstructor = new TreeConstructor(tokenizer);

    it('should return expected token', () => {
        const actual   = treeConstructor.parse();
        const expected = [
            {
                syntax : 'T62',
                digits : [
                    { digit: 62, dot: false }
                ],
                token  : Tokenizer.TEMPO
            },
            {
                syntax : 'O3',
                digits : [
                    { digit: 3, dot: false }
                ],
                token : Tokenizer.OCTAVE
            },
            {
                syntax : 'R16',
                digits : [
                    { digit: 16, dot: false }
                ]
            },
            {
                syntax : 'A16',
                digits : [
                    { digit: 16, dot: false }
                ]
            },
            {
                syntax : 'B-16',
                digits : [
                    { digit: 16, dot: false }
                ]
            },
            {
                syntax : 'O4',
                digits : [
                    { digit: 4, dot: false }
                ],
                token  : Tokenizer.OCTAVE
            },
            {
                syntax : 'D16',
                digits : [
                    { digit: 16, dot: false }
                ]
            },
            {
                syntax : 'F12',
                digits : [
                    { digit: 12, dot: false }
                ]
            },
            {
                syntax : 'A12',
                digits : [
                    { digit: 12, dot: false }
                ]
            },
            {
                syntax : 'O5',
                digits : [
                    { digit:  5, dot: false }
                ],
                token  : Tokenizer.OCTAVE
            },
            {
                syntax : 'F12',
                digits : [
                    { digit: 12, dot: false }
                ]
            },
            {
                syntax : 'C2&C2.',
                digits : [
                    { digit: 2, dot: false },
                    { digit: 2, dot: true  }
                ]
            },
            {
                syntax : 'R4',
                digits : [
                    { digit: 4, dot: false }
                ]
            },
            {
                syntax : 'DB-F2.',
                digits : [
                    { digit: 2, dot: true }
                ]
            }
        ];

        expect(actual).toEqual(expected);
    });
});
