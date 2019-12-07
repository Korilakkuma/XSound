'use strict';

import { PitchShifter } from '../../../../src/SoundModule/Effectors/PitchShifter';

describe('PitchShifter TEST', () => {
    describe('PitchShifter#params', () => {
        const tremolo = new PitchShifter(audiocontext, 1024);

        it('should return associative array', () => {
            expect(tremolo.params()).toEqual({
                'state' : false,
                'pitch' : 1
            });
        });
    });
});
