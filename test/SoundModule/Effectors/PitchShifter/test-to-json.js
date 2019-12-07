'use strict';

import { PitchShifter } from '../../../../src/SoundModule/Effectors/PitchShifter';

describe('PitchShifter TEST', () => {
    describe('PitchShifter#toJSON', () => {
        const tremolo = new PitchShifter(audiocontext, 1024);

        it('should return JSON', () => {
            expect(tremolo.toJSON()).toEqual('{"state":false,"pitch":1}');
        });
    });
});
