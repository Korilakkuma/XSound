'use strict';

import { VocalCanceler } from '../../../src/AudioModule/VocalCanceler';

describe('VocalCanceler TEST', () => {
    describe('VocalCanceler#start', () => {
        const vocalcanceler = new VocalCanceler();

        it('should return 1', () => {
            vocalcanceler.param('depth', 0);
            expect(vocalcanceler.start(1, 1)).toEqual(1);
        });

        it('should return 0', () => {
            vocalcanceler.param('depth', 1);
            expect(vocalcanceler.start(1, 1)).toEqual(0);
        });

        it('should return 0.5', () => {
            vocalcanceler.param('depth', 0.5);
            expect(vocalcanceler.start(1, 1)).toEqual(0.5);
        });
    });
});
