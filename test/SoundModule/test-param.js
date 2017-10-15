'use strict';

import SoundModule from '../../src/SoundModule';

describe('SoundModule TEST', () => {
    describe('SoundModule#param', () => {
        describe('mastervolume', () => {
            const soundModule = new SoundModule(audiocontext);

            afterEach(() => {
                soundModule.param('mastervolume', 1);
            });

            // Getter
            // Positive
            it('should return 1', () => {
                expect(soundModule.param('mastervolume')).toEqual(1);
            });

            // Negative
            it('should return `undefined`', () => {
                expect(soundModule.param('')).toBeUndefined();
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                soundModule.param('mastervolume', 0.5);
                expect(soundModule.param('mastervolume')).toEqual(0.5);
            });

            it('should return 1', () => {
                soundModule.param('mastervolume', 1);
                expect(soundModule.param('mastervolume')).toEqual(1);
            });

            it('should return 0', () => {
                soundModule.param('mastervolume', 0);
                expect(soundModule.param('mastervolume')).toEqual(0);
            });

            // Negative
            it('should return 1', () => {
                soundModule.param('mastervolume', 1.1);
                expect(soundModule.param('mastervolume')).toEqual(1);
            });

            it('should return 1', () => {
                soundModule.param('mastervolume', -0.1);
                expect(soundModule.param('mastervolume')).toEqual(1);
            });
        });
    });
});
