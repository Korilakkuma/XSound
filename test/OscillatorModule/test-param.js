'use strict';

import OscillatorModule from '../../src/OscillatorModule';

describe('OscillatorModule TEST', () => {
    describe('OscillatorModule#param', () => {
        const oscillatorModule = new OscillatorModule(audiocontext);

        describe('mastervolume', () => {
            afterEach(() => {
                oscillatorModule.param('mastervolume', 1);
            });

            // Getter
            // Positive
            it('should return 1', () => {
                expect(oscillatorModule.param('mastervolume')).toEqual(1);
            });

            // Negative
            it('should return the instance of `OscillatorModule`', () => {
                expect(oscillatorModule.param('')).toEqual(jasmine.any(OscillatorModule));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                oscillatorModule.param('mastervolume', 0.5);
                expect(oscillatorModule.param('mastervolume')).toEqual(0.5);
            });

            it('should return 1', () => {
                oscillatorModule.param('mastervolume', 1);
                expect(oscillatorModule.param('mastervolume')).toEqual(1);
            });

            it('should return 0', () => {
                oscillatorModule.param('mastervolume', 0);
                expect(oscillatorModule.param('mastervolume')).toEqual(0);
            });

            // Negative
            it('should return 1', () => {
                oscillatorModule.param('mastervolume', 1.1);
                expect(oscillatorModule.param('mastervolume')).toEqual(1);
            });

            it('should return 1', () => {
                oscillatorModule.param('mastervolume', -0.1);
                expect(oscillatorModule.param('mastervolume')).toEqual(1);
            });
        });
    });
});
