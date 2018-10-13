'use strict';

import { Filter } from '../../../src/SoundModule/Filter';

describe('Filter TEST', () => {
    describe('Filter#toString', () => {
        const filter = new Filter(audiocontext, 1024);

        it('should return "[SoundModule Filter]"', () => {
            expect(filter.toString()).toEqual('[SoundModule Filter]');
        });
    });
});
