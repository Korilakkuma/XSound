'use strict';

import { NoiseGate } from '../../../src/StreamModule/NoiseGate';

describe('NoiseGate TEST', () => {
    describe('NoiseGate#toString', () => {
        const noisegate = new NoiseGate();

        it('should return "[NoiseGate]"', () => {
            expect(noisegate.toString()).toEqual('[StreamModule NoiseGate]');
        });
    });
});
