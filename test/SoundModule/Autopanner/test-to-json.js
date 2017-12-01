'use strict';

import Autopanner from '../../../src/SoundModule/Autopanner';

describe('Autopanner TEST', () => {
    describe('Autopanner#toJSON', () => {
        const autopanner = new Autopanner(audiocontext, 1024);

        it('should return JSON', () => {
            expect(autopanner.toJSON()).toEqual('{"state":false,"depth":0,"rate":0}');
        });
    });
});
