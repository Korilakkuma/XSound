'use strict';

import MML from '../../src/MML';
import OscillatorModule from '../../src/OscillatorModule';

describe('MML TEST', () => {
    describe('MML#isSequences', () => {
        const mml = new MML(audiocontext);

        it('should return `false`', () => {
            mml.ready(null, []);
            expect(mml.isSequences()).toBeFalsy();
        });

        it('should return `true`', () => {
            mml.ready(new OscillatorModule(audiocontext), ['T74  O4  AF+DB2 AEB4 G+4 AF+C+2&AF+C+8 F+8 A8 R4', 'T74  O2  B2  O3  C+2 D1  O2  B2  O3  C+2 D2 E2  O2  A1 E1 F+2 E2  O3  DD1 EE1&EE1']);
            expect(mml.isSequences()).toBeTruthy();
        });
    });
});
