'use strict';

import { VocalCanceler } from '../../../src/AudioModule/VocalCanceler';

describe('VocalCanceler TEST', () => {
    describe('VocalCanceler#param', () => {
        const vocalcanceler = new VocalCanceler();

        describe('depth', () => {
            afterEach(() => {
                vocalcanceler.param('depth', 0);
            });

            // Getter
            // Positive
            it('should return 0', () => {
                expect(vocalcanceler.param('depth')).toEqual(0);
            });

            // Negative
            it('should return the instance of `VocalCanceler`', () => {
                expect(vocalcanceler.param('')).toEqual(jasmine.any(VocalCanceler));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                vocalcanceler.param('depth', 0.5);
                expect(vocalcanceler.param('depth')).toEqual(0.5);
            });

            it('should return 1', () => {
                vocalcanceler.param('depth', 1);
                expect(vocalcanceler.param('depth')).toEqual(1);
            });

            it('should return 0', () => {
                vocalcanceler.param('depth', 0);
                expect(vocalcanceler.param('depth')).toEqual(0);
            });

            // Negative
            it('should return 0', () => {
                vocalcanceler.param('depth', 1.1);
                expect(vocalcanceler.param('depth')).toEqual(0);
            });

            it('should return 0', () => {
                vocalcanceler.param('depth', -0.1);
                expect(vocalcanceler.param('depth')).toEqual(0);
            });
        });
    });
});
