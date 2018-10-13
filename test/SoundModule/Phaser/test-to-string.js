'use strict';

import { Phaser } from '../../../src/SoundModule/Phaser';

describe('Phaser TEST', () => {
    describe('Phaser#toString', () => {
        const phaser = new Phaser(audiocontext, 1024);

        it('should return "[SoundModule Phaser]"', () => {
            expect(phaser.toString()).toEqual('[SoundModule Phaser]');
        });
    });
});
