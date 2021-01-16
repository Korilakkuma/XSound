'use strict';

import { Distortion } from '../../../../src/SoundModule/Effectors/Distortion';

describe('Distortion TEST', () => {
    describe('Distortion#toJSON', () => {
        const distortion = new Distortion(audiocontext, 1024);

        it('should return JSON', () => {
            expect(distortion.toJSON()).toEqual('{"state":false,"curve":"clean","amount":0.5,"samples":4096,"drive":1,"color":350,"tone":350}');
        });
    });
});
