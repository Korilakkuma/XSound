'use strict';

import Oscillator from '../../../src/OscillatorModule/Oscillator';

describe('Oscillator TEST', () => {
    describe('Oscillator#param', () => {
        const oscillator = new Oscillator(audiocontext, true);

        describe('type', () => {
            afterEach(() => {
                oscillator.param('type', 'sine');
            });

            // Getter
            // Positive
            it('should return "sine"', () => {
                expect(oscillator.param('type')).toEqual('sine');
            });

            // Negative
            it('should return the instance of `Oscillator`', () => {
                expect(oscillator.param('')).toEqual(jasmine.any(Oscillator));
            });

            // Setter
            // Positive
            it('should return "sine"', () => {
                oscillator.param('type', 'sine');
                expect(oscillator.param('type')).toEqual('sine');
            });

            it('should return "square"', () => {
                oscillator.param('type', 'square');
                expect(oscillator.param('type')).toEqual('square');
            });

            it('should return "sawtooth"', () => {
                oscillator.param('type', 'sawtooth');
                expect(oscillator.param('type')).toEqual('sawtooth');
            });

            it('should return "triangle"', () => {
                oscillator.param('type', 'triangle');
                expect(oscillator.param('type')).toEqual('triangle');
            });

            it('should return "custom"', () => {
                const value = {
                    'real' : new Float32Array([0, 1, 1.5, 2]),
                    'imag' : new Float32Array([0, 1, 1.5, 2])
                };

                oscillator.param('type', value);
                expect(oscillator.param('type')).toEqual('custom');
            });

            it('should return "custom"', () => {
                const value = {
                    'real' : [0, 1, 1.5, 2],
                    'imag' : [0, 1, 1.5, 2]
                };

                oscillator.param('type', value);
                expect(oscillator.param('type')).toEqual('custom');
            });

            // Negative
            it('should return "sine"', () => {
                oscillator.param('type', '');
                expect(oscillator.param('type')).toEqual('sine');
            });

            it('should return "sine"', () => {
                const value = {
                    'r' : [0, 1, 1.5, 2],
                    'i' : [0, 1, 1.5, 2]
                };

                oscillator.param('type', value);
                expect(oscillator.param('type')).toEqual('sine');
            });
        });

        describe('gain', () => {
            afterEach(() => {
                oscillator.param('gain', 1);
            });

            // Getter
            // Positive
            it('should return 1', () => {
                expect(oscillator.param('gain')).toEqual(1);
            });

            // Negative
            it('should return the instance of `Oscillator`', () => {
                expect(oscillator.param('')).toEqual(jasmine.any(Oscillator));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                oscillator.param('gain', 0.5);
                expect(oscillator.param('gain')).toEqual(0.5);
            });

            it('should return 1', () => {
                oscillator.param('gain', 1);
                expect(oscillator.param('gain')).toEqual(1);
            });

            it('should return 0', () => {
                oscillator.param('gain', 0);
                expect(oscillator.param('gain')).toEqual(0);
            });

            // Negative
            it('should return 1', () => {
                oscillator.param('gain', 1.1);
                expect(oscillator.param('gain')).toEqual(1);
            });

            it('should return 1', () => {
                oscillator.param('gain', -0.1);
                expect(oscillator.param('gain')).toEqual(1);
            });
        });

        describe('octave', () => {
            afterEach(() => {
                oscillator.param('octave', 0);
            });

            // Getter
            // Positive
            it('should return 0', () => {
                expect(oscillator.param('octave')).toEqual(0);
            });

            // Negative
            it('should return the instance of `Oscillator`', () => {
                expect(oscillator.param('')).toEqual(jasmine.any(Oscillator));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                oscillator.param('octave', 0.5);
                expect(oscillator.param('octave')).toEqual(0.5);
            });

            it('should return 4', () => {
                oscillator.param('octave', 4);
                expect(oscillator.param('octave')).toEqual(4);
            });

            it('should return -4', () => {
                oscillator.param('octave', -4);
                expect(oscillator.param('octave')).toEqual(-4);
            });

            // Negative
            it('should return 0', () => {
                oscillator.param('octave', 4.1);
                expect(oscillator.param('octave')).toEqual(0);
            });

            it('should return 0', () => {
                oscillator.param('octave', -4.1);
                expect(oscillator.param('octave')).toEqual(0);
            });
        });

        describe('fine', () => {
            afterEach(() => {
                oscillator.param('fine', 0);
            });

            // Getter
            // Positive
            it('should return 0', () => {
                expect(oscillator.param('fine')).toEqual(0);
            });

            // Negative
            it('should return the instance of `Oscillator`', () => {
                expect(oscillator.param('')).toEqual(jasmine.any(Oscillator));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                oscillator.param('fine', 0.5);
                expect(oscillator.param('fine')).toEqual(0.5);
            });

            it('should return 1200', () => {
                oscillator.param('fine', 1200);
                expect(oscillator.param('fine')).toEqual(1200);
            });

            it('should return -1200', () => {
                oscillator.param('fine', -1200);
                expect(oscillator.param('fine')).toEqual(-1200);
            });

            // Negative
            it('should return 0', () => {
                oscillator.param('fine', 1200.1);
                expect(oscillator.param('fine')).toEqual(0);
            });

            it('should return 0', () => {
                oscillator.param('fine', -1200.1);
                expect(oscillator.param('fine')).toEqual(0);
            });
        });
    });
});
