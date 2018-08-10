'use strict';

import NoiseModule from '../../src/NoiseModule';

describe('NoiseModule TEST', () => {
    describe('NoiseModule#param', () => {
        const noiseModule = new NoiseModule(audiocontext);

        describe('mastervolume', () => {
            afterEach(() => {
                noiseModule.param('mastervolume', 1);
            });

            // Getter
            // Positive
            it('should return 1', () => {
                expect(noiseModule.param('mastervolume')).toEqual(1);
            });

            // Negative
            it('should return the instance of `NoiseModule`', () => {
                expect(noiseModule.param('')).toEqual(jasmine.any(NoiseModule));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                noiseModule.param('mastervolume', 0.5);
                expect(noiseModule.param('mastervolume')).toEqual(0.5);
            });

            it('should return 1', () => {
                noiseModule.param('mastervolume', 1);
                expect(noiseModule.param('mastervolume')).toEqual(1);
            });

            it('should return 0', () => {
                noiseModule.param('mastervolume', 0);
                expect(noiseModule.param('mastervolume')).toEqual(0);
            });

            // Negative
            it('should return 1', () => {
                noiseModule.param('mastervolume', 1.1);
                expect(noiseModule.param('mastervolume')).toEqual(1);
            });

            it('should return 1', () => {
                noiseModule.param('mastervolume', -0.1);
                expect(noiseModule.param('mastervolume')).toEqual(1);
            });
        });
    });
});
