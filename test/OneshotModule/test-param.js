'use strict';

import OneshotModule from '../../src/OneshotModule';

describe('OneshotModule TEST', () => {
    describe('OneshotModule#param', () => {
        const oneshotModule = new OneshotModule(audiocontext);

        describe('mastervolume', () => {
            afterEach(() => {
                oneshotModule.param('mastervolume', 1);
            });

            // Getter
            // Positive
            it('should return 1', () => {
                expect(oneshotModule.param('mastervolume')).toEqual(1);
            });

            // Negative
            it('should return the instance of `OneshotModule`', () => {
                expect(oneshotModule.param('')).toEqual(jasmine.any(OneshotModule));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                oneshotModule.param('mastervolume', 0.5);
                expect(oneshotModule.param('mastervolume')).toEqual(0.5);
            });

            it('should return 1', () => {
                oneshotModule.param('mastervolume', 1);
                expect(oneshotModule.param('mastervolume')).toEqual(1);
            });

            it('should return 0', () => {
                oneshotModule.param('mastervolume', 0);
                expect(oneshotModule.param('mastervolume')).toEqual(0);
            });

            // Negative
            it('should return 1', () => {
                oneshotModule.param('mastervolume', 1.1);
                expect(oneshotModule.param('mastervolume')).toEqual(1);
            });

            it('should return 1', () => {
                oneshotModule.param('mastervolume', -0.1);
                expect(oneshotModule.param('mastervolume')).toEqual(1);
            });
        });

        describe('transpose', () => {
            afterEach(() => {
                oneshotModule.param('transpose', 1);
            });

            // Getter
            // Positive
            it('should return 1', () => {
                expect(oneshotModule.param('transpose')).toEqual(1);
            });

            // Negative
            it('should return the instance of `OneshotModule`', () => {
                expect(oneshotModule.param('')).toEqual(jasmine.any(OneshotModule));
            });

            // Setter
            // Positive
            it('should return 0.1', () => {
                oneshotModule.param('transpose', 0.1);
                expect(oneshotModule.param('transpose')).toEqual(0.1);
            });

            // Negative
            it('should return 1', () => {
                oneshotModule.param('transpose', 0);
                expect(oneshotModule.param('transpose')).toEqual(1);
            });
        });
    });
});
