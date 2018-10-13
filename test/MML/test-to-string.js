'use strict';

import { MML } from '../../src/MML';

describe('MML TEST', () => {
    describe('MML#toString', () => {
        const mml = new MML(audiocontext);

        it('should return "[MML]"', () => {
            expect(mml.toString()).toEqual('[MML]');
        });
    });
});
