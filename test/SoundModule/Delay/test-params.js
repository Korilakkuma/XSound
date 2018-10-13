'use strict';

import { Delay } from '../../../src/SoundModule/Delay';

describe('Delay TEST', () => {
    describe('Delay#params', () => {
        const delay = new Delay(audiocontext, 1024);

        it('should return associative array', () => {
            expect(delay.params()).toEqual({
                'state'    : false,
                'time'     : 0,
                'dry'      : 1,
                'wet'      : 0,
                'tone'     : 350,
                'feedback' : 0
            });
        });
    });
});
