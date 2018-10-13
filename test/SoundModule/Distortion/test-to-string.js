'use strict';

import { Distortion } from '../../../src/SoundModule/Distortion';

describe('Distortion TEST', () => {
    describe('Distortion#toString', () => {
        const distortion = new Distortion(audiocontext, 1024);

        it('should return "[SoundModule Distortion]"', () => {
            expect(distortion.toString()).toEqual('[SoundModule Distortion]');
        });
    });
});
