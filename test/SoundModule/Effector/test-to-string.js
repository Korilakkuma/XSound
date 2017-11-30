'use strict';

import Effector from '../../../src/SoundModule/Effector';

describe('Effector TEST', () => {
    describe('Effector#toString', () => {
        const effector = new Effector(audiocontext, 1024);

        it('should return "[SoundModule Effector]"', () => {
            expect(effector.toString()).toEqual('[SoundModule Effector]');
        });
    });
});
