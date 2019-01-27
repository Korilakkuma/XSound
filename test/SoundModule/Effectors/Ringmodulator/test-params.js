'use strict';

import { Ringmodulator } from '../../../../src/SoundModule/Effectors/Ringmodulator';

describe('Ringmodulator TEST', () => {
    describe('Ringmodulator#params', () => {
        const ringmodulator = new Ringmodulator(audiocontext, 1024);

        it('should return associative array', () => {
            expect(ringmodulator.params()).toEqual({
                'state' : false,
                'depth' : 1,
                'rate'  : 0
            });
        });
    });
});
