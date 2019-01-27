'use strict';

import { SoundModule } from '../../src/SoundModule';
import { Analyser } from '../../src/SoundModule/Analyser';
import { Recorder } from '../../src/SoundModule/Recorder';
import { Session } from '../../src/SoundModule/Session';
import { Compressor } from '../../src/SoundModule/Effectors/Compressor';
import { Distortion } from '../../src/SoundModule/Effectors/Distortion';
import { Wah } from '../../src/SoundModule/Effectors/Wah';
import { Equalizer } from '../../src/SoundModule/Effectors/Equalizer';
import { Filter } from '../../src/SoundModule/Effectors/Filter';
import { Autopanner } from '../../src/SoundModule/Effectors/Autopanner';
import { Tremolo } from '../../src/SoundModule/Effectors/Tremolo';
import { Ringmodulator } from '../../src/SoundModule/Effectors/Ringmodulator';
import { Phaser } from '../../src/SoundModule/Effectors/Phaser';
import { Flanger } from '../../src/SoundModule/Effectors/Flanger';
import { Chorus } from '../../src/SoundModule/Effectors/Chorus';
import { Delay } from '../../src/SoundModule/Effectors/Delay';
import { Reverb } from '../../src/SoundModule/Effectors/Reverb';
import { Panner } from '../../src/SoundModule/Effectors/Panner';
import { Listener } from '../../src/SoundModule/Effectors/Listener';

describe('SoundModule TEST', () => {
    describe('SoundModule#module', () => {
        const soundModule = new SoundModule(audiocontext);

        // Negative
        it('should return `undefined`', () => {
            expect(soundModule.module()).toBeUndefined();
        });

        // Positive
        it('should return the instance of `Analyser`', () => {
            expect(soundModule.module('analyser')).toEqual(jasmine.any(Analyser));
        });

        it('should return the instance of `Recorder`', () => {
            expect(soundModule.module('recorder')).toEqual(jasmine.any(Recorder));
        });

        it('should return the instance of `Session`', () => {
            expect(soundModule.module('session')).toEqual(jasmine.any(Session));
        });

        it('should return the instance of `Compressor`', () => {
            expect(soundModule.module('compressor')).toEqual(jasmine.any(Compressor));
        });

        it('should return the instance of `Distortion`', () => {
            expect(soundModule.module('distortion')).toEqual(jasmine.any(Distortion));
        });

        it('should return the instance of `Wah`', () => {
            expect(soundModule.module('wah')).toEqual(jasmine.any(Wah));
        });

        it('should return the instance of `Equalizer`', () => {
            expect(soundModule.module('equalizer')).toEqual(jasmine.any(Equalizer));
        });

        it('should return the instance of `Filter`', () => {
            expect(soundModule.module('filter')).toEqual(jasmine.any(Filter));
        });

        it('should return the instance of `Autopanner`', () => {
            expect(soundModule.module('autopanner')).toEqual(jasmine.any(Autopanner));
        });

        it('should return the instance of `Tremolo`', () => {
            expect(soundModule.module('tremolo')).toEqual(jasmine.any(Tremolo));
        });

        it('should return the instance of `Ringmodulator`', () => {
            expect(soundModule.module('ringmodulator')).toEqual(jasmine.any(Ringmodulator));
        });

        it('should return the instance of `Phaser`', () => {
            expect(soundModule.module('phaser')).toEqual(jasmine.any(Phaser));
        });

        it('should return the instance of `Flanger`', () => {
            expect(soundModule.module('flanger')).toEqual(jasmine.any(Flanger));
        });

        it('should return the instance of `Chorus`', () => {
            expect(soundModule.module('chorus')).toEqual(jasmine.any(Chorus));
        });

        it('should return the instance of `Delay`', () => {
            expect(soundModule.module('delay')).toEqual(jasmine.any(Delay));
        });

        it('should return the instance of `Reverb`', () => {
            expect(soundModule.module('reverb')).toEqual(jasmine.any(Reverb));
        });

        it('should return the instance of `Panner`', () => {
            expect(soundModule.module('panner')).toEqual(jasmine.any(Panner));
        });

        it('should return the instance of `Listener`', () => {
            expect(soundModule.module('listener')).toEqual(jasmine.any(Listener));
        });
    });
});
