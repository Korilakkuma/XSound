'use strict';

import Glide from '../../../src/OscillatorModule/Glide';

describe('Glide TEST', () => {
    describe('Glide#param', () => {
        const glide = new Glide(audiocontext);

        describe('time', () => {
            afterEach(() => {
                glide.param('time', 0);
            });

            // Getter
            // Positive
            it('should return 0', () => {
                expect(glide.param('time')).toEqual(0);
            });

            // Negative
            it('should return the instance of `Glide`', () => {
                expect(glide.param('')).toEqual(jasmine.any(Glide));
            });

            // Setter
            // Positive
            it('should return 10.5', () => {
                glide.param('time', 10.5);
                expect(glide.param('time')).toEqual(10.5);
            });

            it('should return 0', () => {
                glide.param('time', 0);
                expect(glide.param('time')).toEqual(0);
            });

            // Negative
            it('should return 0', () => {
                glide.param('time', -0.1);
                expect(glide.param('time')).toEqual(0);
            });
        });

        describe('type', () => {
            afterEach(() => {
                glide.param('type', 'linear');
            });

            // Getter
            // Positive
            it('should return "linear"', () => {
                expect(glide.param('type')).toEqual('linear');
            });

            // Negative
            it('should return the instance of `Glide`', () => {
                expect(glide.param('')).toEqual(jasmine.any(Glide));
            });

            // Setter
            // Positive
            it('should return "linear"', () => {
                glide.param('type', 'linear');
                expect(glide.param('type')).toEqual('linear');
            });

            it('should return "exponential"', () => {
                glide.param('type', 'exponential');
                expect(glide.param('type')).toEqual('exponential');
            });

            // Negative
            it('should return "linear"', () => {
                glide.param('type', '');
                expect(glide.param('type')).toEqual('linear');
            });
        });
    });
});
