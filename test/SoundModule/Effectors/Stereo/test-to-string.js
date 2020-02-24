'use strict';

import { Stereo } from '../../../../src/SoundModule/Effectors/Stereo';

describe('Stereo TEST', () => {
    describe('Stereo#toString', () => {
        const stereo = new Stereo(audiocontext, 1024);

        it('should return "[SoundModule Stereo]"', () => {
            expect(stereo.toString()).toEqual('[SoundModule Stereo]');
        });
    });
});
