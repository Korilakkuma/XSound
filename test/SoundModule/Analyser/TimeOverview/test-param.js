'use strict';

import { TimeOverview } from '../../../../src/SoundModule/Analyser/TimeOverview';

describe('TimeOverview TEST', () => {
    describe('TimeOverview#param', () => {
        const timeOverview = new TimeOverview(audiocontext.sampleRate);

        describe('currentTime', () => {
            afterEach(() => {
                timeOverview.param('currentTime', 'rgba(0, 0, 0, 0.5)');
            });

            // Getter
            // Positive
            it('should return "rgba(255, 255, 255, 1.0)"', () => {
                expect(timeOverview.param('currentTime')).toEqual('rgba(0, 0, 0, 0.5)');
            });

            // Negative
            it('should return the instance of `TimeOverview`', () => {
                expect(timeOverview.param('')).toEqual(jasmine.any(TimeOverview));
            });

            // Setter
            it('should return "#cc0000"', () => {
                timeOverview.param('currentTime', '#cc0000');
                expect(timeOverview.param('currentTime')).toEqual('#cc0000');
            });
        });

        describe('plotInterval', () => {
            afterEach(() => {
                timeOverview.param('plotInterval', 0.0625);
            });

            // Getter
            // Positive
            it('should return 0.0625', () => {
                expect(timeOverview.param('plotInterval')).toEqual(0.0625);
            });

            // Negative
            it('should return the instance of `TimeOverview`', () => {
                expect(timeOverview.param('')).toEqual(jasmine.any(TimeOverview));
            });

            // Setter
            // Positive
            it('should return 0.05', () => {
                timeOverview.param('plotInterval', 0.05);
                expect(timeOverview.param('plotInterval')).toEqual(0.05);
            });

            // Negative
            it('should return 0.0625', () => {
                timeOverview.param('plotInterval', 0);
                expect(timeOverview.param('plotInterval')).toEqual(0.0625);
            });
        });

        describe('textInterval', () => {
            afterEach(() => {
                timeOverview.param('textInterval', 60);
            });

            // Getter
            // Positive
            it('should return 60', () => {
                expect(timeOverview.param('textInterval')).toEqual(60);
            });

            // Negative
            it('should return the instance of `TimeOverview`', () => {
                expect(timeOverview.param('')).toEqual(jasmine.any(TimeOverview));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                timeOverview.param('textInterval', 0.5);
                expect(timeOverview.param('textInterval')).toEqual(0.5);
            });

            // Negative
            it('should return 60', () => {
                timeOverview.param('textInterval', 0);
                expect(timeOverview.param('textInterval')).toEqual(60);
            });
        });
    });
});
