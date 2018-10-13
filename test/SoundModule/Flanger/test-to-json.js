'use strict';

import { Flanger } from '../../../src/SoundModule/Flanger';

describe('Flanger TEST', () => {
    describe('Flanger#toJSON', () => {
        const flanger = new Flanger(audiocontext, 1024);

        it('should return JSON', () => {
            expect(flanger.toJSON()).toEqual('{"state":false,"time":0,"depth":0,"rate":0,"mix":0,"tone":350,"feedback":0}');
        });
    });
});
