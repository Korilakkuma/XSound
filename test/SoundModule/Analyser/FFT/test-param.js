'use strict';

import { FFT } from '../../../../src/SoundModule/Analyser/FFT';

describe('FFT TEST', () => {
    describe('FFT#param', () => {
        const fft = new FFT(audiocontext.sampleRate);

        describe('type', () => {
            afterEach(() => {
                fft.param('type', 'uint');
            });

            // Getter
            // Positive
            it('should return "uint"', () => {
                expect(fft.param('type')).toEqual('uint');
            });

            // Negative
            it('should return the instance of `FFT`', () => {
                expect(fft.param('')).toEqual(jasmine.any(FFT));
            });

            // Setter
            // Positive
            it('should return "uint"', () => {
                fft.param('type', 'uint');
                expect(fft.param('type')).toEqual('uint');
            });

            it('should return "float"', () => {
                fft.param('type', 'float');
                expect(fft.param('type')).toEqual('float');
            });

            // Negative
            it('should return "uint"', () => {
                fft.param('type', 'double');
                expect(fft.param('type')).toEqual('uint');
            });
        });

        describe('size', () => {
            afterEach(() => {
                fft.param('size', 256);
            });

            // Getter
            // Positive
            it('should return 256', () => {
                expect(fft.param('size')).toEqual(256);
            });

            // Negative
            it('should return the instance of `FFT`', () => {
                expect(fft.param('')).toEqual(jasmine.any(FFT));
            });

            // Setter
            // Positive
            it('should return 1024', () => {
                fft.param('size', 1024);
                expect(fft.param('size')).toEqual(1024);
            });

            // Negative
            it('should return 256', () => {
                fft.param('size', 1025);
                expect(fft.param('size')).toEqual(256);
            });

            it('should return 256', () => {
                fft.param('size', 0);
                expect(fft.param('size')).toEqual(256);
            });
        });

        describe('textInterval', () => {
            afterEach(() => {
                fft.param('textInterval', 1000);
            });

            // Getter
            // Positive
            it('should return 0.005', () => {
                expect(fft.param('textInterval')).toEqual(1000);
            });

            // Negative
            it('should return the instance of `FFT`', () => {
                expect(fft.param('')).toEqual(jasmine.any(FFT));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                fft.param('textInterval', 0.5);
                expect(fft.param('textInterval')).toEqual(0.5);
            });

            // Negative
            it('should return 1000', () => {
                fft.param('textInterval', 0);
                expect(fft.param('textInterval')).toEqual(1000);
            });
        });
    });
});
