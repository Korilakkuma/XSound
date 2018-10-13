'use strict';

import { AudioModule } from '../../src/AudioModule';

describe('AudioModule TEST', () => {
    describe('AudioModule#get', () => {
        const audioModule = new AudioModule(audiocontext);

        it('should return the instance of `AudioBufferSourceNode`', () => {
            expect(audioModule.get()).toEqual(jasmine.any(AudioBufferSourceNode));
        });
    });
});
