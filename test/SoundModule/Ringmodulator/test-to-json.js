'use strict';

import Ringmodulator from '../../../src/SoundModule/Ringmodulator';

describe('Ringmodulator TEST', () => {
    describe('Ringmodulator#toJSON', () => {
        const ringmodulator = new Ringmodulator(audiocontext, 1024);

        it('should return JSON', () => {
            expect(ringmodulator.toJSON()).toEqual('{"state":false,"depth":1,"rate":0}');
        });
    });
});
