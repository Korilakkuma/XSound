'use strict';

import { StreamModule } from '../../src/StreamModule';

describe('StreamModule TEST', () => {
    describe('StreamModule#param', () => {
        const streamModule = new StreamModule(audiocontext);

        describe('mastervolume', () => {
            afterEach(() => {
                streamModule.param('mastervolume', 1);
            });

            // Getter
            // Positive
            it('should return 1', () => {
                expect(streamModule.param('mastervolume')).toEqual(1);
            });

            // Negative
            it('should return the instance of `StreamModule`', () => {
                expect(streamModule.param('')).toEqual(jasmine.any(StreamModule));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                streamModule.param('mastervolume', 0.5);
                expect(streamModule.param('mastervolume')).toEqual(0.5);
            });

            it('should return 1', () => {
                streamModule.param('mastervolume', 1);
                expect(streamModule.param('mastervolume')).toEqual(1);
            });

            it('should return 0', () => {
                streamModule.param('mastervolume', 0);
                expect(streamModule.param('mastervolume')).toEqual(0);
            });

            // Negative
            it('should return 1', () => {
                streamModule.param('mastervolume', 1.1);
                expect(streamModule.param('mastervolume')).toEqual(1);
            });

            it('should return 1', () => {
                streamModule.param('mastervolume', -0.1);
                expect(streamModule.param('mastervolume')).toEqual(1);
            });
        });

        describe('output', () => {
            afterEach(() => {
                streamModule.param('output', true);
            });

            // Getter
            // Positive
            it('should return `true`', () => {
                expect(streamModule.param('output')).toBeTruthy();
            });

            // Negative
            it('should return the instance of `StreamModule`', () => {
                expect(streamModule.param('')).toEqual(jasmine.any(StreamModule));
            });

            // Setter
            it('should return `true`', () => {
                streamModule.param('output', true);
                expect(streamModule.param('output')).toBeTruthy();
            });

            it('should return `false`', () => {
                streamModule.param('output', false);
                expect(streamModule.param('output')).toBeFalsy();
            });
        });
    });
});
