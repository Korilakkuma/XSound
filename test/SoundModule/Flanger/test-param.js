'use strict';

import { Flanger } from '../../../src/SoundModule/Flanger';

describe('Flanger TEST', () => {
    describe('Flanger#param', () => {
        const flanger = new Flanger(audiocontext, 1024);

        describe('time', () => {
            afterEach(() => {
                flanger.param('time', 0);
            });

            // Getter
            // Positive
            it('should return 0', () => {
                expect(flanger.param('time')).toEqual(0);
            });

            // Negative
            it('should return the instance of `Flanger`', () => {
                expect(flanger.param('')).toEqual(jasmine.any(Flanger));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                flanger.param('time', 0.5);
                expect(flanger.param('time')).toEqual(0.5);
            });

            it('should return 1', () => {
                flanger.param('time', 1);
                expect(flanger.param('time')).toEqual(1);
            });

            it('should return 0', () => {
                flanger.param('time', 0);
                expect(flanger.param('time')).toEqual(0);
            });

            // Negative
            it('should return 0', () => {
                flanger.param('time', 1.1);
                expect(flanger.param('time')).toEqual(0);
            });

            it('should return 0', () => {
                flanger.param('time', -0.1);
                expect(flanger.param('time')).toEqual(0);
            });
        });

        describe('depth', () => {
            afterEach(() => {
                flanger.param('depth', 0);
            });

            // Getter
            // Positive
            it('should return 0', () => {
                expect(flanger.param('depth')).toEqual(0);
            });

            // Negative
            it('should return the instance of `Flanger`', () => {
                expect(flanger.param('')).toEqual(jasmine.any(Flanger));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                flanger.param('depth', 0.5);
                expect(flanger.param('depth')).toEqual(0.5);
            });

            it('should return 1', () => {
                flanger.param('depth', 1);
                expect(flanger.param('depth')).toEqual(1);
            });

            it('should return 0', () => {
                flanger.param('depth', 0);
                expect(flanger.param('depth')).toEqual(0);
            });

            // Negative
            it('should return 0', () => {
                flanger.param('depth', 1.1);
                expect(flanger.param('depth')).toEqual(0);
            });

            it('should return 0', () => {
                flanger.param('depth', -0.1);
                expect(flanger.param('depth')).toEqual(0);
            });
        });

        describe('rate', () => {
            afterEach(() => {
                flanger.param('rate', 0);
            });

            // Getter
            // Positive
            it('should return 0', () => {
                expect(flanger.param('rate')).toEqual(0);
            });

            // Negative
            it('should return the instance of `Flanger`', () => {
                expect(flanger.param('')).toEqual(jasmine.any(Flanger));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                flanger.param('rate', 0.5);
                expect(flanger.param('rate')).toEqual(0.5);
            });

            it('should return the Nyquist frequency (half the sample-rate)', () => {
                flanger.param('rate', (audiocontext.sampleRate / 2));
                expect(flanger.param('rate')).toEqual(audiocontext.sampleRate / 2);
            });

            it('should return 0', () => {
                flanger.param('rate', 0);
                expect(flanger.param('rate')).toEqual(0);
            });

            // Negative
            it('should return 0', () => {
                flanger.param('rate', ((audiocontext.sampleRate / 2) + 0.1));
                expect(flanger.param('rate')).toEqual(0);
            });

            it('should return 0', () => {
                flanger.param('rate', -0.1);
                expect(flanger.param('rate')).toEqual(0);
            });
        });

        describe('mix', () => {
            afterEach(() => {
                flanger.param('mix', 0);
            });

            // Getter
            // Positive
            it('should return 0', () => {
                expect(flanger.param('mix')).toEqual(0);
            });

            // Negative
            it('should return the instance of `Flanger`', () => {
                expect(flanger.param('')).toEqual(jasmine.any(Flanger));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                flanger.param('mix', 0.5);
                expect(flanger.param('mix')).toEqual(0.5);
            });

            it('should return 1', () => {
                flanger.param('mix', 1);
                expect(flanger.param('mix')).toEqual(1);
            });

            it('should return 0', () => {
                flanger.param('mix', 0);
                expect(flanger.param('mix')).toEqual(0);
            });

            // Negative
            it('should return 0', () => {
                flanger.param('mix', 1.1);
                expect(flanger.param('mix')).toEqual(0);
            });

            it('should return 0', () => {
                flanger.param('mix', -0.1);
                expect(flanger.param('mix')).toEqual(0);
            });
        });

        describe('tone', () => {
            afterEach(() => {
                flanger.param('tone', 350);
            });

            // Getter
            // Positive
            it('should return 350', () => {
                expect(flanger.param('tone')).toEqual(350);
            });

            // Negative
            it('should return the instance of `Flanger`', () => {
                expect(flanger.param('')).toEqual(jasmine.any(Flanger));
            });

            // Setter
            // Positive
            it('should return 350.5', () => {
                flanger.param('tone', 350.5);
                expect(flanger.param('tone')).toEqual(350.5);
            });

            it('should return the Nyquist tone (half the sample-rate)', () => {
                flanger.param('tone', (audiocontext.sampleRate / 2));
                expect(flanger.param('tone')).toEqual(audiocontext.sampleRate / 2);
            });

            it('should return 10', () => {
                flanger.param('tone', 10);
                expect(flanger.param('tone')).toEqual(10);
            });

            // Negative
            it('should return 350', () => {
                flanger.param('tone', ((audiocontext.sampleRate / 2) + 0.1));
                expect(flanger.param('tone')).toEqual(350);
            });

            it('should return 350', () => {
                flanger.param('tone', 9.9);
                expect(flanger.param('tone')).toEqual(350);
            });
        });

        describe('feedback', () => {
            afterEach(() => {
                flanger.param('feedback', 0);
            });

            // Getter
            // Positive
            it('should return 0', () => {
                expect(flanger.param('feedback')).toEqual(0);
            });

            // Negative
            it('should return the instance of `Flanger`', () => {
                expect(flanger.param('')).toEqual(jasmine.any(Flanger));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                flanger.param('feedback', 0.5);
                expect(flanger.param('feedback')).toEqual(0.5);
            });

            it('should return 1', () => {
                flanger.param('feedback', 1);
                expect(flanger.param('feedback')).toEqual(1);
            });

            it('should return 0', () => {
                flanger.param('feedback', 0);
                expect(flanger.param('feedback')).toEqual(0);
            });

            // Negative
            it('should return 0', () => {
                flanger.param('feedback', 1.1);
                expect(flanger.param('feedback')).toEqual(0);
            });

            it('should return 0', () => {
                flanger.param('feedback', -0.1);
                expect(flanger.param('feedback')).toEqual(0);
            });
        });
    });
});
