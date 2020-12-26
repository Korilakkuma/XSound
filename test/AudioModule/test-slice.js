'use strict';

import { AudioModule } from '../../src/AudioModule';

describe('AudioModule TEST', () => {
    describe('AudioModule#slice', () => {
        const audioModule = new AudioModule(audiocontext);

        it('should return new `AudioBuffer`', () => {
            const numberOfChannels = 1;
            const sampleRate       = audiocontext.sampleRate;
            const duration         = 180;
            const length           = duration * sampleRate;

            audioModule.ready(audiocontext.createBuffer(numberOfChannels, length, sampleRate));

            const audioBuffer = audioModule.slice(60, 120);

            expect(audioBuffer.numberOfChannels).toEqual(numberOfChannels);
            expect(audioBuffer.sampleRate).toEqual(sampleRate);
            expect(audioBuffer.duration).toEqual(120 - 60);
            expect(audioBuffer.length).toEqual((120 - 60) * sampleRate);
        });

        it('should return new `AudioBuffer`', () => {
            const numberOfChannels = 2;
            const sampleRate       = audiocontext.sampleRate;
            const duration         = 180;
            const length           = duration * sampleRate;

            audioModule.ready(audiocontext.createBuffer(numberOfChannels, length, sampleRate));

            const audioBuffer = audioModule.slice(60, 120);

            expect(audioBuffer.numberOfChannels).toEqual(numberOfChannels);
            expect(audioBuffer.sampleRate).toEqual(sampleRate);
            expect(audioBuffer.duration).toEqual(120 - 60);
            expect(audioBuffer.length).toEqual((120 - 60) * sampleRate);
        });
    });
});
