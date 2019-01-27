'use strict';

import { Filter } from '../../../../src/SoundModule/Effectors/Filter';

describe('Filter TEST', () => {
    describe('Filter#param', () => {
        const filter = new Filter(audiocontext, 1024);

        describe('type', () => {
            afterEach(() => {
                filter.param('type', 'lowpass');
            });

            // Getter
            // Positive
            it('should return "lowpass"', () => {
                expect(filter.param('type')).toEqual('lowpass');
            });

            // Negative
            it('should return the instance of `Filter`', () => {
                expect(filter.param('')).toEqual(jasmine.any(Filter));
            });

            // Setter
            // Positive
            it('should return "lowpass"', () => {
                filter.param('type', 'lowpass');
                expect(filter.param('type')).toEqual('lowpass');
            });

            it('should return "highpass"', () => {
                filter.param('type', 'highpass');
                expect(filter.param('type')).toEqual('highpass');
            });

            it('should return "bandpass"', () => {
                filter.param('type', 'bandpass');
                expect(filter.param('type')).toEqual('bandpass');
            });

            it('should return "lowshelf"', () => {
                filter.param('type', 'lowshelf');
                expect(filter.param('type')).toEqual('lowshelf');
            });

            it('should return "highshelf"', () => {
                filter.param('type', 'highshelf');
                expect(filter.param('type')).toEqual('highshelf');
            });

            it('should return "peaking"', () => {
                filter.param('type', 'peaking');
                expect(filter.param('type')).toEqual('peaking');
            });

            it('should return "notch"', () => {
                filter.param('type', 'notch');
                expect(filter.param('type')).toEqual('notch');
            });

            it('should return "allpass"', () => {
                filter.param('type', 'allpass');
                expect(filter.param('type')).toEqual('allpass');
            });

            // Negative
            it('should return "lowpass"', () => {
                filter.param('type', '');
                expect(filter.param('type')).toEqual('lowpass');
            });
        });

        describe('frequency', () => {
            afterEach(() => {
                filter.param('frequency', 350);
            });

            // Getter
            // Positive
            it('should return 350', () => {
                expect(filter.param('frequency')).toEqual(350);
            });

            // Negative
            it('should return the instance of `Filter`', () => {
                expect(filter.param('')).toEqual(jasmine.any(Filter));
            });

            // Setter
            // Positive
            it('should return 350.5', () => {
                filter.param('frequency', 350.5);
                expect(filter.param('frequency')).toEqual(350.5);
            });

            it('should return the Nyquist frequency (half the sample-rate)', () => {
                filter.param('frequency', (audiocontext.sampleRate / 2));
                expect(filter.param('frequency')).toEqual(audiocontext.sampleRate / 2);
            });

            it('should return 10', () => {
                filter.param('frequency', 10);
                expect(filter.param('frequency')).toEqual(10);
            });

            // Negative
            it('should return 350', () => {
                filter.param('frequency', ((audiocontext.sampleRate / 2) + 0.1));
                expect(filter.param('frequency')).toEqual(350);
            });

            it('should return 350', () => {
                filter.param('frequency', 9.9);
                expect(filter.param('frequency')).toEqual(350);
            });
        });

        describe('Q', () => {
            afterEach(() => {
                filter.param('Q', 1);
            });

            // Getter
            // Positive
            it('should return 1', () => {
                expect(filter.param('Q')).toEqual(1);
            });

            // Negative
            it('should return the instance of `Filter`', () => {
                expect(filter.param('')).toEqual(jasmine.any(Filter));
            });

            // Setter
            // Positive
            it('should return 1000', () => {
                filter.param('Q', 1000);
                expect(filter.param('Q')).toEqual(1000);
            });

            it('should return 0.00009999999747378752', () => {
                filter.param('Q', 0.0001);
                expect(filter.param('Q')).toEqual(0.00009999999747378752);
            });

            // Negative
            it('should return 1', () => {
                filter.param('Q', 1000.1);
                expect(filter.param('Q')).toEqual(1);
            });

            it('should return 1', () => {
                filter.param('Q', 0.00009999);
                expect(filter.param('Q')).toEqual(1);
            });
        });

        describe('gain', () => {
            afterEach(() => {
                filter.param('gain', 0);
            });

            // Getter
            // Positive
            it('should return 0', () => {
                expect(filter.param('gain')).toEqual(0);
            });

            // Negative
            it('should return the instance of `Filter`', () => {
                expect(filter.param('')).toEqual(jasmine.any(Filter));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                filter.param('gain', 0.5);
                expect(filter.param('gain')).toEqual(0.5);
            });

            it('should return 40', () => {
                filter.param('gain', 40);
                expect(filter.param('gain')).toEqual(40);
            });

            it('should return -40', () => {
                filter.param('gain', -40);
                expect(filter.param('gain')).toEqual(-40);
            });

            // Negative
            it('should return 0', () => {
                filter.param('gain', 40.1);
                expect(filter.param('gain')).toEqual(0);
            });

            it('should return 0', () => {
                filter.param('gain', -40.1);
                expect(filter.param('gain')).toEqual(0);
            });
        });

        describe('range', () => {
            afterEach(() => {
                filter.param('range', 0.1);
            });

            // Getter
            // Positive
            it('should return 0.1', () => {
                expect(filter.param('range')).toEqual(0.1);
            });

            // Negative
            it('should return the instance of `Filter`', () => {
                expect(filter.param('')).toEqual(jasmine.any(Filter));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                filter.param('range', 0.5);
                expect(filter.param('range')).toEqual(0.5);
            });

            it('should return 1', () => {
                filter.param('range', 1);
                expect(filter.param('range')).toEqual(1);
            });

            it('should return 0', () => {
                filter.param('range', 0);
                expect(filter.param('range')).toEqual(0);
            });

            // Negative
            it('should return 0.1', () => {
                filter.param('range', 1.1);
                expect(filter.param('range')).toEqual(0.1);
            });

            it('should return 0.1', () => {
                filter.param('range', -0.1);
                expect(filter.param('range')).toEqual(0.1);
            });
        });

        describe('attack', () => {
            afterEach(() => {
                filter.param('attack', 0.01);
            });

            // Getter
            // Positive
            it('should return 0.01', () => {
                expect(filter.param('attack')).toEqual(0.01);
            });

            // Negative
            it('should return the instance of `Filter`', () => {
                expect(filter.param('')).toEqual(jasmine.any(Filter));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                filter.param('attack', 0.5);
                expect(filter.param('attack')).toEqual(0.5);
            });

            it('should return 0', () => {
                filter.param('attack', 0);
                expect(filter.param('attack')).toEqual(0);
            });

            // Negative
            it('should return 0.01', () => {
                filter.param('attack', -0.1);
                expect(filter.param('attack')).toEqual(0.01);
            });
        });

        describe('decay', () => {
            afterEach(() => {
                filter.param('decay', 0.3);
            });

            // Getter
            // Positive
            it('should return 0.3', () => {
                expect(filter.param('decay')).toEqual(0.3);
            });

            // Negative
            it('should return the instance of `Filter`', () => {
                expect(filter.param('')).toEqual(jasmine.any(Filter));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                filter.param('decay', 0.5);
                expect(filter.param('decay')).toEqual(0.5);
            });

            // Negative
            it('should return 0.3', () => {
                filter.param('decay', 0);
                expect(filter.param('decay')).toEqual(0.3);
            });
        });

        describe('sustain', () => {
            afterEach(() => {
                filter.param('sustain', 1);
            });

            // Getter
            // Positive
            it('should return 1', () => {
                expect(filter.param('sustain')).toEqual(1);
            });

            // Negative
            it('should return the instance of `Filter`', () => {
                expect(filter.param('')).toEqual(jasmine.any(Filter));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                filter.param('sustain', 0.5);
                expect(filter.param('sustain')).toEqual(0.5);
            });

            it('should return 0', () => {
                filter.param('sustain', 0);
                expect(filter.param('sustain')).toEqual(0);
            });

            // Negative
            it('should return 1', () => {
                filter.param('sustain', -0.1);
                expect(filter.param('sustain')).toEqual(1);
            });
        });

        describe('release', () => {
            afterEach(() => {
                filter.param('release', 1);
            });

            // Getter
            // Positive
            it('should return 1', () => {
                expect(filter.param('release')).toEqual(1);
            });

            // Negative
            it('should return the instance of `Filter`', () => {
                expect(filter.param('')).toEqual(jasmine.any(Filter));
            });

            // Setter
            // Positive
            it('should return 0.5', () => {
                filter.param('release', 0.5);
                expect(filter.param('release')).toEqual(0.5);
            });

            // Negative
            it('should return 1', () => {
                filter.param('release', 0);
                expect(filter.param('release')).toEqual(1);
            });
        });
    });
});
