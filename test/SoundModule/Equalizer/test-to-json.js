'use strict';

import { Equalizer } from '../../../src/SoundModule/Equalizer';

describe('Equalizer TEST', () => {
    describe('Equalizer#toJSON', () => {
        const equalizer = new Equalizer(audiocontext, 1024);

        it('should return JSON', () => {
            expect(equalizer.toJSON()).toEqual('{"state":false,"bass":0,"middle":0,"treble":0,"presence":0}');
        });
    });
});
