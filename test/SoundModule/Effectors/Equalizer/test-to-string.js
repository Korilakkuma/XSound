'use strict';

import { Equalizer } from '../../../../src/SoundModule/Effectors/Equalizer';

describe('Equalizer TEST', () => {
    describe('Equalizer#toString', () => {
        const equalizer = new Equalizer(audiocontext, 1024);

        it('should return "[SoundModule Equalizer]"', () => {
            expect(equalizer.toString()).toEqual('[SoundModule Equalizer]');
        });
    });
});
