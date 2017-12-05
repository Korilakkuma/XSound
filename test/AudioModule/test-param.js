'use strict';

import AudioModule from '../../src/AudioModule';

describe('AudioModule TEST', () => {
    describe('AudioModule#param', () => {
        const audioModule = new AudioModule(audiocontext);

        describe('mastervolume', () => {
            afterEach(() => {
                audioModule.param('mastervolume', 1);
            });

            // Getter
            // Positive
            it('should return 1', () => {
                expect(audioModule.param('mastervolume')).toEqual(1);
            });

            // Negative
            it('should return the instance of `AudioModule`', () => {
                expect(audioModule.param('')).toEqual(jasmine.any(AudioModule));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                audioModule.param('mastervolume', 0.5);
                expect(audioModule.param('mastervolume')).toEqual(0.5);
            });

            it('should return 1', () => {
                audioModule.param('mastervolume', 1);
                expect(audioModule.param('mastervolume')).toEqual(1);
            });

            it('should return 0', () => {
                audioModule.param('mastervolume', 0);
                expect(audioModule.param('mastervolume')).toEqual(0);
            });

            // Negative
            it('should return 1', () => {
                audioModule.param('mastervolume', 1.1);
                expect(audioModule.param('mastervolume')).toEqual(1);
            });

            it('should return 1', () => {
                audioModule.param('mastervolume', -0.1);
                expect(audioModule.param('mastervolume')).toEqual(1);
            });
        });

        describe('playbackRate', () => {
            afterEach(() => {
                audioModule.param('playbackRate', 1);
            });

            // Getter
            // Positive
            it('should return 1', () => {
                expect(audioModule.param('playbackRate')).toEqual(1);
            });

            // Negative
            it('should return the instance of `AudioModule`', () => {
                expect(audioModule.param('')).toEqual(jasmine.any(AudioModule));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                audioModule.param('playbackRate', 0.5);
                expect(audioModule.param('playbackRate')).toEqual(0.5);
            });

            it('should return 1024', () => {
                audioModule.param('playbackRate', 1);
                expect(audioModule.param('playbackRate')).toEqual(1);
            });

            it('should return 0', () => {
                audioModule.param('playbackRate', 0);
                expect(audioModule.param('playbackRate')).toEqual(0);
            });

            // Negative
            it('should return 1', () => {
                audioModule.param('playbackRate', 1024.1);
                expect(audioModule.param('playbackRate')).toEqual(1);
            });

            it('should return 1', () => {
                audioModule.param('playbackRate', -0.1);
                expect(audioModule.param('playbackRate')).toEqual(1);
            });
        });

        describe('loop', () => {
            afterEach(() => {
                audioModule.param('loop', false);
            });

            // Getter
            // Positive
            it('should return `false`', () => {
                expect(audioModule.param('loop')).toBeFalsy();
            });

            // Negative
            it('should return the instance of `AudioModule`', () => {
                expect(audioModule.param('')).toEqual(jasmine.any(AudioModule));
            });

            // Setter
            it('should return `true`', () => {
                audioModule.param('loop', true);
                expect(audioModule.param('loop')).toBeTruthy();
            });

            it('should return `false`', () => {
                audioModule.param('loop', false);
                expect(audioModule.param('loop')).toBeFalsy();
            });
        });
    });
});
