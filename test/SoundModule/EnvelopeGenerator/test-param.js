'use strict';

import { EnvelopeGenerator } from '../../../src/SoundModule/EnvelopeGenerator';

describe('EnvelopeGenerator TEST', () => {
    describe('EnvelopeGenerator#param', () => {
        const envelopegenerator = new EnvelopeGenerator(audiocontext);

        describe('attack', () => {
            afterEach(() => {
                envelopegenerator.param('attack', 0.01);
            });

            // Getter
            // Positive
            it('should return 0.01', () => {
                expect(envelopegenerator.param('attack')).toEqual(0.01);
            });

            // Negative
            it('should return the instance of `EnvelopeGenerator`', () => {
                expect(envelopegenerator.param('')).toEqual(jasmine.any(EnvelopeGenerator));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                envelopegenerator.param('attack', 0.5);
                expect(envelopegenerator.param('attack')).toEqual(0.5);
            });

            it('should return 0', () => {
                envelopegenerator.param('attack', 0);
                expect(envelopegenerator.param('attack')).toEqual(0);
            });

            // Negative
            it('should return 0.01', () => {
                envelopegenerator.param('attack', -0.1);
                expect(envelopegenerator.param('attack')).toEqual(0.01);
            });
        });

        describe('decay', () => {
            afterEach(() => {
                envelopegenerator.param('decay', 0.3);
            });

            // Getter
            // Positive
            it('should return 0.3', () => {
                expect(envelopegenerator.param('decay')).toEqual(0.3);
            });

            // Negative
            it('should return the instance of `EnvelopeGenerator`', () => {
                expect(envelopegenerator.param('')).toEqual(jasmine.any(EnvelopeGenerator));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                envelopegenerator.param('decay', 0.5);
                expect(envelopegenerator.param('decay')).toEqual(0.5);
            });

            // Negative
            it('should return 0.3', () => {
                envelopegenerator.param('decay', 0);
                expect(envelopegenerator.param('decay')).toEqual(0.3);
            });
        });

        describe('sustain', () => {
            afterEach(() => {
                envelopegenerator.param('sustain', 0.5);
            });

            // Getter
            // Positive
            it('should return 0.5', () => {
                expect(envelopegenerator.param('sustain')).toEqual(0.5);
            });

            // Negative
            it('should return the instance of `EnvelopeGenerator`', () => {
                expect(envelopegenerator.param('')).toEqual(jasmine.any(EnvelopeGenerator));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                envelopegenerator.param('sustain', 0.5);
                expect(envelopegenerator.param('sustain')).toEqual(0.5);
            });

            it('should return 0', () => {
                envelopegenerator.param('sustain', 0);
                expect(envelopegenerator.param('sustain')).toEqual(0);
            });

            // Negative
            it('should return 0.5', () => {
                envelopegenerator.param('sustain', -0.1);
                expect(envelopegenerator.param('sustain')).toEqual(0.5);
            });
        });

        describe('release', () => {
            afterEach(() => {
                envelopegenerator.param('release', 1);
            });

            // Getter
            // Positive
            it('should return 1', () => {
                expect(envelopegenerator.param('release')).toEqual(1);
            });

            // Negative
            it('should return the instance of `EnvelopeGenerator`', () => {
                expect(envelopegenerator.param('')).toEqual(jasmine.any(EnvelopeGenerator));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                envelopegenerator.param('release', 0.5);
                expect(envelopegenerator.param('release')).toEqual(0.5);
            });

            // Negative
            it('should return 1', () => {
                envelopegenerator.param('release', 0);
                expect(envelopegenerator.param('release')).toEqual(1);
            });
        });
    });
});
