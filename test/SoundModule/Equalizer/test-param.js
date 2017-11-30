'use strict';

import Equalizer from '../../../src/SoundModule/Equalizer';

describe('Equalizer TEST', () => {
    describe('Equalizer#param', () => {
        const equalizer = new Equalizer(audiocontext, 1024);

        describe('bass', () => {
            afterEach(() => {
                equalizer.param('bass', 0);
            });

            // Getter
            // Positive
            it('should return 0', () => {
                expect(equalizer.param('bass')).toEqual(0);
            });

            // Negative
            it('should return the instance of `Equalizer`', () => {
                expect(equalizer.param('')).toEqual(jasmine.any(Equalizer));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                equalizer.param('bass', 0.5);
                expect(equalizer.param('bass')).toEqual(0.5);
            });

            it('should return 40', () => {
                equalizer.param('bass', 40);
                expect(equalizer.param('bass')).toEqual(40);
            });

            it('should return -40', () => {
                equalizer.param('bass', -40);
                expect(equalizer.param('bass')).toEqual(-40);
            });

            // Negative
            it('should return 0', () => {
                equalizer.param('bass', 40.1);
                expect(equalizer.param('bass')).toEqual(0);
            });

            it('should return 0', () => {
                equalizer.param('bass', -40.1);
                expect(equalizer.param('bass')).toEqual(0);
            });
        });

        describe('middle', () => {
            afterEach(() => {
                equalizer.param('middle', 0);
            });

            // Getter
            // Positive
            it('should return 0', () => {
                expect(equalizer.param('middle')).toEqual(0);
            });

            // Negative
            it('should return the instance of `Equalizer`', () => {
                expect(equalizer.param('')).toEqual(jasmine.any(Equalizer));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                equalizer.param('middle', 0.5);
                expect(equalizer.param('middle')).toEqual(0.5);
            });

            it('should return 40', () => {
                equalizer.param('middle', 40);
                expect(equalizer.param('middle')).toEqual(40);
            });

            it('should return -40', () => {
                equalizer.param('middle', -40);
                expect(equalizer.param('middle')).toEqual(-40);
            });

            // Negative
            it('should return 0', () => {
                equalizer.param('middle', 40.1);
                expect(equalizer.param('middle')).toEqual(0);
            });

            it('should return 0', () => {
                equalizer.param('middle', -40.1);
                expect(equalizer.param('middle')).toEqual(0);
            });
        });

        describe('treble', () => {
            afterEach(() => {
                equalizer.param('treble', 0);
            });

            // Getter
            // Positive
            it('should return 0', () => {
                expect(equalizer.param('treble')).toEqual(0);
            });

            // Negative
            it('should return the instance of `Equalizer`', () => {
                expect(equalizer.param('')).toEqual(jasmine.any(Equalizer));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                equalizer.param('treble', 0.5);
                expect(equalizer.param('treble')).toEqual(0.5);
            });

            it('should return 40', () => {
                equalizer.param('treble', 40);
                expect(equalizer.param('treble')).toEqual(40);
            });

            it('should return -40', () => {
                equalizer.param('treble', -40);
                expect(equalizer.param('treble')).toEqual(-40);
            });

            // Negative
            it('should return 0', () => {
                equalizer.param('treble', 40.1);
                expect(equalizer.param('treble')).toEqual(0);
            });

            it('should return 0', () => {
                equalizer.param('treble', -40.1);
                expect(equalizer.param('treble')).toEqual(0);
            });
        });

        describe('presence', () => {
            afterEach(() => {
                equalizer.param('presence', 0);
            });

            // Getter
            // Positive
            it('should return 0', () => {
                expect(equalizer.param('presence')).toEqual(0);
            });

            // Negative
            it('should return the instance of `Equalizer`', () => {
                expect(equalizer.param('')).toEqual(jasmine.any(Equalizer));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                equalizer.param('presence', 0.5);
                expect(equalizer.param('presence')).toEqual(0.5);
            });

            it('should return 40', () => {
                equalizer.param('presence', 40);
                expect(equalizer.param('presence')).toEqual(40);
            });

            it('should return -40', () => {
                equalizer.param('presence', -40);
                expect(equalizer.param('presence')).toEqual(-40);
            });

            // Negative
            it('should return 0', () => {
                equalizer.param('presence', 40.1);
                expect(equalizer.param('presence')).toEqual(0);
            });

            it('should return 0', () => {
                equalizer.param('presence', -40.1);
                expect(equalizer.param('presence')).toEqual(0);
            });
        });
    });
});
