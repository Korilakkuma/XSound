'use strict';

import { Wah } from '../../../../src/SoundModule/Effectors/Wah';

describe('Wah TEST', () => {
    describe('Wah#param', () => {
        const wah = new Wah(audiocontext, 1024);

        describe('auto', () => {
            afterEach(() => {
                wah.param('auto', false);
            });

            // Getter
            // Positive
            it('should return `false`', () => {
                expect(wah.param('auto')).toBeFalsy();
            });

            // Negative
            it('should return the instance of `Wah`', () => {
                expect(wah.param('')).toEqual(jasmine.any(Wah));
            });

            // Setter
            it('should return `true`', () => {
                wah.param('auto', true);
                expect(wah.param('auto')).toBeTruthy();
            });
        });

        describe('cutoff', () => {
            afterEach(() => {
                wah.param('cutoff', 350);
            });

            // Getter
            // Positive
            it('should return 350', () => {
                expect(wah.param('cutoff')).toEqual(350);
            });

            // Negative
            it('should return the instance of `Wah`', () => {
                expect(wah.param('')).toEqual(jasmine.any(Wah));
            });

            // Setter
            // Positive
            it('should return 350.5', () => {
                wah.param('cutoff', 350.5);
                expect(wah.param('cutoff')).toEqual(350.5);
            });

            it('should return the Nyquist frequency (half the sample-rate)', () => {
                wah.param('cutoff', (audiocontext.sampleRate / 2));
                expect(wah.param('cutoff')).toEqual(audiocontext.sampleRate / 2);
            });

            it('should return 10', () => {
                wah.param('cutoff', 10);
                expect(wah.param('cutoff')).toEqual(10);
            });

            // Negative
            it('should return 350', () => {
                wah.param('cutoff', ((audiocontext.sampleRate / 2) + 0.1));
                expect(wah.param('cutoff')).toEqual(350);
            });

            it('should return 350', () => {
                wah.param('cutoff', 9.9);
                expect(wah.param('cutoff')).toEqual(350);
            });
        });

        describe('depth', () => {
            afterEach(() => {
                wah.param('depth', 0);
            });

            // Getter
            // Positive
            it('should return 0', () => {
                expect(wah.param('depth')).toEqual(0);
            });

            // Negative
            it('should return the instance of `Wah`', () => {
                expect(wah.param('')).toEqual(jasmine.any(Wah));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                wah.param('depth', 0.5);
                expect(wah.param('depth')).toEqual(0.5);
            });

            it('should return 1', () => {
                wah.param('depth', 1);
                expect(wah.param('depth')).toEqual(1);
            });

            it('should return 0', () => {
                wah.param('depth', 0);
                expect(wah.param('depth')).toEqual(0);
            });

            // Negative
            it('should return 0', () => {
                wah.param('depth', 1.1);
                expect(wah.param('depth')).toEqual(0);
            });

            it('should return 0', () => {
                wah.param('depth', -0.1);
                expect(wah.param('depth')).toEqual(0);
            });
        });

        describe('rate', () => {
            afterEach(() => {
                wah.param('rate', 0);
            });

            // Getter
            // Positive
            it('should return 0', () => {
                expect(wah.param('rate')).toEqual(0);
            });

            // Negative
            it('should return the instance of `Wah`', () => {
                expect(wah.param('')).toEqual(jasmine.any(Wah));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                wah.param('rate', 0.5);
                expect(wah.param('rate')).toEqual(0.5);
            });

            it('should return the Nyquist frequency (half the sample-rate)', () => {
                wah.param('rate', (audiocontext.sampleRate / 2));
                expect(wah.param('rate')).toEqual(audiocontext.sampleRate / 2);
            });

            it('should return 0', () => {
                wah.param('rate', 0);
                expect(wah.param('rate')).toEqual(0);
            });

            // Negative
            it('should return 0', () => {
                wah.param('rate', ((audiocontext.sampleRate / 2) + 0.1));
                expect(wah.param('rate')).toEqual(0);
            });

            it('should return 0', () => {
                wah.param('rate', -0.1);
                expect(wah.param('rate')).toEqual(0);
            });
        });

        describe('resonance', () => {
            afterEach(() => {
                wah.param('resonance', 1);
            });

            // Getter
            // Positive
            it('should return 1', () => {
                expect(wah.param('resonance')).toEqual(1);
            });

            // Negative
            it('should return the instance of `Wah`', () => {
                expect(wah.param('')).toEqual(jasmine.any(Wah));
            });

            // Setter
            // Positive
            it('should return 1000', () => {
                wah.param('resonance', 1000);
                expect(wah.param('resonance')).toEqual(1000);
            });

            it('should return 0.00009999999747378752', () => {
                wah.param('resonance', 0.0001);
                expect(wah.param('resonance')).toEqual(0.00009999999747378752);
            });

            // Negative
            it('should return 1', () => {
                wah.param('resonance', 1000.1);
                expect(wah.param('resonance')).toEqual(1);
            });

            it('should return 1', () => {
                wah.param('resonance', 0.00009999);
                expect(wah.param('resonance')).toEqual(1);
            });
        });
    });
});
