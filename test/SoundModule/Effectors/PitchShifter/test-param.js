'use strict';

import { PitchShifter } from '../../../../src/SoundModule/Effectors/PitchShifter';

describe('PitchShifter TEST', () => {
    describe('PitchShifter#param', () => {
        const tremolo = new PitchShifter(audiocontext, 1024);

        describe('pitch', () => {
            afterEach(() => {
                tremolo.param('pitch', 1);
            });

            // Getter
            // Positive
            it('should return 1', () => {
                expect(tremolo.param('pitch')).toEqual(1);
            });

            // Negative
            it('should return the instance of `PitchShifter`', () => {
                expect(tremolo.param('')).toEqual(jasmine.any(PitchShifter));
            });

            // Setter
            // Positive
            it('should return 1.5', () => {
                tremolo.param('pitch', 1.5);
                expect(tremolo.param('pitch')).toEqual(1.5);
            });

            it('should return 0.05', () => {
                tremolo.param('pitch', 0.05);
                expect(tremolo.param('pitch')).toEqual(0.05);
            });

            // Negative
            it('should return 1', () => {
                tremolo.param('pitch', 0);
                expect(tremolo.param('pitch')).toEqual(1);
            });
        });
    });
});
