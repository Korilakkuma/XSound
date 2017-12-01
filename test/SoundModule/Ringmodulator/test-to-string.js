'use strict';

import Ringmodulator from '../../../src/SoundModule/Ringmodulator';

describe('Ringmodulator TEST', () => {
    describe('Ringmodulator#toString', () => {
        const ringmodulator = new Ringmodulator(audiocontext, 1024);

        it('should return "[SoundModule Ringmodulator]"', () => {
            expect(ringmodulator.toString()).toEqual('[SoundModule Ringmodulator]');
        });
    });
});
