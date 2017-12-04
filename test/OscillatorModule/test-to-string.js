'use strict';

import OscillatorModule from '../../src/OscillatorModule';

describe('OscillatorModule TEST', () => {
    describe('OscillatorModule#toString', () => {
        const oscillatorModule = new OscillatorModule(audiocontext);

        it('should return "[OscillatorModule]"', () => {
            expect(oscillatorModule.toString()).toEqual('[OscillatorModule]');
        });
    });
});
