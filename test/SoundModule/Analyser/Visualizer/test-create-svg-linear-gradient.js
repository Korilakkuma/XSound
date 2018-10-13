'use strict';

import { Visualizer } from '../../../../src/SoundModule/Analyser/Visualizer';

describe('Visualizer TEST', () => {
    describe('Visualizer#createSVGLinearGradient', () => {
        const visualizer = new Visualizer(audiocontext.sampleRate);

        it('should return the instance of `SVGDefsElement`', () => {
            const defs           = visualizer.createSVGLinearGradient();
            const linearGradient = defs.firstElementChild;

            expect(defs).toEqual(jasmine.any(SVGDefsElement));
            expect(linearGradient).toEqual(jasmine.any(SVGLinearGradientElement));
        });
    });
});
