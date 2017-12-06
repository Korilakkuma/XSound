'use strict';

import MediaModule from '../../src/MediaModule';

describe('MediaModule TEST', () => {
    describe('MediaModule#param', () => {
        const mediaModule = new MediaModule(audiocontext);

        describe('mastervolume', () => {
            afterEach(() => {
                mediaModule.param('mastervolume', 1);
            });

            // Getter
            // Positive
            it('should return 1', () => {
                expect(mediaModule.param('mastervolume')).toEqual(1);
            });

            // Negative
            it('should return the instance of `MediaModule`', () => {
                expect(mediaModule.param('')).toEqual(jasmine.any(MediaModule));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                mediaModule.param('mastervolume', 0.5);
                expect(mediaModule.param('mastervolume')).toEqual(0.5);
            });

            it('should return 1', () => {
                mediaModule.param('mastervolume', 1);
                expect(mediaModule.param('mastervolume')).toEqual(1);
            });

            it('should return 0', () => {
                mediaModule.param('mastervolume', 0);
                expect(mediaModule.param('mastervolume')).toEqual(0);
            });

            // Negative
            it('should return 1', () => {
                mediaModule.param('mastervolume', 1.1);
                expect(mediaModule.param('mastervolume')).toEqual(1);
            });

            it('should return 1', () => {
                mediaModule.param('mastervolume', -0.1);
                expect(mediaModule.param('mastervolume')).toEqual(1);
            });
        });

        describe('playbackRate', () => {
            afterEach(() => {
                mediaModule.param('playbackRate', 1);
            });

            // Getter
            // Positive
            it('should return 1', () => {
                expect(mediaModule.param('playbackRate')).toEqual(1);
            });

            // Negative
            it('should return the instance of `MediaModule`', () => {
                expect(mediaModule.param('')).toEqual(jasmine.any(MediaModule));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                mediaModule.param('playbackRate', 0.5);
                expect(mediaModule.param('playbackRate')).toEqual(0.5);
            });

            // Negative
            it('should return 1', () => {
                mediaModule.param('playbackRate', 0.4999999);
                expect(mediaModule.param('playbackRate')).toEqual(1);
            });

        });

        describe('loop', () => {
            afterEach(() => {
                mediaModule.param('loop', false);
            });

            // Getter
            // Positive
            it('should return false', () => {
                expect(mediaModule.param('loop')).toBeFalsy();
            });

            // Negative
            it('should return the instance of `MediaModule`', () => {
                expect(mediaModule.param('')).toEqual(jasmine.any(MediaModule));
            });

            // Setter
            it('should return `true`', () => {
                mediaModule.param('loop', true);
                expect(mediaModule.param('loop')).toBeTruthy();
            });

            it('should return `false`', () => {
                mediaModule.param('loop', false);
                expect(mediaModule.param('loop')).toBeFalsy();
            });
        });

        describe('muted', () => {
            afterEach(() => {
                mediaModule.param('muted', false);
            });

            // Getter
            // Positive
            it('should return `false`', () => {
                expect(mediaModule.param('muted')).toBeFalsy();
            });

            // Negative
            it('should return the instance of `MediaModule`', () => {
                expect(mediaModule.param('')).toEqual(jasmine.any(MediaModule));
            });

            // Setter
            it('should return `true`', () => {
                mediaModule.param('muted', true);
                expect(mediaModule.param('muted')).toBeTruthy();
            });

            it('should return `false`', () => {
                mediaModule.param('muted', false);
                expect(mediaModule.param('muted')).toBeFalsy();
            });
        });

        describe('controls', () => {
            afterEach(() => {
                mediaModule.param('controls', false);
            });

            // Getter
            // Positive
            it('should return `false`', () => {
                expect(mediaModule.param('controls')).toBeFalsy();
            });

            // Negative
            it('should return the instance of `MediaModule`', () => {
                expect(mediaModule.param('')).toEqual(jasmine.any(MediaModule));
            });

            // Setter
            it('should return `true`', () => {
                mediaModule.param('controls', true);
                expect(mediaModule.param('controls')).toBeTruthy();
            });

            it('should return `false`', () => {
                mediaModule.param('controls', false);
                expect(mediaModule.param('controls')).toBeFalsy();
            });
        });
    });
});
