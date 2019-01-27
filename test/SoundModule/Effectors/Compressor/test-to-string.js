'use strict';

import { Compressor } from '../../../../src/SoundModule/Effectors/Compressor';

describe('Compressor TEST', () => {
    describe('Compressor#toString', () => {
        const compressor = new Compressor(audiocontext, 1024);

        it('should return "[SoundModule Compressor]"', () => {
            expect(compressor.toString()).toEqual('[SoundModule Compressor]');
        });
    });
});
