'use strict';

import Analyser from '../../../src/SoundModule/Analyser';

describe('Analyser TEST', () => {
    describe('Analyser#param', () => {
        const analyser = new Analyser(audiocontext);

        describe('fftSize', () => {
            afterEach(() => {
                analyser.param('fftSize', 2048);
            });

            // Getter
            // Positive
            it('should return 2048', () => {
                expect(analyser.param('fftSize')).toEqual(2048);
            });

            // Negative
            it('should return the instance of `Analyser`', () => {
                expect(analyser.param('')).toEqual(jasmine.any(Analyser));
            });

            // Setter
            // Positive
            it('should return 32', () => {
                analyser.param('fftSize', 32);
                expect(analyser.param('fftSize')).toEqual(32);
            });

            it('should return 64', () => {
                analyser.param('fftSize', 64);
                expect(analyser.param('fftSize')).toEqual(64);
            });

            it('should return 128', () => {
                analyser.param('fftSize', 128);
                expect(analyser.param('fftSize')).toEqual(128);
            });

            it('should return 256', () => {
                analyser.param('fftSize', 256);
                expect(analyser.param('fftSize')).toEqual(256);
            });

            it('should return 512', () => {
                analyser.param('fftSize', 512);
                expect(analyser.param('fftSize')).toEqual(512);
            });

            it('should return 1024', () => {
                analyser.param('fftSize', 1024);
                expect(analyser.param('fftSize')).toEqual(1024);
            });

            it('should return 2048', () => {
                analyser.param('fftSize', 2048);
                expect(analyser.param('fftSize')).toEqual(2048);
            });

            // Negative
            it('should return 2048', () => {
                analyser.param('fftSize', 4096);
                expect(analyser.param('fftSize')).toEqual(2048);
            });
        });

        describe('frequencyBinCount', () => {
            it('should return 1024', () => {
                expect(analyser.param('frequencyBinCount')).toEqual(1024);
            });
        });

        describe('minDecibels', () => {
            afterEach(() => {
                analyser.param('minDecibels', -100);
            });

            // Getter
            // Positive
            it('should return -100', () => {
                expect(analyser.param('minDecibels')).toEqual(-100);
            });

            // Negative
            it('should return the instance of `Analyser`', () => {
                expect(analyser.param('')).toEqual(jasmine.any(Analyser));
            });

            // Setter
            // Positive
            it('should return -30.5', () => {
                analyser.param('minDecibels', -30.5);
                expect(analyser.param('minDecibels')).toEqual(-30.5);
            });

            // Negative
            it('should return -100', () => {
                analyser.param('minDecibels', -30);
                expect(analyser.param('minDecibels')).toEqual(-100);
            });
        });

        describe('maxDecibels', () => {
            afterEach(() => {
                analyser.param('maxDecibels', -30);
            });

            // Getter
            // Positive
            it('should return -30', () => {
                expect(analyser.param('maxDecibels')).toEqual(-30);
            });

            // Negative
            it('should return the instance of `Analyser`', () => {
                expect(analyser.param('')).toEqual(jasmine.any(Analyser));
            });

            // Setter
            // Positive
            it('should return -99.5', () => {
                analyser.param('maxDecibels', -99.5);
                expect(analyser.param('maxDecibels')).toEqual(-99.5);
            });

            // Negative
            it('should return -30', () => {
                analyser.param('maxDecibels', -100);
                expect(analyser.param('maxDecibels')).toEqual(-30);
            });
        });

        describe('smoothingTimeConstant', () => {
            afterEach(() => {
                analyser.param('smoothingTimeConstant', 0.8);
            });

            // Getter
            // Positive
            it('should return 0.8', () => {
                expect(analyser.param('smoothingTimeConstant')).toEqual(0.8);
            });

            // Negative
            it('should return the instance of `Analyser`', () => {
                expect(analyser.param('')).toEqual(jasmine.any(Analyser));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                analyser.param('smoothingTimeConstant', 0.5);
                expect(analyser.param('smoothingTimeConstant')).toEqual(0.5);
            });

            it('should return 1', () => {
                analyser.param('smoothingTimeConstant', 1);
                expect(analyser.param('smoothingTimeConstant')).toEqual(1);
            });

            it('should return 0', () => {
                analyser.param('smoothingTimeConstant', 0);
                expect(analyser.param('smoothingTimeConstant')).toEqual(0);
            });

            // Negative
            it('should return 0.8', () => {
                analyser.param('smoothingTimeConstant', 1.1);
                expect(analyser.param('smoothingTimeConstant')).toEqual(0.8);
            });

            it('should return 0.8', () => {
                analyser.param('smoothingTimeConstant', -0.1);
                expect(analyser.param('smoothingTimeConstant')).toEqual(0.8);
            });
        });
    });
});
