'use strict';

import { Autopanner } from '../../../src/SoundModule/Autopanner';

describe('Autopanner TEST', () => {
    describe('Autopanner#param', () => {
        const autopanner = new Autopanner(audiocontext, 1024);

        describe('depth', () => {
            afterEach(() => {
                autopanner.param('depth', 0);
            });

            // Getter
            // Positive
            it('should return 0', () => {
                expect(autopanner.param('depth')).toEqual(0);
            });

            // Negative
            it('should return the instance of `Autopanner`', () => {
                expect(autopanner.param('')).toEqual(jasmine.any(Autopanner));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                autopanner.param('depth', 0.5);
                expect(autopanner.param('depth')).toEqual(0.5);
            });

            it('should return 1', () => {
                autopanner.param('depth', 1);
                expect(autopanner.param('depth')).toEqual(1);
            });

            it('should return 0', () => {
                autopanner.param('depth', 0);
                expect(autopanner.param('depth')).toEqual(0);
            });

            // Negative
            it('should return 0', () => {
                autopanner.param('depth', 1.1);
                expect(autopanner.param('depth')).toEqual(0);
            });

            it('should return 0', () => {
                autopanner.param('depth', -0.1);
                expect(autopanner.param('depth')).toEqual(0);
            });
        });

        describe('rate', () => {
            afterEach(() => {
                autopanner.param('rate', 0);
            });

            // Getter
            // Positive
            it('should return 0', () => {
                expect(autopanner.param('rate')).toEqual(0);
            });

            // Negative
            it('should return the instance of `Autopanner`', () => {
                expect(autopanner.param('')).toEqual(jasmine.any(Autopanner));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                autopanner.param('rate', 0.5);
                expect(autopanner.param('rate')).toEqual(0.5);
            });

            it('should return the Nyquist frequency (half the sample-rate)', () => {
                autopanner.param('rate', (audiocontext.sampleRate / 2));
                expect(autopanner.param('rate')).toEqual(audiocontext.sampleRate / 2);
            });

            it('should return 0', () => {
                autopanner.param('rate', 0);
                expect(autopanner.param('rate')).toEqual(0);
            });

            // Negative
            it('should return 0', () => {
                autopanner.param('rate', ((audiocontext.sampleRate / 2) + 0.1));
                expect(autopanner.param('rate')).toEqual(0);
            });

            it('should return 0', () => {
                autopanner.param('rate', -0.1);
                expect(autopanner.param('rate')).toEqual(0);
            });
        });
    });
});
