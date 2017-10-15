'use strict';

import MixerModule from '../../src/MixerModule';

describe('MixerModule TEST', () => {
    describe('MixerModule#toString', () => {
        const mixerModule = new MixerModule(audiocontext);

        it('should return "[MixerModule]"', () => {
            expect(mixerModule.toString()).toEqual('[MixerModule]');
        });
    });
});
