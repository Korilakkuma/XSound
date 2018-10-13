'use strict';

import { StreamModule } from '../../src/StreamModule';

describe('StreamModule TEST', () => {
    describe('StreamModule#toString', () => {
        const streamModule = new StreamModule(audiocontext);

        it('should return "[StreamModule]"', () => {
            expect(streamModule.toString()).toEqual('[StreamModule]');
        });
    });
});
