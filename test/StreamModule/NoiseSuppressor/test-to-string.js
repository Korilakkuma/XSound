'use strict';

import { NoiseSuppressor } from '../../../src/StreamModule/NoiseSuppressor';

describe('NoiseSuppressor TEST', () => {
    describe('NoiseSuppressor#toString', () => {
        const noisesuppressor = new NoiseSuppressor();

        it('should return "[NoiseSuppressor]"', () => {
            expect(noisesuppressor.toString()).toEqual('[StreamModule NoiseSuppressor]');
        });
    });
});
