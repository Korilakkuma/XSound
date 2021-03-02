'use strict';

/**
 * MML characters are corresponds to tokens by this map.
 * Namely, this map is definitions of MML Tokens.
 */
export const TokenMap = new Map([
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
 * This is enumeration types for MML Tokens.
 */
export const TokenTypes = {
    'TEMPO'  : 1,
    'OCTAVE' : 2,
    'NOTE'   : 3,
    'REST'   : 4,
    'NUMBER' : 5,
    'TIE'    : 6,
    'SPACE'  : 7,
    'EOS'    : 8,
    'UNKNOWN': 9
};
