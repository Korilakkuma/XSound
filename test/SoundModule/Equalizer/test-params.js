'use strict';

import Equalizer from '../../../src/SoundModule/Equalizer';

describe('Equalizer TEST', () => {
    describe('Equalizer#params', () => {
        const equalizer = new Equalizer(audiocontext, 1024);

        it('should return associative array', () => {
            expect(equalizer.params()).toEqual({
                'state'    : false,
                'bass'     : 0,
                'middle'   : 0,
                'treble'   : 0,
                'presence' : 0
            });
        });
    });
});
