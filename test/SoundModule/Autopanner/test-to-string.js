'use strict';

import Autopanner from '../../../src/SoundModule/Autopanner';

describe('Autopanner TEST', () => {
    describe('Autopanner#toString', () => {
        const autopanner = new Autopanner(audiocontext, 1024);

        it('should return "[SoundModule Autopanner]"', () => {
            expect(autopanner.toString()).toEqual('[SoundModule Autopanner]');
        });
    });
});
