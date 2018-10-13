'use strict';

import { Tremolo } from '../../../src/SoundModule/Tremolo';

describe('Tremolo TEST', () => {
    describe('Tremolo#param', () => {
        const tremolo = new Tremolo(audiocontext, 1024);

        describe('depth', () => {
            afterEach(() => {
                tremolo.param('depth', 0);
            });

            // Getter
            // Positive
            it('should return 0', () => {
                expect(tremolo.param('depth')).toEqual(0);
            });

            // Negative
            it('should return the instance of `Tremolo`', () => {
                expect(tremolo.param('')).toEqual(jasmine.any(Tremolo));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                tremolo.param('depth', 0.5);
                expect(tremolo.param('depth')).toEqual(0.5);
            });

            it('should return 1', () => {
                tremolo.param('depth', 1);
                expect(tremolo.param('depth')).toEqual(1);
            });

            it('should return 0', () => {
                tremolo.param('depth', 0);
                expect(tremolo.param('depth')).toEqual(0);
            });

            // Negative
            it('should return 0', () => {
                tremolo.param('depth', 1.1);
                expect(tremolo.param('depth')).toEqual(0);
            });

            it('should return 0', () => {
                tremolo.param('depth', -0.1);
                expect(tremolo.param('depth')).toEqual(0);
            });
        });

        describe('rate', () => {
            afterEach(() => {
                tremolo.param('rate', 0);
            });

            // Getter
            // Positive
            it('should return 0', () => {
                expect(tremolo.param('rate')).toEqual(0);
            });

            // Negative
            it('should return the instance of `Tremolo`', () => {
                expect(tremolo.param('')).toEqual(jasmine.any(Tremolo));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                tremolo.param('rate', 0.5);
                expect(tremolo.param('rate')).toEqual(0.5);
            });

            it('should return the Nyquist frequency (half the sample-rate)', () => {
                tremolo.param('rate', (audiocontext.sampleRate / 2));
                expect(tremolo.param('rate')).toEqual(audiocontext.sampleRate / 2);
            });

            it('should return 0', () => {
                tremolo.param('rate', 0);
                expect(tremolo.param('rate')).toEqual(0);
            });

            // Negative
            it('should return 0', () => {
                tremolo.param('rate', ((audiocontext.sampleRate / 2) + 0.1));
                expect(tremolo.param('rate')).toEqual(0);
            });

            it('should return 0', () => {
                tremolo.param('rate', -0.1);
                expect(tremolo.param('rate')).toEqual(0);
            });
        });

        describe('wave', () => {
            afterEach(() => {
                tremolo.param('wave', 'sine');
            });

            // Getter
            // Positive
            it('should return "sine"', () => {
                expect(tremolo.param('wave')).toEqual('sine');
            });

            // Negative
            it('should return the instance of `Tremolo`', () => {
                expect(tremolo.param('')).toEqual(jasmine.any(Tremolo));
            });

            // Setter
            // Positive
            it('should return "sine"', () => {
                tremolo.param('wave', 'sine');
                expect(tremolo.param('wave')).toEqual('sine');
            });

            it('should return "square"', () => {
                tremolo.param('wave', 'square');
                expect(tremolo.param('wave')).toEqual('square');
            });

            it('should return "sawtooth"', () => {
                tremolo.param('wave', 'sawtooth');
                expect(tremolo.param('wave')).toEqual('sawtooth');
            });

            it('should return "triangle"', () => {
                tremolo.param('wave', 'triangle');
                expect(tremolo.param('wave')).toEqual('triangle');
            });

            // Negative
            it('should return "sine"', () => {
                tremolo.param('wave', '');
                expect(tremolo.param('wave')).toEqual('sine');
            });
        });
    });
});
