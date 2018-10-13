'use strict';

import { Listener } from '../../../src/SoundModule/Listener';

describe('Listener TEST', () => {
    describe('Listener#toString', () => {
        const listener = new Listener(audiocontext);

        it('should return "[SoundModule Listener]"', () => {
            expect(listener.toString()).toEqual('[SoundModule Listener]');
        });
    });
});
