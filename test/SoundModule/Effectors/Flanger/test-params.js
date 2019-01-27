'use strict';

import { Flanger } from '../../../../src/SoundModule/Effectors/Flanger';

describe('Flanger TEST', () => {
    describe('Flanger#params', () => {
        const flanger = new Flanger(audiocontext, 1024);

        it('should return associative array', () => {
            expect(flanger.params()).toEqual({
                'state'    : false,
                'time'     : 0,
                'depth'    : 0,
                'rate'     : 0,
                'mix'      : 0,
                'tone'     : 350,
                'feedback' : 0
            });
        });
    });
});
