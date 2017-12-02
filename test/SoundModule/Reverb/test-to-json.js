'use strict';

import Reverb from '../../../src/SoundModule/Reverb';

describe('Reverb TEST', () => {
    describe('Reverb#toJSON', () => {
        const reverb = new Reverb(audiocontext, 1024);

        it('should return JSON', () => {
            expect(reverb.toJSON()).toEqual('{"state":false,"dry":1,"wet":0,"tone":350}');
        });
    });
});
