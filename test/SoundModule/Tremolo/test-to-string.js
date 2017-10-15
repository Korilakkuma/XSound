'use strict';

import Tremolo from '../../../src/SoundModule/Tremolo';

describe('Tremolo TEST', () => {
    describe('Tremolo#toString', () => {
        const tremolo = new Tremolo(audiocontext, 1024);

        it('should return "[SoundModule Tremolo]"', () => {
            expect(tremolo.toString()).toEqual('[SoundModule Tremolo]');
        });
    });
});
