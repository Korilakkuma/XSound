'use strict';

import { OscillatorModule } from '../../src/OscillatorModule';
import { Oscillator } from '../../src/OscillatorModule/Oscillator';

describe('OscillatorModule TEST', () => {
    describe('OscillatorModule#get', () => {
        const oscillatorModule = new OscillatorModule(audiocontext);

        beforeEach(() => {
            oscillatorModule.setup([true, false]);
        });

        afterEach(() => {
            oscillatorModule.setup();
        });

        // Positive
        it('should return the instance of `Oscillator`', () => {
            expect(oscillatorModule.get(0)).toEqual(jasmine.any(Oscillator));
        });

        it('should return the instance of `Oscillator`', () => {
            expect(oscillatorModule.get(1)).toEqual(jasmine.any(Oscillator));
        });

        it('should return array that contains the instances of `Oscillator`', () => {
            const oscillators = oscillatorModule.get();

            expect(oscillators[0]).toEqual(jasmine.any(Oscillator));
            expect(oscillators[1]).toEqual(jasmine.any(Oscillator));
        });

        // Negative
        it('should return array that contains the instances of `Oscillator`', () => {
            const oscillators = oscillatorModule.get(-1);

            expect(oscillators[0]).toEqual(jasmine.any(Oscillator));
            expect(oscillators[1]).toEqual(jasmine.any(Oscillator));
        });

        it('should return array that contains the instances of `Oscillator`', () => {
            const oscillators = oscillatorModule.get(3);

            expect(oscillators[0]).toEqual(jasmine.any(Oscillator));
            expect(oscillators[1]).toEqual(jasmine.any(Oscillator));
        });
    });
});
