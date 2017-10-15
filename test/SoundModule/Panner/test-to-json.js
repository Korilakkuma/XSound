'use strict';

import Panner from '../../../src/SoundModule/Panner';

describe('Panner TEST', () => {
    describe('Panner#toJSON', () => {
        const panner = new Panner(audiocontext, 1024);

        it('should return JSON', () => {
            expect(panner.toJSON()).toEqual('{"state":false,"positions":{"x":0,"y":0,"z":0},"orientations":{"x":1,"y":0,"z":0},"refDistance":1,"maxDistance":10000,"rolloffFactor":1,"coneInnerAngle":360,"coneOuterAngle":360,"coneOuterGain":0,"panningModel":"HRTF","distanceModel":"inverse"}');
        });
    });
});
