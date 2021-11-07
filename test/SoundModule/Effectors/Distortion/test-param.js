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
                expect(distortion.param('curve')).toEqual(jasmine.any(Float32Array));
            });

            // Negative
            it('should return the instance of `Distortion`', () => {
                expect(distortion.param('')).toEqual(jasmine.any(Distortion));
            });

            // Setter
            it('should return null', () => {
                distortion.param('curve', 'clean');
                expect(distortion.param('curve')).toEqual(jasmine.any(Float32Array));
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

        describe('samples', () => {
            afterEach(() => {
                distortion.param('samples', 256);
            });

            // Getter
            // Positive
            it('should return 256', () => {
                expect(distortion.param('samples')).toEqual(256);
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
            it('should return 256', () => {
                distortion.param('samples', -1);
                expect(distortion.param('samples')).toEqual(256);
            });
        });

        describe('gain', () => {
            afterEach(() => {
                distortion.param('gain', 0.5);
            });

            // Getter
            // Positive
            it('should return 0.5', () => {
                expect(distortion.param('gain')).toEqual(0.5);
            });

            // Negative
            it('should return the instance of `Distortion`', () => {
                expect(distortion.param('')).toEqual(jasmine.any(Distortion));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                distortion.param('gain', 0.5);
                expect(distortion.param('gain')).toEqual(0.5);
            });

            it('should return 1', () => {
                distortion.param('gain', 1);
                expect(distortion.param('gain')).toEqual(1);
            });

            it('should return 0', () => {
                distortion.param('gain', 0);
                expect(distortion.param('gain')).toEqual(0);
            });

            // Negative
            it('should return 1', () => {
                distortion.param('gain', 1.1);
                expect(distortion.param('gain')).toEqual(0.5);
            });

            it('should return 1', () => {
                distortion.param('gain', -0.1);
                expect(distortion.param('gain')).toEqual(0.5);
            });
        });

        describe('lead', () => {
            afterEach(() => {
                distortion.param('lead', 0.5);
            });

            // Getter
            // Positive
            it('should return 0.5', () => {
                expect(distortion.param('lead')).toEqual(0.5);
            });

            // Negative
            it('should return the instance of `Distortion`', () => {
                expect(distortion.param('')).toEqual(jasmine.any(Distortion));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                distortion.param('lead', 0.5);
                expect(distortion.param('lead')).toEqual(0.5);
            });

            it('should return 1', () => {
                distortion.param('lead', 1);
                expect(distortion.param('lead')).toEqual(1);
            });

            it('should return 0', () => {
                distortion.param('lead', 0);
                expect(distortion.param('lead')).toEqual(0);
            });

            // Negative
            it('should return 1', () => {
                distortion.param('lead', 1.1);
                expect(distortion.param('lead')).toEqual(0.5);
            });

            it('should return 1', () => {
                distortion.param('lead', -0.1);
                expect(distortion.param('lead')).toEqual(0.5);
            });
        });

        describe('bass', () => {
            afterEach(() => {
                distortion.param('bass', 0);
            });

            // Getter
            // Positive
            it('should return 0', () => {
                expect(distortion.param('bass')).toEqual(0);
            });

            // Negative
            it('should return the instance of `Distortion`', () => {
                expect(distortion.param('')).toEqual(jasmine.any(Distortion));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                distortion.param('bass', 0.5);
                expect(distortion.param('bass')).toEqual(0.5);
            });

            it('should return 40', () => {
                distortion.param('bass', 40);
                expect(distortion.param('bass')).toEqual(40);
            });

            it('should return -40', () => {
                distortion.param('bass', -40);
                expect(distortion.param('bass')).toEqual(-40);
            });

            // Negative
            it('should return 0', () => {
                distortion.param('bass', 40.1);
                expect(distortion.param('bass')).toEqual(0);
            });

            it('should return 0', () => {
                distortion.param('bass', -40.1);
                expect(distortion.param('bass')).toEqual(0);
            });
        });

        describe('middle', () => {
            afterEach(() => {
                distortion.param('middle', 0);
            });

            // Getter
            // Positive
            it('should return 0', () => {
                expect(distortion.param('middle')).toEqual(0);
            });

            // Negative
            it('should return the instance of `Distortion`', () => {
                expect(distortion.param('')).toEqual(jasmine.any(Distortion));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                distortion.param('middle', 0.5);
                expect(distortion.param('middle')).toEqual(0.5);
            });

            it('should return 40', () => {
                distortion.param('middle', 40);
                expect(distortion.param('middle')).toEqual(40);
            });

            it('should return -40', () => {
                distortion.param('middle', -40);
                expect(distortion.param('middle')).toEqual(-40);
            });

            // Negative
            it('should return 0', () => {
                distortion.param('middle', 40.1);
                expect(distortion.param('middle')).toEqual(0);
            });

            it('should return 0', () => {
                distortion.param('middle', -40.1);
                expect(distortion.param('middle')).toEqual(0);
            });
        });

        describe('treble', () => {
            afterEach(() => {
                distortion.param('treble', 0);
            });

            // Getter
            // Positive
            it('should return 0', () => {
                expect(distortion.param('treble')).toEqual(0);
            });

            // Negative
            it('should return the instance of `Distortion`', () => {
                expect(distortion.param('')).toEqual(jasmine.any(Distortion));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                distortion.param('treble', 0.5);
                expect(distortion.param('treble')).toEqual(0.5);
            });

            it('should return 40', () => {
                distortion.param('treble', 40);
                expect(distortion.param('treble')).toEqual(40);
            });

            it('should return -40', () => {
                distortion.param('treble', -40);
                expect(distortion.param('treble')).toEqual(-40);
            });

            // Negative
            it('should return 0', () => {
                distortion.param('treble', 40.1);
                expect(distortion.param('treble')).toEqual(0);
            });

            it('should return 0', () => {
                distortion.param('treble', -40.1);
                expect(distortion.param('treble')).toEqual(0);
            });
        });

        describe('frequency', () => {
            afterEach(() => {
                distortion.param('frequency', 500);
            });

            // Getter
            // Positive
            it('should return 500', () => {
                expect(distortion.param('frequency')).toEqual(500);
            });

            // Negative
            it('should return the instance of `Distortion`', () => {
                expect(distortion.param('')).toEqual(jasmine.any(Distortion));
            });

            // Setter
            // Positive
            it('should return 500.5', () => {
                distortion.param('frequency', 500.5);
                expect(distortion.param('frequency')).toEqual(500.5);
            });

            it('should return the Nyquist frequency (half the sample-rate)', () => {
                distortion.param('frequency', (audiocontext.sampleRate / 2));
                expect(distortion.param('frequency')).toEqual(audiocontext.sampleRate / 2);
            });

            it('should return 10', () => {
                distortion.param('frequency', 10);
                expect(distortion.param('frequency')).toEqual(10);
            });

            // Negative
            it('should return 500', () => {
                distortion.param('frequency', ((audiocontext.sampleRate / 2) + 0.1));
                expect(distortion.param('frequency')).toEqual(500);
            });

            it('should return 500', () => {
                distortion.param('frequency', 9.9);
                expect(distortion.param('frequency')).toEqual(500);
            });
        });

        describe('cabinet', () => {
            afterEach(() => {
                distortion.param('cabinet', false);
            });

            // Getter
            // Positive
            it('should return `false`', () => {
                expect(distortion.param('cabinet')).toBeFalsy();
            });

            // Negative
            it('should return the instance of `Distortion`', () => {
                expect(distortion.param('')).toEqual(jasmine.any(Distortion));
            });

            // Setter
            it('should return `true`', () => {
                distortion.param('cabinet', true);
                expect(distortion.param('cabinet')).toBeTruthy();
            });
        });
    });
});
