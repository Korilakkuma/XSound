'use strict';

import AudioModule from '../../src/AudioModule';

describe('AudioModule TEST', () => {
    describe('AudioModule#toString', () => {
        const audioModule = new AudioModule(audiocontext);

        it('should return "[AudioModule]"', () => {
            expect(audioModule.toString()).toEqual('[AudioModule]');
        });
    });
});
