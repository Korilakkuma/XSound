'use strict';

import { VocalCanceler } from '../../../src/AudioModule/VocalCanceler';

describe('VocalCanceler TEST', () => {
    describe('VocalCanceler#toString', () => {
        const vocalcanceler = new VocalCanceler();

        it('should return "[VocalCanceler]"', () => {
            expect(vocalcanceler.toString()).toEqual('[AudioModule VocalCanceler]');
        });
    });
});
