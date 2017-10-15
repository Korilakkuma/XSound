'use strict';

import OscillatorModule from '../../src/OscillatorModule';

describe('OscillatorModule TEST', () => {
    describe('OscillatorModule#length', () => {
        const oscillatorModule = new OscillatorModule(audiocontext);

        afterEach(() => {
            oscillatorModule.setup();
        });

        it('should return 0', () => {
            oscillatorModule.setup();
            expect(oscillatorModule.length()).toEqual(1);
        });

        it('should return 1', () => {
            oscillatorModule.setup(true);
            expect(oscillatorModule.length()).toEqual(1);
        });

        it('should return 2', () => {
            oscillatorModule.setup([true, false]);
            expect(oscillatorModule.length()).toEqual(2);
        });
    });
});
