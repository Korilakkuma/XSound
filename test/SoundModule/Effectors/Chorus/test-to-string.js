'use strict';

import { Chorus } from '../../../../src/SoundModule/Effectors/Chorus';

describe('Chorus TEST', () => {
    describe('Chorus#toString', () => {
        const chorus = new Chorus(audiocontext, 1024);

        it('should return "[SoundModule Chorus]"', () => {
            expect(chorus.toString()).toEqual('[SoundModule Chorus]');
        });
    });
});
