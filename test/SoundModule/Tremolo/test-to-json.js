'use strict';

import Tremolo from '../../../src/SoundModule/Tremolo';

describe('Tremolo TEST', () => {
    describe('Tremolo#toJSON', () => {
        const tremolo = new Tremolo(audiocontext, 1024);

        it('should return JSON', () => {
            expect(tremolo.toJSON()).toEqual('{"state":false,"depth":0,"rate":0,"wave":"sine"}');
        });
    });
});
