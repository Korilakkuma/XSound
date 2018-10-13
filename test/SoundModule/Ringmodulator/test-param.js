'use strict';

import { Ringmodulator } from '../../../src/SoundModule/Ringmodulator';

describe('Ringmodulator TEST', () => {
    describe('Ringmodulator#param', () => {
        const ringmodulator = new Ringmodulator(audiocontext, 1024);

        describe('depth', () => {
            afterEach(() => {
                ringmodulator.param('depth', 1);
            });

            // Getter
            // Positive
            it('should return 1', () => {
                expect(ringmodulator.param('depth')).toEqual(1);
            });

            // Negative
            it('should return the instance of `Ringmodulator`', () => {
                expect(ringmodulator.param('')).toEqual(jasmine.any(Ringmodulator));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                ringmodulator.param('depth', 0.5);
                expect(ringmodulator.param('depth')).toEqual(0.5);
            });

            it('should return 1', () => {
                ringmodulator.param('depth', 1);
                expect(ringmodulator.param('depth')).toEqual(1);
            });

            it('should return 0', () => {
                ringmodulator.param('depth', 0);
                expect(ringmodulator.param('depth')).toEqual(0);
            });

            // Negative
            it('should return 1', () => {
                ringmodulator.param('depth', 1.1);
                expect(ringmodulator.param('depth')).toEqual(1);
            });

            it('should return 1', () => {
                ringmodulator.param('depth', -0.1);
                expect(ringmodulator.param('depth')).toEqual(1);
            });
        });

        describe('rate', () => {
            afterEach(() => {
                ringmodulator.param('rate', 0);
            });

            // Getter
            // Positive
            it('should return 0', () => {
                expect(ringmodulator.param('rate')).toEqual(0);
            });

            // Negative
            it('should return the instance of `Ringmodulator`', () => {
                expect(ringmodulator.param('')).toEqual(jasmine.any(Ringmodulator));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                ringmodulator.param('rate', 0.5);
                expect(ringmodulator.param('rate')).toEqual(0.5);
            });

            it('should return the Nyquist frequency (half the sample-rate)', () => {
                ringmodulator.param('rate', (audiocontext.sampleRate / 2));
                expect(ringmodulator.param('rate')).toEqual(audiocontext.sampleRate / 2);
            });

            it('should return 0', () => {
                ringmodulator.param('rate', 0);
                expect(ringmodulator.param('rate')).toEqual(0);
            });

            // Negative
            it('should return 0', () => {
                ringmodulator.param('rate', ((audiocontext.sampleRate / 2) + 0.1));
                expect(ringmodulator.param('rate')).toEqual(0);
            });

            it('should return 0', () => {
                ringmodulator.param('rate', -0.1);
                expect(ringmodulator.param('rate')).toEqual(0);
            });
        });
    });
});
