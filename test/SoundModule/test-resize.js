'use strict';

import { SoundModule } from '../../src/SoundModule';

describe('SoundModule TEST', () => {
    describe('SoundModule#resize', () => {
        const soundModule = new SoundModule(audiocontext);

        afterEach(() => {
            soundModule.resize(1024);
        });

        it('should return 256', () => {
            soundModule.resize(256);
            expect(soundModule.getBufferSize()).toEqual(256);
        });

        it('should return 512', () => {
            soundModule.resize(512);
            expect(soundModule.getBufferSize()).toEqual(512);
        });

        it('should return 1024', () => {
            soundModule.resize(1024);
            expect(soundModule.getBufferSize()).toEqual(1024);
        });

        it('should return 2048', () => {
            soundModule.resize(2048);
            expect(soundModule.getBufferSize()).toEqual(2048);
        });

        it('should return 4096', () => {
            soundModule.resize(4096);
            expect(soundModule.getBufferSize()).toEqual(4096);
        });

        it('should return 8192', () => {
            soundModule.resize(8192);
            expect(soundModule.getBufferSize()).toEqual(8192);
        });

        it('should return 16384', () => {
            soundModule.resize(16384);
            expect(soundModule.getBufferSize()).toEqual(16384);
        });
    });
});
