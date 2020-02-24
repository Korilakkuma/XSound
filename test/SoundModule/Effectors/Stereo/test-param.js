'use strict';

import { Stereo } from '../../../../src/SoundModule/Effectors/Stereo';

describe('Stereo TEST', () => {
    describe('Stereo#param', () => {
        const stereo = new Stereo(audiocontext, 1024);

        describe('time', () => {
            afterEach(() => {
                stereo.param('time', 0);
            });

            // Getter
            // Positive
            it('should return 0', () => {
                expect(stereo.param('time')).toEqual(0);
            });

            // Negative
            it('should return the instance of `Stereo`', () => {
                expect(stereo.param('')).toEqual(jasmine.any(Stereo));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                stereo.param('time', 0.5);
                expect(stereo.param('time')).toEqual(0.5);
            });

            it('should return 1', () => {
                stereo.param('time', 1);
                expect(stereo.param('time')).toEqual(1);
            });

            it('should return 0', () => {
                stereo.param('time', 0);
                expect(stereo.param('time')).toEqual(0);
            });

            // Negative
            it('should return 0', () => {
                stereo.param('time', 1.1);
                expect(stereo.param('time')).toEqual(0);
            });

            it('should return 0', () => {
                stereo.param('time', -0.1);
                expect(stereo.param('time')).toEqual(0);
            });
        });
    });
});
