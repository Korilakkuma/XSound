'use strict';

import { Time } from '../../../../src/SoundModule/Analyser/Time';

describe('Time TEST', () => {
    describe('Time#param', () => {
        const time = new Time(audiocontext.sampleRate);

        describe('type', () => {
            afterEach(() => {
                time.param('type', 'uint');
            });

            // Getter
            // Positive
            it('should return "uint"', () => {
                expect(time.param('type')).toEqual('uint');
            });

            // Negative
            it('should return the instance of `Time`', () => {
                expect(time.param('')).toEqual(jasmine.any(Time));
            });

            // Setter
            // Positive
            it('should return "uint"', () => {
                time.param('type', 'uint');
                expect(time.param('type')).toEqual('uint');
            });

            it('should return "float"', () => {
                time.param('type', 'float');
                expect(time.param('type')).toEqual('float');
            });

            // Negative
            it('should return "uint"', () => {
                time.param('type', 'double');
                expect(time.param('type')).toEqual('uint');
            });
        });

        describe('textInterval', () => {
            afterEach(() => {
                time.param('textInterval', 0.005);
            });

            // Getter
            // Positive
            it('should return 0.005', () => {
                expect(time.param('textInterval')).toEqual(0.005);
            });

            // Negative
            it('should return the instance of `Time`', () => {
                expect(time.param('')).toEqual(jasmine.any(Time));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                time.param('textInterval', 0.5);
                expect(time.param('textInterval')).toEqual(0.5);
            });

            // Negative
            it('should return 0.005', () => {
                time.param('textInterval', 0);
                expect(time.param('textInterval')).toEqual(0.005);
            });
        });
    });
});
