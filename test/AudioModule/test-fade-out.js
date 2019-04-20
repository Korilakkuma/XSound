'use strict';

import { AudioModule } from '../../src/AudioModule';

describe('AudioModule TEST', () => {
    describe('AudioModule#fadeOut', () => {
        const audioModule = new AudioModule(audiocontext);

        beforeEach(() => {
            audioModule.fadeOut(0.01);
        });

        // Getter
        // Positive
        it('should return 0.01', () => {
            expect(audioModule.fadeOut()).toEqual(0.01);
        });

        // Negative
        it('should return the instance of `AudioModule`', () => {
            expect(audioModule.fadeOut('')).toEqual(jasmine.any(AudioModule));
        });

        // Setter
        // Positive
        it('should return 0.5', () => {
            audioModule.fadeOut(0.5);
            expect(audioModule.fadeOut()).toEqual(0.5);
        });

        it('should return 1', () => {
            audioModule.fadeOut(1);
            expect(audioModule.fadeOut()).toEqual(1);
        });

        it('should return 0.01', () => {
            audioModule.fadeOut(0.01);
            expect(audioModule.fadeOut()).toEqual(0.01);
        });

        // Negative
        it('should return 0.01', () => {
            audioModule.fadeOut(0);
            expect(audioModule.fadeOut()).toEqual(0.01);
        });
    });
});
