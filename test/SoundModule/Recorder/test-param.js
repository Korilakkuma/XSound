'use strict';

import Recorder from '../../../src/SoundModule/Recorder';

describe('Recorder TEST', () => {
    describe('Recorder#param', () => {
        const recorder = new Recorder(audiocontext, 1024, 2, 2);

        describe('gainL', () => {
            afterEach(() => {
                recorder.param('gainL', 1);
            });

            // Getter
            // Positive
            it('should return 1', () => {
                expect(recorder.param('gainL')).toEqual(1);
            });

            // Negative
            it('should return the instance of `Recorder`', () => {
                expect(recorder.param('')).toEqual(jasmine.any(Recorder));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                recorder.param('gainL', 0.5);
                expect(recorder.param('gainL')).toEqual(0.5);
            });

            it('should return 1', () => {
                recorder.param('gainL', 1);
                expect(recorder.param('gainL')).toEqual(1);
            });

            it('should return 0', () => {
                recorder.param('gainL', 0);
                expect(recorder.param('gainL')).toEqual(0);
            });

            // Negative
            it('should return 1', () => {
                recorder.param('gainL', 1.1);
                expect(recorder.param('gainL')).toEqual(1);
            });

            it('should return 1', () => {
                recorder.param('gainL', -0.1);
                expect(recorder.param('gainL')).toEqual(1);
            });
        });

        describe('gainR', () => {
            afterEach(() => {
                recorder.param('gainR', 1);
            });

            // Getter
            // Positive
            it('should return 1', () => {
                expect(recorder.param('gainR')).toEqual(1);
            });

            // Negative
            it('should return the instance of `Recorder`', () => {
                expect(recorder.param('')).toEqual(jasmine.any(Recorder));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                recorder.param('gainR', 0.5);
                expect(recorder.param('gainR')).toEqual(0.5);
            });

            it('should return 1', () => {
                recorder.param('gainR', 1);
                expect(recorder.param('gainR')).toEqual(1);
            });

            it('should return 0', () => {
                recorder.param('gainR', 0);
                expect(recorder.param('gainR')).toEqual(0);
            });

            // Negative
            it('should return 1', () => {
                recorder.param('gainR', 1.1);
                expect(recorder.param('gainR')).toEqual(1);
            });

            it('should return 1', () => {
                recorder.param('gainR', -0.1);
                expect(recorder.param('gainR')).toEqual(1);
            });
        });
    });
});
