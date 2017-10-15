'use strict';

import OneshotModule from '../../src/OneshotModule';

describe('OneshotModule TEST', () => {
    describe('OneshotModule#toString', () => {
        const oneshotModule = new OneshotModule(audiocontext);

        it('should return "[OneshotModule]"', () => {
            expect(oneshotModule.toString()).toEqual('[OneshotModule]');
        });
    });
});
