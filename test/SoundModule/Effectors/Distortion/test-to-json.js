'use strict';

import { Distortion } from '../../../../src/SoundModule/Effectors/Distortion';

describe('Distortion TEST', () => {
    describe('Distortion#toJSON', () => {
        const distortion = new Distortion(audiocontext, 1024);

        it('should return JSON', () => {
            expect(distortion.toJSON()).toEqual('{"state":false,"curve":"clean","samples":256,"pre":false,"gain":0.5,"lead":0.5,"post":false,"bass":0,"middle":0,"treble":0,"frequency":500,"cabinet":false}');
        });
    });
});
