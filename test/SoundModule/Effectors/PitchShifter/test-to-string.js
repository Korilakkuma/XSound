'use strict';

import { PitchShifter } from '../../../../src/SoundModule/Effectors/PitchShifter';

describe('PitchShifter TEST', () => {
    describe('PitchShifter#toString', () => {
        const tremolo = new PitchShifter(audiocontext, 1024);

        it('should return "[SoundModule PitchShifter]"', () => {
            expect(tremolo.toString()).toEqual('[SoundModule PitchShifter]');
        });
    });
});
