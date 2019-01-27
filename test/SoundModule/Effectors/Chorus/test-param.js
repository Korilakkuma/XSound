'use strict';

import { Chorus } from '../../../../src/SoundModule/Effectors/Chorus';

describe('Chorus TEST', () => {
    describe('Chorus#param', () => {
        const chorus = new Chorus(audiocontext, 1024);

        describe('time', () => {
            afterEach(() => {
                chorus.param('time', 0);
            });

            // Getter
            // Positive
            it('should return 0', () => {
                expect(chorus.param('time')).toEqual(0);
            });

            // Negative
            it('should return the instance of `Chorus`', () => {
                expect(chorus.param('')).toEqual(jasmine.any(Chorus));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                chorus.param('time', 0.5);
                expect(chorus.param('time')).toEqual(0.5);
            });

            it('should return 1', () => {
                chorus.param('time', 1);
                expect(chorus.param('time')).toEqual(1);
            });

            it('should return 0', () => {
                chorus.param('time', 0);
                expect(chorus.param('time')).toEqual(0);
            });

            // Negative
            it('should return 0', () => {
                chorus.param('time', 1.1);
                expect(chorus.param('time')).toEqual(0);
            });

            it('should return 0', () => {
                chorus.param('time', -0.1);
                expect(chorus.param('time')).toEqual(0);
            });
        });

        describe('depth', () => {
            afterEach(() => {
                chorus.param('depth', 0);
            });

            // Getter
            // Positive
            it('should return 0', () => {
                expect(chorus.param('depth')).toEqual(0);
            });

            // Negative
            it('should return the instance of `Chorus`', () => {
                expect(chorus.param('')).toEqual(jasmine.any(Chorus));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                chorus.param('depth', 0.5);
                expect(chorus.param('depth')).toEqual(0.5);
            });

            it('should return 1', () => {
                chorus.param('depth', 1);
                expect(chorus.param('depth')).toEqual(1);
            });

            it('should return 0', () => {
                chorus.param('depth', 0);
                expect(chorus.param('depth')).toEqual(0);
            });

            // Negative
            it('should return 0', () => {
                chorus.param('depth', 1.1);
                expect(chorus.param('depth')).toEqual(0);
            });

            it('should return 0', () => {
                chorus.param('depth', -0.1);
                expect(chorus.param('depth')).toEqual(0);
            });
        });

        describe('rate', () => {
            afterEach(() => {
                chorus.param('rate', 0);
            });

            // Getter
            // Positive
            it('should return 0', () => {
                expect(chorus.param('rate')).toEqual(0);
            });

            // Negative
            it('should return the instance of `Chorus`', () => {
                expect(chorus.param('')).toEqual(jasmine.any(Chorus));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                chorus.param('rate', 0.5);
                expect(chorus.param('rate')).toEqual(0.5);
            });

            it('should return the Nyquist tone (half the sample-rate)', () => {
                chorus.param('rate', (audiocontext.sampleRate / 2));
                expect(chorus.param('rate')).toEqual(audiocontext.sampleRate / 2);
            });

            it('should return 0', () => {
                chorus.param('rate', 0);
                expect(chorus.param('rate')).toEqual(0);
            });

            // Negative
            it('should return 0', () => {
                chorus.param('rate', ((audiocontext.sampleRate / 2) + 0.1));
                expect(chorus.param('rate')).toEqual(0);
            });

            it('should return 0', () => {
                chorus.param('rate', -0.1);
                expect(chorus.param('rate')).toEqual(0);
            });
        });

        describe('mix', () => {
            afterEach(() => {
                chorus.param('mix', 0);
            });

            // Getter
            // Positive
            it('should return 0', () => {
                expect(chorus.param('mix')).toEqual(0);
            });

            // Negative
            it('should return the instance of `Chorus`', () => {
                expect(chorus.param('')).toEqual(jasmine.any(Chorus));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                chorus.param('mix', 0.5);
                expect(chorus.param('mix')).toEqual(0.5);
            });

            it('should return 1', () => {
                chorus.param('mix', 1);
                expect(chorus.param('mix')).toEqual(1);
            });

            it('should return 0', () => {
                chorus.param('mix', 0);
                expect(chorus.param('mix')).toEqual(0);
            });

            // Negative
            it('should return 0', () => {
                chorus.param('mix', 1.1);
                expect(chorus.param('mix')).toEqual(0);
            });

            it('should return 0', () => {
                chorus.param('mix', -0.1);
                expect(chorus.param('mix')).toEqual(0);
            });
        });

        describe('tone', () => {
            afterEach(() => {
                chorus.param('tone', 350);
            });

            // Getter
            // Positive
            it('should return 350', () => {
                expect(chorus.param('tone')).toEqual(350);
            });

            // Negative
            it('should return the instance of `Chorus`', () => {
                expect(chorus.param('')).toEqual(jasmine.any(Chorus));
            });

            // Setter
            // Positive
            it('should return 350.5', () => {
                chorus.param('tone', 350.5);
                expect(chorus.param('tone')).toEqual(350.5);
            });

            it('should return the Nyquist tone (half the sample-rate)', () => {
                chorus.param('tone', (audiocontext.sampleRate / 2));
                expect(chorus.param('tone')).toEqual(audiocontext.sampleRate / 2);
            });

            it('should return 10', () => {
                chorus.param('tone', 10);
                expect(chorus.param('tone')).toEqual(10);
            });

            // Negative
            it('should return 350', () => {
                chorus.param('tone', ((audiocontext.sampleRate / 2) + 0.1));
                expect(chorus.param('tone')).toEqual(350);
            });

            it('should return 350', () => {
                chorus.param('tone', 9.9);
                expect(chorus.param('tone')).toEqual(350);
            });
        });
    });
});
