'use strict';

import MIDI from '../../src/MIDI';

describe('MIDI TEST', () => {
    describe('MIDI#toString', () => {
        const midi = new MIDI(audiocontext);

        it('should return "[MIDI]"', () => {
            expect(midi.toString()).toEqual('[MIDI]');
        });
    });
});
