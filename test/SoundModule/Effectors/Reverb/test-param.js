'use strict';

import { Reverb } from '../../../../src/SoundModule/Effectors/Reverb';

describe('Reverb TEST', () => {
    describe('Reverb#param', () => {
        const reverb = new Reverb(audiocontext, 1024);

        describe('dry', () => {
            afterEach(() => {
                reverb.param('dry', 1);
            });

            // Getter
            // Positive
            it('should return 1', () => {
                expect(reverb.param('dry')).toEqual(1);
            });

            // Negative
            it('should return the instance of `Reverb`', () => {
                expect(reverb.param('')).toEqual(jasmine.any(Reverb));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                reverb.param('dry', 0.5);
                expect(reverb.param('dry')).toEqual(0.5);
            });

            it('should return 1', () => {
                reverb.param('dry', 1);
                expect(reverb.param('dry')).toEqual(1);
            });

            it('should return 0', () => {
                reverb.param('dry', 0);
                expect(reverb.param('dry')).toEqual(0);
            });

            // Negative
            it('should return 1', () => {
                reverb.param('dry', 1.1);
                expect(reverb.param('dry')).toEqual(1);
            });

            it('should return 1', () => {
                reverb.param('dry', -0.1);
                expect(reverb.param('dry')).toEqual(1);
            });
        });

        describe('wet', () => {
            afterEach(() => {
                reverb.param('wet', 0);
            });

            // Getter
            // Positive
            it('should return 0', () => {
                expect(reverb.param('wet')).toEqual(0);
            });

            // Negative
            it('should return the instance of `Reverb`', () => {
                expect(reverb.param('')).toEqual(jasmine.any(Reverb));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                reverb.param('wet', 0.5);
                expect(reverb.param('wet')).toEqual(0.5);
            });

            it('should return 1', () => {
                reverb.param('wet', 1);
                expect(reverb.param('wet')).toEqual(1);
            });

            it('should return 0', () => {
                reverb.param('wet', 0);
                expect(reverb.param('wet')).toEqual(0);
            });

            // Negative
            it('should return 0', () => {
                reverb.param('wet', 1.1);
                expect(reverb.param('wet')).toEqual(0);
            });

            it('should return 0', () => {
                reverb.param('wet', -0.1);
                expect(reverb.param('wet')).toEqual(0);
            });
        });

        describe('tone', () => {
            afterEach(() => {
                reverb.param('tone', 350);
            });

            // Getter
            // Positive
            it('should return 350', () => {
                expect(reverb.param('tone')).toEqual(350);
            });

            // Negative
            it('should return the instance of `Reverb`', () => {
                expect(reverb.param('')).toEqual(jasmine.any(Reverb));
            });

            // Setter
            // Positive
            it('should return 350.5', () => {
                reverb.param('tone', 350.5);
                expect(reverb.param('tone')).toEqual(350.5);
            });

            it('should return the Nyquist tone (half the sample-rate)', () => {
                reverb.param('tone', (audiocontext.sampleRate / 2));
                expect(reverb.param('tone')).toEqual(audiocontext.sampleRate / 2);
            });

            it('should return 10', () => {
                reverb.param('tone', 10);
                expect(reverb.param('tone')).toEqual(10);
            });

            // Negative
            it('should return 350', () => {
                reverb.param('tone', ((audiocontext.sampleRate / 2) + 0.1));
                expect(reverb.param('tone')).toEqual(350);
            });

            it('should return 350', () => {
                reverb.param('tone', 9.9);
                expect(reverb.param('tone')).toEqual(350);
            });
        });
    });
});
