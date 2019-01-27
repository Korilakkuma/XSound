'use strict';

import { Tremolo } from '../../../../src/SoundModule/Effectors/Tremolo';

describe('Tremolo TEST', () => {
    describe('Tremolo#params', () => {
        const tremolo = new Tremolo(audiocontext, 1024);

        it('should return associative array', () => {
            expect(tremolo.params()).toEqual({
                'state' : false,
                'depth' : 0,
                'rate'  : 0,
                'wave'  : 'sine'
            });
        });
    });
});
