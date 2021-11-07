'use strict';

import { SoundModule } from '../../src/SoundModule';

describe('SoundModule TEST', () => {
    describe('SoundModule#params', () => {
        const soundModule = new SoundModule(audiocontext);

        it('should return associative array', () => {
            expect(soundModule.params()).toEqual({
                'mastervolume'      : 1,
                'stereo'            : { 'state' : false, 'time' : 0 },
                'compressor'        : { 'state' : true, 'threshold' : -24, 'knee' : 30, 'ratio' : 12, 'attack' : 0.003000000026077032, 'release' : 0.25 },
                'distortion'        : { 'state' : false, 'curve' : 'clean', 'samples' : 256, 'pre' : false, 'gain' : 0.5, 'lead' : 0.5, 'post' : false, 'bass' : 0, 'middle' : 0, 'treble' : 0, 'frequency' : 500, 'cabinet' : false },
                'wah'               : { 'state' : false, 'auto' : false, 'cutoff' : 350, 'depth' : 0, 'rate' : 0, 'resonance' : 1 },
                'pitchshifter'      : { 'state' : false, 'pitch' : 1 },
                'equalizer'         : { 'state' : false, 'bass' : 0, 'middle' : 0, 'treble' : 0, 'presence' : 0 },
                'filter'            : { 'state' : false, 'type' : 'lowpass', 'frequency' : 350, 'Q' : 1, 'gain' : 0, 'range' : 0.1, 'attack' : 0.01, 'decay' : 0.3, 'sustain' : 1, 'release' : 1 },
                'tremolo'           : { 'state' : false, 'depth' : 0, 'rate' : 0, 'wave' : 'sine' },
                'ringmodulator'     : { 'state' : false, 'depth' : 1, 'rate' : 0 },
                'autopanner'        : { 'state' : false, 'depth' : 0, 'rate' : 0 },
                'phaser'            : { 'state' : false, 'stage' : 12, 'frequency' : 350, 'resonance' : 1, 'depth' : 0, 'rate' : 0, 'mix' : 0, 'feedback' : 0 },
                'flanger'           : { 'state' : false, 'time' : 0, 'depth' : 0, 'rate' : 0, 'mix' : 0, 'tone' : 350, 'feedback' : 0 },
                'chorus'            : { 'state' : false, 'time' : 0, 'depth' : 0, 'rate' : 0, 'mix' : 0, 'tone' : 350, 'feedback' : 0 },
                'delay'             : { 'state' : false, 'time' : 0, 'dry' : 1, 'wet' : 0, 'tone' : 350, 'feedback' : 0 },
                'reverb'            : { 'state' : false, 'dry' : 1, 'wet' : 0, 'tone' : 350 },
                'panner'            : { 'state' : false, 'positions' : { 'x' : 0, 'y' : 0, 'z' : 0 }, 'orientations' : { 'x' : 1, 'y' : 0, 'z' : 0 }, 'refDistance' : 1, 'maxDistance' : 10000, 'rolloffFactor' : 1, 'coneInnerAngle' : 360, 'coneOuterAngle' : 360, 'coneOuterGain' : 0, 'panningModel' : 'HRTF', 'distanceModel' : 'inverse' },
                'listener'          : { 'state' : true, 'positions' : { 'x' : 0, 'y' : 0, 'z' : 0 }, 'forwards' : { 'x' : 0, 'y' : 0, 'z' : -1 }, 'ups' : { 'x' : 0, 'y' : 1, 'z' : 0 } },
                'envelopegenerator' : { 'attack' : 0.01, 'decay' : 0.3, 'sustain' : 0.5, 'release' : 1 }
            });
        });
    });
});
