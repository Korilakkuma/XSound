'use strict';

import { EnvelopeGenerator } from '../../../src/SoundModule/EnvelopeGenerator';

describe('EnvelopeGenerator TEST', () => {
    describe('EnvelopeGenerator#toString', () => {
        const envelopegenerator = new EnvelopeGenerator(audiocontext);

        it('should return "[SoundModule EnvelopeGenerator]"', () => {
            expect(envelopegenerator.toString()).toEqual('[SoundModule EnvelopeGenerator]');
        });
    });
});
