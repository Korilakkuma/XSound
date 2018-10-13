'use strict';

import { Visualizer } from '../../../../src/SoundModule/Analyser/Visualizer';

describe('Visualizer TEST', () => {
    describe('Visualizer#createFontString', () => {
        const visualizer = new Visualizer(audiocontext.sampleRate);

        it('should return "13px normal normal "Arial""', () => {
            expect(visualizer.createFontString()).toEqual('13px normal normal "Arial"');
        });
    });
});
