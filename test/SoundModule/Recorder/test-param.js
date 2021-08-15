'use strict';

import { Recorder } from '../../../src/SoundModule/Recorder';

describe('Recorder TEST', () => {
    describe('Recorder#param', () => {
        const recorder = new Recorder(audiocontext, 1024, 2, 2);

        recorder.setup(2);

        describe('left', () => {
            afterEach(() => {
                recorder.param('left', 1);
            });

            // Getter
            // Positive
            it('should return 1', () => {
                expect(recorder.param('left')).toEqual(1);
            });

            // Negative
            it('should return the instance of `Recorder`', () => {
                expect(recorder.param('')).toEqual(jasmine.any(Recorder));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                recorder.param('left', 0.5);
                expect(recorder.param('left')).toEqual(0.5);
            });

            it('should return 1', () => {
                recorder.param('left', 1);
                expect(recorder.param('left')).toEqual(1);
            });

            it('should return 0', () => {
                recorder.param('left', 0);
                expect(recorder.param('left')).toEqual(0);
            });

            // Negative
            it('should return 1', () => {
                recorder.param('left', 1.1);
                expect(recorder.param('left')).toEqual(1);
            });

            it('should return 1', () => {
                recorder.param('left', -0.1);
                expect(recorder.param('left')).toEqual(1);
            });
        });

        describe('right', () => {
            afterEach(() => {
                recorder.param('right', 1);
            });

            // Getter
            // Positive
            it('should return 1', () => {
                expect(recorder.param('right')).toEqual(1);
            });

            // Negative
            it('should return the instance of `Recorder`', () => {
                expect(recorder.param('')).toEqual(jasmine.any(Recorder));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                recorder.param('right', 0.5);
                expect(recorder.param('right')).toEqual(0.5);
            });

            it('should return 1', () => {
                recorder.param('right', 1);
                expect(recorder.param('right')).toEqual(1);
            });

            it('should return 0', () => {
                recorder.param('right', 0);
                expect(recorder.param('right')).toEqual(0);
            });

            // Negative
            it('should return 1', () => {
                recorder.param('right', 1.1);
                expect(recorder.param('right')).toEqual(1);
            });

            it('should return 1', () => {
                recorder.param('right', -0.1);
                expect(recorder.param('right')).toEqual(1);
            });
        });
    });
});
