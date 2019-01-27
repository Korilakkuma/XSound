'use strict';

import { Delay } from '../../../../src/SoundModule/Effectors/Delay';

describe('Delay TEST', () => {
    describe('Delay#param', () => {
        const delay = new Delay(audiocontext, 1024);

        describe('time', () => {
            afterEach(() => {
                delay.param('time', 0);
            });

            // Getter
            // Positive
            it('should return 0', () => {
                expect(delay.param('time')).toEqual(0);
            });

            // Negative
            it('should return the instance of `Delay`', () => {
                expect(delay.param('')).toEqual(jasmine.any(Delay));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                delay.param('time', 0.5);
                expect(delay.param('time')).toEqual(0.5);
            });

            it('should return 5', () => {
                delay.param('time', 5);
                expect(delay.param('time')).toEqual(5);
            });

            it('should return 0', () => {
                delay.param('time', 0);
                expect(delay.param('time')).toEqual(0);
            });

            // Negative
            it('should return 0', () => {
                delay.param('time', 5.1);
                expect(delay.param('time')).toEqual(0);
            });

            it('should return 0', () => {
                delay.param('time', -0.1);
                expect(delay.param('time')).toEqual(0);
            });
        });

        describe('dry', () => {
            afterEach(() => {
                delay.param('dry', 1);
            });

            // Getter
            // Positive
            it('should return 1', () => {
                expect(delay.param('dry')).toEqual(1);
            });

            // Negative
            it('should return the instance of `Delay`', () => {
                expect(delay.param('')).toEqual(jasmine.any(Delay));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                delay.param('dry', 0.5);
                expect(delay.param('dry')).toEqual(0.5);
            });

            it('should return 1', () => {
                delay.param('dry', 1);
                expect(delay.param('dry')).toEqual(1);
            });

            it('should return 0', () => {
                delay.param('dry', 0);
                expect(delay.param('dry')).toEqual(0);
            });

            // Negative
            it('should return 1', () => {
                delay.param('dry', 1.1);
                expect(delay.param('dry')).toEqual(1);
            });

            it('should return 1', () => {
                delay.param('dry', -0.1);
                expect(delay.param('dry')).toEqual(1);
            });
        });

        describe('wet', () => {
            afterEach(() => {
                delay.param('wet', 0);
            });

            // Getter
            // Positive
            it('should return 0', () => {
                expect(delay.param('wet')).toEqual(0);
            });

            // Negative
            it('should return the instance of `Delay`', () => {
                expect(delay.param('')).toEqual(jasmine.any(Delay));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                delay.param('wet', 0.5);
                expect(delay.param('wet')).toEqual(0.5);
            });

            it('should return 1', () => {
                delay.param('wet', 1);
                expect(delay.param('wet')).toEqual(1);
            });

            it('should return 0', () => {
                delay.param('wet', 0);
                expect(delay.param('wet')).toEqual(0);
            });

            // Negative
            it('should return 0', () => {
                delay.param('wet', 1.1);
                expect(delay.param('wet')).toEqual(0);
            });

            it('should return 0', () => {
                delay.param('wet', -0.1);
                expect(delay.param('wet')).toEqual(0);
            });
        });

        describe('tone', () => {
            afterEach(() => {
                delay.param('tone', 350);
            });

            // Getter
            // Positive
            it('should return 350', () => {
                expect(delay.param('tone')).toEqual(350);
            });

            // Negative
            it('should return the instance of `Delay`', () => {
                expect(delay.param('')).toEqual(jasmine.any(Delay));
            });

            // Setter
            // Positive
            it('should return 350.5', () => {
                delay.param('tone', 350.5);
                expect(delay.param('tone')).toEqual(350.5);
            });

            it('should return the Nyquist tone (half the sample-rate)', () => {
                delay.param('tone', (audiocontext.sampleRate / 2));
                expect(delay.param('tone')).toEqual(audiocontext.sampleRate / 2);
            });

            it('should return 10', () => {
                delay.param('tone', 10);
                expect(delay.param('tone')).toEqual(10);
            });

            // Negative
            it('should return 350', () => {
                delay.param('tone', ((audiocontext.sampleRate / 2) + 0.1));
                expect(delay.param('tone')).toEqual(350);
            });

            it('should return 350', () => {
                delay.param('tone', 9.9);
                expect(delay.param('tone')).toEqual(350);
            });
        });

        describe('feedback', () => {
            afterEach(() => {
                delay.param('feedback', 0);
            });

            // Getter
            // Positive
            it('should return 0', () => {
                expect(delay.param('feedback')).toEqual(0);
            });

            // Negative
            it('should return the instance of `Delay`', () => {
                expect(delay.param('')).toEqual(jasmine.any(Delay));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                delay.param('feedback', 0.5);
                expect(delay.param('feedback')).toEqual(0.5);
            });

            it('should return 1', () => {
                delay.param('feedback', 1);
                expect(delay.param('feedback')).toEqual(1);
            });

            it('should return 0', () => {
                delay.param('feedback', 0);
                expect(delay.param('feedback')).toEqual(0);
            });

            // Negative
            it('should return 0', () => {
                delay.param('feedback', 1.1);
                expect(delay.param('feedback')).toEqual(0);
            });

            it('should return 0', () => {
                delay.param('feedback', -0.1);
                expect(delay.param('feedback')).toEqual(0);
            });
        });
    });
});
