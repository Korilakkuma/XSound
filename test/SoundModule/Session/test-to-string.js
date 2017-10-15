'use strict';

import Session from '../../../src/SoundModule/Session';
import Analyser from '../../../src/SoundModule/Analyser';

describe('Session TEST', () => {
    describe('Session#toString', () => {
        const session = new Session(audiocontext, 1024, 2, 2, new Analyser(audiocontext));

        it('should return "[SoundModule Session]"', () => {
            expect(session.toString()).toEqual('[SoundModule Session]');
        });
    });
});
