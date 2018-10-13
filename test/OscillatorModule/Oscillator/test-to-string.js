'use strict';

import { Oscillator } from '../../../src/OscillatorModule/Oscillator';

describe('Oscillator TEST', () => {
    describe('Oscillator#toString', () => {
        const oscillator = new Oscillator(audiocontext, true);

        it('should return "[OscillatorModule Oscillator]"', () => {
            expect(oscillator.toString()).toEqual('[OscillatorModule Oscillator]');
        });
    });
});
