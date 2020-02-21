'use strict';

import { NoiseSuppressor } from '../../../src/StreamModule/NoiseSuppressor';

describe('NoiseSuppressor TEST', () => {
    describe('NoiseSuppressor#param', () => {
        const noisesuppressor = new NoiseSuppressor();

        describe('threshold', () => {
            afterEach(() => {
                noisesuppressor.param('threshold', 0);
            });

            // Getter
            // Positive
            it('should return 0', () => {
                expect(noisesuppressor.param('threshold')).toEqual(0);
            });

            // Negative
            it('should return the instance of `NoiseSuppressor`', () => {
                expect(noisesuppressor.param('')).toEqual(jasmine.any(NoiseSuppressor));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                noisesuppressor.param('threshold', 0.5);
                expect(noisesuppressor.param('threshold')).toEqual(0.5);
            });

            it('should return 1', () => {
                noisesuppressor.param('threshold', 1);
                expect(noisesuppressor.param('threshold')).toEqual(1);
            });

            it('should return 0', () => {
                noisesuppressor.param('threshold', 0);
                expect(noisesuppressor.param('threshold')).toEqual(0);
            });

            // Negative
            it('should return 0', () => {
                noisesuppressor.param('threshold', 1.1);
                expect(noisesuppressor.param('threshold')).toEqual(0);
            });

            it('should return 0', () => {
                noisesuppressor.param('threshold', -0.1);
                expect(noisesuppressor.param('threshold')).toEqual(0);
            });
        });
    });
});
