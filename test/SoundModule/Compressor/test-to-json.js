'use strict';

import Compressor from '../../../src/SoundModule/Compressor';

describe('Compressor TEST', () => {
    describe('Compressor#toJSON', () => {
        const compressor = new Compressor(audiocontext, 1024);

        it('should return JSON', () => {
            expect(compressor.toJSON()).toEqual('{"state":true,"threshold":-24,"knee":30,"ratio":12,"attack":0.003000000026077032,"release":0.25}');
        });
    });
});
