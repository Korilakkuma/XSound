'use strict';

import { Delay } from '../../../src/SoundModule/Delay';

describe('Delay TEST', () => {
    describe('Delay#toString', () => {
        const delay = new Delay(audiocontext, 1024);

        it('should return "[SoundModule Delay]"', () => {
            expect(delay.toString()).toEqual('[SoundModule Delay]');
        });
    });
});
