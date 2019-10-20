'use strict';

import { Wah } from '../../../../src/SoundModule/Effectors/Wah';

describe('Wah TEST', () => {
    describe('Wah#params', () => {
        const wah = new Wah(audiocontext, 1024);

        it('should return associative array', () => {
            expect(wah.params()).toEqual({
                'state'     : false,
                'auto'      : false,
                'cutoff'    : 350,
                'depth'     : 0,
                'rate'      : 0,
                'resonance' : 1
            });
        });
    });
});
