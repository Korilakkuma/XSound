'use strict';

import Listener from '../../../src/SoundModule/Listener';

describe('Listener TEST', () => {
    describe('Listener#params', () => {
        const listener = new Listener(audiocontext);

        it('should return associative array', () => {
            expect(listener.params()).toEqual({
                'positions' : { 'x' : 0, 'y' : 0, 'z' : 0 },
                'fronts'    : { 'x' : 0, 'y' : 0, 'z' : -1 },
                'ups'       : { 'x' : 0, 'y' : 1, 'z' : 0 }
            });
        });
    });
});
