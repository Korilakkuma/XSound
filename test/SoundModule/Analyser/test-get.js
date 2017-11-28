'use strict';

import Analyser from '../../../src/SoundModule/Analyser';

describe('Analyser TEST', () => {
    describe('Analyser#get', () => {
        const analyser = new Analyser(audiocontext);

        it('should return the instance of `AnalyserNode`', () => {
            expect(analyser.get()).toEqual(jasmine.any(AnalyserNode));
        });
    });
});
