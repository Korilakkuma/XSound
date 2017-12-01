'use strict';

import Autopanner from '../../../src/SoundModule/Autopanner';

describe('Autopanner TEST', () => {
    describe('Autopanner#params', () => {
        const autopanner = new Autopanner(audiocontext, 1024);

        it('should return associative array', () => {
            expect(autopanner.params()).toEqual({
                'state' : false,
                'depth' : 0,
                'rate'  : 0
            });
        });
    });
});
