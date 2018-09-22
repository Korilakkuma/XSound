'use strict';

// import '../../src/main.js';
import OscillatorModule from '../../src/OscillatorModule';
import OneshotModule from '../../src/OneshotModule';
import AudioModule from '../../src/AudioModule';
import MediaModule from '../../src/MediaModule';
import StreamModule from '../../src/StreamModule';
import MixerModule from '../../src/MixerModule';
import MIDI from '../../src/MIDI';
import MML from '../../src/MML';
import Oscillator from '../../src/OscillatorModule/Oscillator';

describe('XSound TEST', () => {
    describe('XSound.clone', () => {
        const C = X.clone();

        C('oscillator').setup([true, false]);

        // Negative
        it('should return `null`', () => {
            expect(C()).toBeNull();
            expect(C('')).toBeNull();

            expect(C('oscillator', -1)).toBeNull();
            expect(C('oscillator', 2)).toBeNull();
        });

        // Positive
        xit('should return one of `SoundModule`, `MIDI`, `MML`, `Oscillator`', () => {
            expect(C('oscillator')).toEqual(jasmine.any(OscillatorModule));
            expect(C('oneshot')).toEqual(jasmine.any(OneshotModule));
            expect(C('audio')).toEqual(jasmine.any(AudioModule));
            expect(C('media')).toEqual(jasmine.any(MediaModule));
            expect(C('stream')).toEqual(jasmine.any(StreamModule));
            expect(C('mixer')).toEqual(jasmine.any(MixerModule));
            expect(C('midi')).toEqual(jasmine.any(MIDI));
            expect(C('mml')).toEqual(jasmine.any(MML));

            expect(C('oscillator', 0)).toEqual(jasmine.any(Oscillator));
            expect(C('oscillator', 1)).toEqual(jasmine.any(Oscillator));
        });
    });
});
