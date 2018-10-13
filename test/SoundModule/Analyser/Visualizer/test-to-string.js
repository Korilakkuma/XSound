'use strict';

import { Visualizer } from '../../../../src/SoundModule/Analyser/Visualizer';

describe('Visualizer TEST', () => {
    describe('Visualizer#toString', () => {
        const visualizer = new Visualizer(audiocontext.sampleRate);

        it('should return "[SoundModule Analyser Visualizer]"', () => {
            expect(visualizer.toString()).toEqual('[SoundModule Analyser Visualizer]');
        });
    });
});
