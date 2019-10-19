'use strict';

import { Distortion } from '../../../../src/SoundModule/Effectors/Distortion';

describe('Distortion TEST', () => {
    describe('Distortion#param', () => {
        const distortion = new Distortion(audiocontext, 1024);

        describe('curve', () => {
            afterEach(() => {
                distortion.param('curve', 'clean');
            });

            // Getter
            // Positive
            it('should return null', () => {
                expect(distortion.param('curve')).toBeNull();
            });

            // Negative
            it('should return the instance of `Distortion`', () => {
                expect(distortion.param('')).toEqual(jasmine.any(Distortion));
            });

            // Setter
            it('should return null', () => {
                distortion.param('curve', 'clean');
                expect(distortion.param('curve')).toBeNull();
            });

            it('should return the instance of `Float32Array`', () => {
                distortion.param('curve', 'crunch');
                expect(distortion.param('curve')).toEqual(jasmine.any(Float32Array));
            });

            it('should return the instance of `Float32Array`', () => {
                distortion.param('curve', 'overdrive');
                expect(distortion.param('curve')).toEqual(jasmine.any(Float32Array));
            });

            it('should return the instance of `Float32Array`', () => {
                distortion.param('curve', 'distortion');
                expect(distortion.param('curve')).toEqual(jasmine.any(Float32Array));
            });

            it('should return the instance of `Float32Array`', () => {
                distortion.param('curve', 'fuzz');
                expect(distortion.param('curve')).toEqual(jasmine.any(Float32Array));
            });

            it('should return the instance of `Float32Array`', () => {
                distortion.param('curve', new Float32Array([1, 1.5, 2]));
                expect(distortion.param('curve')).toEqual(jasmine.any(Float32Array));
            });
        });

        describe('amount', () => {
            afterEach(() => {
                distortion.param('amount', 0.5);
            });

            // Getter
            // Positive
            it('should return 0.5', () => {
                expect(distortion.param('amount')).toEqual(0.5);
            });

            // Negative
            it('should return the instance of `Distortion`', () => {
                expect(distortion.param('')).toEqual(jasmine.any(Distortion));
            });

            // Setter
            // Positive
            it('should return 0.95', () => {
                distortion.param('amount', 0.95);
                expect(distortion.param('amount')).toEqual(0.95);
            });

            it('should return 0.05', () => {
                distortion.param('amount', 0.05);
                expect(distortion.param('amount')).toEqual(0.05);
            });

            // Negative
            it('should return 1', () => {
                distortion.param('amount', 1);
                expect(distortion.param('amount')).toEqual(0.5);
            });

            it('should return 0', () => {
                distortion.param('amount', 0);
                expect(distortion.param('amount')).toEqual(0.5);
            });
        });

        describe('samples', () => {
            afterEach(() => {
                distortion.param('samples', 4096);
            });

            // Getter
            // Positive
            it('should return 4096', () => {
                expect(distortion.param('samples')).toEqual(4096);
            });

            // Negative
            it('should return the instance of `Distortion`', () => {
                expect(distortion.param('')).toEqual(jasmine.any(Distortion));
            });

            // Setter
            // Positive
            it('should return 16384', () => {
                distortion.param('samples', 16384);
                expect(distortion.param('samples')).toEqual(16384);
            });

            it('should return 0', () => {
                distortion.param('samples', 0);
                expect(distortion.param('samples')).toEqual(0);
            });

            // Negative
            it('should return 4096', () => {
                distortion.param('samples', -1);
                expect(distortion.param('samples')).toEqual(4096);
            });
        });

        describe('drive', () => {
            afterEach(() => {
                distortion.param('drive', 1);
            });

            // Getter
            // Positive
            it('should return 1', () => {
                expect(distortion.param('drive')).toEqual(1);
            });

            // Negative
            it('should return the instance of `Distortion`', () => {
                expect(distortion.param('')).toEqual(jasmine.any(Distortion));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                distortion.param('drive', 0.5);
                expect(distortion.param('drive')).toEqual(0.5);
            });

            it('should return 100', () => {
                distortion.param('drive', 100);
                expect(distortion.param('drive')).toEqual(100);
            });

            it('should return 0', () => {
                distortion.param('drive', 0);
                expect(distortion.param('drive')).toEqual(0);
            });

            // Negative
            it('should return 100', () => {
                distortion.param('drive', 101);
                expect(distortion.param('drive')).toEqual(1);
            });

            it('should return 1', () => {
                distortion.param('drive', -0.1);
                expect(distortion.param('drive')).toEqual(1);
            });
        });

        describe('color', () => {
            afterEach(() => {
                distortion.param('color', 350);
            });

            // Getter
            // Positive
            it('should return 350', () => {
                expect(distortion.param('color')).toEqual(350);
            });

            // Negative
            it('should return the instance of `Distortion`', () => {
                expect(distortion.param('')).toEqual(jasmine.any(Distortion));
            });

            // Setter
            // Positive
            it('should return 350.5', () => {
                distortion.param('color', 350.5);
                expect(distortion.param('color')).toEqual(350.5);
            });

            it('should return the Nyquist frequency (half the sample-rate)', () => {
                distortion.param('color', (audiocontext.sampleRate / 2));
                expect(distortion.param('color')).toEqual(audiocontext.sampleRate / 2);
            });

            it('should return 10', () => {
                distortion.param('color', 10);
                expect(distortion.param('color')).toEqual(10);
            });

            // Negative
            it('should return 350', () => {
                distortion.param('color', ((audiocontext.sampleRate / 2) + 0.1));
                expect(distortion.param('color')).toEqual(350);
            });

            it('should return 350', () => {
                distortion.param('color', 9.9);
                expect(distortion.param('color')).toEqual(350);
            });
        });

        describe('tone', () => {
            afterEach(() => {
                distortion.param('tone', 350);
            });

            // Getter
            // Positive
            it('should return 350', () => {
                expect(distortion.param('tone')).toEqual(350);
            });

            // Negative
            it('should return the instance of `Distortion`', () => {
                expect(distortion.param('')).toEqual(jasmine.any(Distortion));
            });

            // Setter
            // Positive
            it('should return 350.5', () => {
                distortion.param('tone', 350.5);
                expect(distortion.param('tone')).toEqual(350.5);
            });

            it('should return the Nyquist frequency (half the sample-rate)', () => {
                distortion.param('tone', (audiocontext.sampleRate / 2));
                expect(distortion.param('tone')).toEqual(audiocontext.sampleRate / 2);
            });

            it('should return 10', () => {
                distortion.param('tone', 10);
                expect(distortion.param('tone')).toEqual(10);
            });

            // Negative
            it('should return 350', () => {
                distortion.param('tone', ((audiocontext.sampleRate / 2) + 0.1));
                expect(distortion.param('tone')).toEqual(350);
            });

            it('should return 350', () => {
                distortion.param('tone', 9.9);
                expect(distortion.param('tone')).toEqual(350);
            });
        });
    });
});
