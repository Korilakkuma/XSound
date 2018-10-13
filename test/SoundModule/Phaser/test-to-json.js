'use strict';

import { Phaser } from '../../../src/SoundModule/Phaser';

describe('Phaser TEST', () => {
    describe('Phaser#toJSON', () => {
        const phaser = new Phaser(audiocontext, 1024);

        it('should return JSON', () => {
            expect(phaser.toJSON()).toEqual('{"state":false,"stage":12,"frequency":350,"resonance":1,"depth":0,"rate":0,"mix":0,"feedback":0}');
        });
    });
});
