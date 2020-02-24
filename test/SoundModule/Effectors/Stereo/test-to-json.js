'use strict';

import { Stereo } from '../../../../src/SoundModule/Effectors/Stereo';

describe('Stereo TEST', () => {
    describe('Stereo#toJSON', () => {
        const stereo = new Stereo(audiocontext, 1024);

        it('should return JSON', () => {
            expect(stereo.toJSON()).toEqual('{"state":false,"time":0}');
        });
    });
});
