'use strict';

import { MML } from '../../src/MML';

describe('MML TEST', () => {
    describe('MML#toABC', () => {
        const mml = new MML(audiocontext);

        it('should return `true`', () => {
            expect(mml.toABC('T74 O4 C4 C4 G4 G4 A4 A4 G2 F4 F4 E4 E4 D4 D4 C2 G4 G4 F4 F4 E4 E4 D2 G4 G4 F4 F4 E4 E4 D2 C4 C4 G4 G4 A4 A4 G2 F4 F4 E4 E4 D4 D4 C2')).toEqual('X:1\nT:\nM:4/4\nL:1/256\nK:\nQ:1/4=74\nC64 C64 G64 G64 A64 A64 G128 F64 F64 E64 E64 D64 D64 C128 G64 G64 F64 F64 E64 E64 D128 G64 G64 F64 F64 E64 E64 D128 C64 C64 G64 G64 A64 A64 G128 F64 F64 E64 E64 D64 D64 C128 ');
        });
    });
});
