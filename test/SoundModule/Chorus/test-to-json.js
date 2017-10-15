'use strict';

import Chorus from '../../../src/SoundModule/Chorus';

describe('Chorus TEST', () => {
    describe('Chorus#toJSON', () => {
        const chorus = new Chorus(audiocontext, 1024);

        it('should return JSON', () => {
            expect(chorus.toJSON()).toEqual('{"state":false,"time":0,"depth":0,"rate":0,"mix":0,"tone":350,"feedback":0}');
        });
    });
});
