'use strict';

import { Visualizer } from '../../../../src/SoundModule/Analyser/Visualizer';

describe('Visualizer TEST', () => {
    describe('Visualizer#createFontString', () => {
        const visualizer = new Visualizer(audiocontext.sampleRate);

        it('should return "normal 13px "Arial""', () => {
            expect(visualizer.createFontString()).toEqual('normal 13px "Arial"');
        });
    });
});
