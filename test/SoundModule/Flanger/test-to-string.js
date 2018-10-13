'use strict';

import { Flanger } from '../../../src/SoundModule/Flanger';

describe('Flanger TEST', () => {
    describe('Flanger#toString', () => {
        const flanger = new Flanger(audiocontext, 1024);

        it('should return "[SoundModule Flanger]"', () => {
            expect(flanger.toString()).toEqual('[SoundModule Flanger]');
        });
    });
});
