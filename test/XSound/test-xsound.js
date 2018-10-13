'use strict';

// import '../../src/main.js';
import { OscillatorModule } from '../../src/OscillatorModule';
import { OneshotModule } from '../../src/OneshotModule';
import { AudioModule } from '../../src/AudioModule';
import { MediaModule } from '../../src/MediaModule';
import { StreamModule } from '../../src/StreamModule';
import { MixerModule } from '../../src/MixerModule';
import { MIDI } from '../../src/MIDI';
import { MML } from '../../src/MML';
import { Oscillator } from '../../src/OscillatorModule/Oscillator';

describe('XSound TEST', () => {
    describe('XSound', () => {
        X('oscillator').setup([true, false]);

        // Negative
        it('should return `null`', () => {
            expect(X()).toBeNull();
            expect(X('')).toBeNull();

            expect(X('oscillator', -1)).toBeNull();
            expect(X('oscillator', 2)).toBeNull();
        });

        // Positive
        xit('should return one of `SoundModule`, `MIDI`, `MML`, `Oscillator`', () => {
            expect(X('oscillator')).toEqual(jasmine.any(OscillatorModule));
            expect(X('oneshot')).toEqual(jasmine.any(OneshotModule));
            expect(X('audio')).toEqual(jasmine.any(AudioModule));
            expect(X('media')).toEqual(jasmine.any(MediaModule));
            expect(X('stream')).toEqual(jasmine.any(StreamModule));
            expect(X('mixer')).toEqual(jasmine.any(MixerModule));
            expect(X('midi')).toEqual(jasmine.any(MIDI));
            expect(X('mml')).toEqual(jasmine.any(MML));

            expect(X('oscillator', 0)).toEqual(jasmine.any(Oscillator));
            expect(X('oscillator', 1)).toEqual(jasmine.any(Oscillator));
        });
    });
});
