'use strict';

import Reverb from '../../../src/SoundModule/Reverb';

describe('Reverb TEST', () => {
    describe('Reverb#toString', () => {
        const reverb = new Reverb(audiocontext, 1024);

        it('should return "[SoundModule Reverb]"', () => {
            expect(reverb.toString()).toEqual('[SoundModule Reverb]');
        });
    });
});
