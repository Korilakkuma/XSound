'use strict';

import { Compressor } from '../../../../src/SoundModule/Effectors/Compressor';

describe('Compressor TEST', () => {
    describe('Compressor#params', () => {
        const compressor = new Compressor(audiocontext, 1024);

        it('should return associative array', () => {
            expect(compressor.params()).toEqual({
                'state'     : true,
                'threshold' : -24,
                'knee'      : 30,
                'ratio'     : 12,
                'attack'    : 0.003000000026077032,
                'release'   : 0.25
            });
        });
    });
});
