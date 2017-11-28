'use strict';

import FFT from '../../../../src/SoundModule/Analyser/FFT';

describe('FFT TEST', () => {
    describe('FFT#toString', () => {
        const fft = new FFT(audiocontext.sampleRate);

        it('should return "[SoundModule Analyser FFT]"', () => {
            expect(fft.toString()).toEqual('[SoundModule Analyser FFT]');
        });
    });
});
