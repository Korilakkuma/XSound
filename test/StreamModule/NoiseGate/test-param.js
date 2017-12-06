'use strict';

import NoiseGate from '../../../src/StreamModule/NoiseGate';

describe('NoiseGate TEST', () => {
    describe('NoiseGate#param', () => {
        const noisegate = new NoiseGate();

        describe('level', () => {
            afterEach(() => {
                noisegate.param('level', 0);
            });

            // Getter
            // Positive
            it('should return 0', () => {
                expect(noisegate.param('level')).toEqual(0);
            });

            // Negative
            it('should return the instance of `NoiseGate`', () => {
                expect(noisegate.param('')).toEqual(jasmine.any(NoiseGate));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                noisegate.param('level', 0.5);
                expect(noisegate.param('level')).toEqual(0.5);
            });

            it('should return 1', () => {
                noisegate.param('level', 1);
                expect(noisegate.param('level')).toEqual(1);
            });

            it('should return 0', () => {
                noisegate.param('level', 0);
                expect(noisegate.param('level')).toEqual(0);
            });

            // Negative
            it('should return 0', () => {
                noisegate.param('level', 1.1);
                expect(noisegate.param('level')).toEqual(0);
            });

            it('should return 0', () => {
                noisegate.param('level', -0.1);
                expect(noisegate.param('level')).toEqual(0);
            });
        });
    });
});
