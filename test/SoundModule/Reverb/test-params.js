'use strict';

import { Reverb } from '../../../src/SoundModule/Reverb';

describe('Reverb TEST', () => {
    describe('Reverb#params', () => {
        const reverb = new Reverb(audiocontext, 1024);

        it('should return associative array', () => {
            expect(reverb.params()).toEqual({
                'state' : false,
                'dry'   : 1,
                'wet'   : 0,
                'tone'  : 350
            });
        });
    });
});
