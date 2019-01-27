'use strict';

import { EnvelopeGenerator } from '../../../../src/SoundModule/Effectors/EnvelopeGenerator';

describe('EnvelopeGenerator TEST', () => {
    describe('EnvelopeGenerator#params', () => {
        const envelopegenerator = new EnvelopeGenerator(audiocontext);

        it('should return associative array', () => {
            expect(envelopegenerator.params()).toEqual({
                'attack'  : 0.01,
                'decay'   : 0.3,
                'sustain' : 0.5,
                'release' : 1
            });
        });
    });
});
