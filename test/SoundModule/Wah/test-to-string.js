'use strict';

import Wah from '../../../src/SoundModule/Wah';

describe('Wah TEST', () => {
    describe('Wah#toString', () => {
        const wah = new Wah(audiocontext, 1024);

        it('should return "[SoundModule Wah]"', () => {
            expect(wah.toString()).toEqual('[SoundModule Wah]');
        });
    });
});
