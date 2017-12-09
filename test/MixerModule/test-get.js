'use strict';

import MixerModule from '../../src/MixerModule';
import OscillatorModule from '../../src/OscillatorModule';

describe('MixerModule TEST', () => {
    describe('MixerModule#get', () => {
        const mixerModule = new MixerModule(audiocontext);

        const sources = [new OscillatorModule(audiocontext), new OscillatorModule(audiocontext)];

        mixerModule.mix(sources);

        it('should return the instance of `OscillatorModule`', () => {
            expect(mixerModule.get(0)).toEqual(sources[0]);
            expect(mixerModule.get(1)).toEqual(sources[1]);
        });

        it('should return array that contains the instances of `OscillatorModule`', () => {
            expect(mixerModule.get()).toEqual(sources);
            expect(mixerModule.get(-1)).toEqual(sources);
            expect(mixerModule.get(3)).toEqual(sources);
        });
    });
});
