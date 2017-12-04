'use strict';

import Oscillator from '../../../src/OscillatorModule/Oscillator';

describe('Oscillator TEST', () => {
    describe('Oscillator#get', () => {
        const oscillator = new Oscillator(audiocontext, true);

        it('should return the instance of `OscillatorNode`', () => {
            expect(oscillator.get()).toEqual(jasmine.any(OscillatorNode));
        });
    });
});
