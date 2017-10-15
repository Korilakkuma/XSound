'use strict';

import MediaModule from '../../src/MediaModule';

describe('MediaModule TEST', () => {
    describe('MediaModule#toString', () => {
        const mediaModule = new MediaModule(audiocontext);

        it('should return "[MediaModule]"', () => {
            expect(mediaModule.toString()).toEqual('[MediaModule]');
        });
    });
});
