'use strict';

import { Panner } from '../../../src/SoundModule/Panner';

describe('Panner TEST', () => {
    describe('Panner#toString', () => {
        const panner = new Panner(audiocontext, 1024);

        it('should return "[SoundModule Panner]"', () => {
            expect(panner.toString()).toEqual('[SoundModule Panner]');
        });
    });
});
