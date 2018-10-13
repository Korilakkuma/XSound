'use strict';

import { Distortion } from '../../../src/SoundModule/Distortion';

describe('Distortion TEST', () => {
    describe('Distortion#params', () => {
        const distortion = new Distortion(audiocontext, 1024);

        it('should return associative array', () => {
            expect(distortion.params()).toEqual({
                'state'   : false,
                'curve'   : 'clean',
                'samples' : 4096,
                'drive'   : 1,
                'color'   : 350,
                'tone'    : 350
            });
        });
    });
});
