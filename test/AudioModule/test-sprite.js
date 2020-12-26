'use strict';

import { AudioModule } from '../../src/AudioModule';

describe('AudioModule TEST', () => {
    describe('AudioModule#sprite', () => {
        const audioModule = new AudioModule(audiocontext);

        it('should return new `AudioBuffer`s', () => {
            const numberOfChannels = 2;
            const sampleRate       = audiocontext.sampleRate;
            const duration         = 360;
            const length           = duration * sampleRate;

            audioModule.ready(audiocontext.createBuffer(numberOfChannels, length, sampleRate));

            const sprites = audioModule.sprite({
                1: [60, 120],
                2: [120, 180],
                3: [180, 240]
            });

            Object.keys(sprites).forEach(key => {
                const audioBuffer = sprites[key];

                expect(audioBuffer.numberOfChannels).toEqual(numberOfChannels);
                expect(audioBuffer.sampleRate).toEqual(sampleRate);
                expect(audioBuffer.duration).toEqual(60);
                expect(audioBuffer.length).toEqual(60 * sampleRate);
            });
        });
    });
});
