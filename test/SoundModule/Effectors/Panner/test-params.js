'use strict';

import { Panner } from '../../../../src/SoundModule/Effectors/Panner';

describe('Panner TEST', () => {
    describe('Panner#params', () => {
        const panner = new Panner(audiocontext, 1024);

        it('should return associative array', () => {
            expect(panner.params()).toEqual({
                'state'          : false,
                'positions'      : { 'x' : 0, 'y' : 0, 'z' : 0 },
                'orientations'   : { 'x' : 1, 'y' : 0, 'z' : 0 },
                'refDistance'    : 1,
                'maxDistance'    : 10000,
                'rolloffFactor'  : 1,
                'coneInnerAngle' : 360,
                'coneOuterAngle' : 360,
                'coneOuterGain'  : 0,
                'panningModel'   : 'HRTF',
                'distanceModel'  : 'inverse'
            });
        });
    });
});
