'use strict';

import Analyser from '../../../src/SoundModule/Analyser';

describe('Analyser TEST', () => {
    describe('Analyser#toString', () => {
        const analyser = new Analyser(audiocontext);

        it('should return "[SoundModule Analyser]"', () => {
            expect(analyser.toString()).toEqual('[SoundModule Analyser]');
        });
    });
});
