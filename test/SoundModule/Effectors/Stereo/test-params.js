'use strict';

import { Stereo } from '../../../../src/SoundModule/Effectors/Stereo';

describe('Stereo TEST', () => {
    describe('Stereo#params', () => {
        const stereo = new Stereo(audiocontext, 1024);

        it('should return associative array', () => {
            expect(stereo.params()).toEqual({
                'state' : false,
                'time'  : 0
            });
        });
    });
});
