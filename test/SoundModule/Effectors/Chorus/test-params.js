'use strict';

import { Chorus } from '../../../../src/SoundModule/Effectors/Chorus';

describe('Chorus TEST', () => {
    describe('Chorus#params', () => {
        const chorus = new Chorus(audiocontext, 1024);

        it('should return associative array', () => {
            expect(chorus.params()).toEqual({
                'state'    : false,
                'time'     : 0,
                'depth'    : 0,
                'rate'     : 0,
                'mix'      : 0,
                'tone'     : 350,
                'feedback' : 0
            });
        });
    });
});
