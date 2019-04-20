'use strict';

import { AudioModule } from '../../src/AudioModule';

describe('AudioModule TEST', () => {
    describe('AudioModule#fadeIn', () => {
        const audioModule = new AudioModule(audiocontext);

        afterEach(() => {
            audioModule.fadeIn(0);
        });

        // Getter
        // Positive
        it('should return 0', () => {
            expect(audioModule.fadeIn()).toEqual(0);
        });

        // Negative
        it('should return the instance of `AudioModule`', () => {
            expect(audioModule.fadeIn('')).toEqual(jasmine.any(AudioModule));
        });

        // Setter
        // Positive
        it('should return 0.5', () => {
            audioModule.fadeIn(0.5);
            expect(audioModule.fadeIn()).toEqual(0.5);
        });

        it('should return 1', () => {
            audioModule.fadeIn(1);
            expect(audioModule.fadeIn()).toEqual(1);
        });

        it('should return 0', () => {
            audioModule.fadeIn(0);
            expect(audioModule.fadeIn()).toEqual(0);
        });

        // Negative
        it('should return 0', () => {
            audioModule.fadeIn(-0.1);
            expect(audioModule.fadeIn()).toEqual(0);
        });
    });
});
