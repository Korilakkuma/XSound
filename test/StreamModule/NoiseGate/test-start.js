'use strict';

import { NoiseGate } from '../../../src/StreamModule/NoiseGate';

describe('NoiseGate TEST', () => {
    describe('NoiseGate#start', () => {
        const noisegate = new NoiseGate();

        it('should return 1', () => {
            noisegate.param('level', 0);
            expect(noisegate.start(1)).toEqual(1);
        });

        it('should return -1', () => {
            noisegate.param('level', 0);
            expect(noisegate.start(-1)).toEqual(-1);
        });

        it('should return 0', () => {
            noisegate.param('level', 1);
            expect(noisegate.start(1)).toEqual(0);
        });

        it('should return 0', () => {
            noisegate.param('level', 1);
            expect(noisegate.start(-1)).toEqual(0);
        });

        it('should return 0.55', () => {
            noisegate.param('level', 0.5);
            expect(noisegate.start(0.55)).toEqual(0.55);
        });

        it('should return -0.55', () => {
            noisegate.param('level', 0.5);
            expect(noisegate.start(-0.55)).toEqual(-0.55);
        });

        it('should return 0', () => {
            noisegate.param('level', 0.5);
            expect(noisegate.start(0.5)).toEqual(0);
        });

        it('should return 0', () => {
            noisegate.param('level', 0.5);
            expect(noisegate.start(-0.5)).toEqual(0);
        });
    });
});
