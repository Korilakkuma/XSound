'use strict';

import { Recorder } from '../../../src/SoundModule/Recorder';

describe('Recorder TEST', () => {
    describe('Recorder#toString', () => {
        const recorder = new Recorder(audiocontext, 1024, 2, 2);

        it('should return "[SoundModule Recorder]"', () => {
            expect(recorder.toString()).toEqual('[SoundModule Recorder]');
        });
    });
});
