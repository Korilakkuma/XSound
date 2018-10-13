'use strict';

import { SoundModule } from '../../src/SoundModule';

describe('SoundModule TEST', () => {
    describe('SoundModule#toString', () => {
        const soundModule = new SoundModule(audiocontext);

        it('should return "[SoundModule]"', () => {
            expect(soundModule.toString()).toEqual('[SoundModule]');
        });
    });
});
