'use strict';

import Glide from '../../../src/OscillatorModule/Glide';

describe('Glide TEST', () => {
    describe('Glide#toString', () => {
        const glide = new Glide(audiocontext);

        it('should return "[OscillatorModule Glide]"', () => {
            expect(glide.toString()).toEqual('[OscillatorModule Glide]');
        });
    });
});
