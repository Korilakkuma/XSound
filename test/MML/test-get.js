'use strict';

import { MML } from '../../src/MML';
import { OscillatorModule } from '../../src/OscillatorModule';

describe('MML TEST', () => {
    describe('MML#get', () => {
        const mml = new MML(audiocontext);

        mml.ready(new OscillatorModule(audiocontext), ['T74  O4  AF+DB2 AEB4 G+4 AF+C+2&AF+C+8 F+8 A8 R4', 'T74  O2  B2  O3  C+2 D1  O2  B2  O3  C+2 D2 E2  O2  A1 E1 F+2 E2  O3  DD1 EE1&EE1']);

        it('should return the string as MML', () => {
            const actual   = mml.get(0, true);
            const expected = 'T74  O4  AF+DB2 AEB4 G+4 AF+C+2&AF+C+8 F+8 A8 R4';

            expect(actual).toEqual(expected);
        });

        it('should return the string as MML', () => {
            const actual   = mml.get(1, true);
            const expected = 'T74  O2  B2  O3  C+2 D1  O2  B2  O3  C+2 D2 E2  O2  A1 E1 F+2 E2  O3  DD1 EE1&EE1';

            expect(actual).toEqual(expected);
        });

        it('should return the array that contains string as MML', () => {
            const actual   = mml.get(-1, true);
            const expected = ['T74  O4  AF+DB2 AEB4 G+4 AF+C+2&AF+C+8 F+8 A8 R4', 'T74  O2  B2  O3  C+2 D1  O2  B2  O3  C+2 D2 E2  O2  A1 E1 F+2 E2  O3  DD1 EE1&EE1'];

            expect(actual).toEqual(expected);
        });

        it('should return the array that contains performance information', () => {
            const actual   = mml.get(0, false);
            const expected = [
                { 'indexes' : ['R'],            'frequencies' : [0],                                                                            'start' : 6.081081081081081,  'duration' : 0.8108108108108109,  'stop' : 6.891891891891891,  'note' : 'R4' },
                { 'indexes' : [48],             'frequencies' : [440.00000000000017],                                                           'start' : 5.675675675675675,  'duration' : 0.40540540540540543, 'stop' : 6.081081081081081,  'note' : 'A8' },
                { 'indexes' : [45],             'frequencies' : [369.9944227116345],                                                            'start' : 5.27027027027027,   'duration' : 0.40540540540540543, 'stop' : 5.675675675675675,  'note' : 'F+8' },
                { 'indexes' : [48, 45, 40],     'frequencies' : [440.00000000000017, 369.9944227116345, 277.1826309768722],                     'start' : 3.2432432432432434, 'duration' : 2.027027027027027,   'stop' : 5.27027027027027,   'note' : 'AF+C+2&AF+C+8' },
                { 'indexes' : [47],             'frequencies' : [415.30469757994535],                                                           'start' : 2.4324324324324325, 'duration' : 0.8108108108108109,  'stop' : 3.2432432432432434, 'note' : 'G+4' },
                { 'indexes' : [48, 43, 38],     'frequencies' : [440.00000000000017, 329.62755691287015, 246.94165062806215],                   'start' : 1.6216216216216217, 'duration' : 0.8108108108108109,  'stop' : 2.4324324324324325, 'note' : 'AEB4' },
                { 'indexes' : [48, 45, 41, 38], 'frequencies' : [440.00000000000017, 369.9944227116345, 293.6647679174077, 246.94165062806215], 'start' : 0,                  'duration' : 1.6216216216216217,  'stop' : 1.6216216216216217, 'note' : 'AF+DB2' }
            ];

            actual.forEach((a, i) => {
                Object.keys(a).forEach(k => {
                    if ((k === 'indexes') || (k === 'note')) {
                        expect(a[k]).toEqual(expected[i][k]);
                    } else if ((k === 'start') || (k === 'duration') || (k === 'stop')) {
                        expect(a[k]).toBeCloseTo(expected[i][k], 3);
                    } else {
                        expected[i][k].forEach((e, j) => {
                            expect(a[k][j]).toBeCloseTo(e, 3);
                        });
                    }
                });
            });
        });

        it('should return the array that contains performance information', () => {
            const actual = mml.get(1, false);
            const expected = [
                { 'indexes' : [31, 19], 'frequencies' : [164.81377845643502, 82.40688922821751], 'start' : 25.94594594594594,  'duration' : 6.486486486486487,  'stop' : 32.43243243243243,  'note' : 'EE1&EE1' },
                { 'indexes' : [29, 17], 'frequencies' : [146.83238395870382, 73.41619197935191], 'start' : 22.702702702702698, 'duration' : 3.2432432432432434, 'stop' : 25.94594594594594,  'note' : 'DD1' },
                { 'indexes' : [19],     'frequencies' : [82.40688922821751],                     'start' : 21.081081081081077, 'duration' : 1.6216216216216217, 'stop' : 22.702702702702698, 'note' : 'E2' },
                { 'indexes' : [21],     'frequencies' : [92.49860567790861],                     'start' : 19.459459459459456, 'duration' : 1.6216216216216217, 'stop' : 21.081081081081077, 'note' : 'F+2' },
                { 'indexes' : [19],     'frequencies' : [82.40688922821751],                     'start' : 16.216216216216214, 'duration' : 3.2432432432432434, 'stop' : 19.459459459459456, 'note' : 'E1' },
                { 'indexes' : [24],     'frequencies' : [110.00000000000003],                    'start' : 12.972972972972972, 'duration' : 3.2432432432432434, 'stop' : 16.216216216216214, 'note' : 'A1' },
                { 'indexes' : [31],     'frequencies' : [164.81377845643502],                    'start' : 11.35135135135135,  'duration' : 1.6216216216216217, 'stop' : 12.972972972972972, 'note' : 'E2' },
                { 'indexes' : [29],     'frequencies' : [146.83238395870382],                    'start' : 9.72972972972973,   'duration' : 1.6216216216216217, 'stop' : 11.35135135135135,  'note' : 'D2' },
                { 'indexes' : [28],     'frequencies' : [138.59131548843607],                    'start' : 8.108108108108109,  'duration' : 1.6216216216216217, 'stop' : 9.72972972972973,   'note' : 'C+2' },
                { 'indexes' : [26],     'frequencies' : [123.47082531403106],                    'start' : 6.486486486486487,  'duration' : 1.6216216216216217, 'stop' : 8.108108108108109,  'note' : 'B2' },
                { 'indexes' : [29],     'frequencies' : [146.83238395870382],                    'start' : 3.2432432432432434, 'duration' : 3.2432432432432434, 'stop' : 6.486486486486487,  'note' : 'D1' },
                { 'indexes' : [28],     'frequencies' : [138.59131548843607],                    'start' : 1.6216216216216217, 'duration' : 1.6216216216216217, 'stop' : 3.2432432432432434, 'note' : 'C+2' },
                { 'indexes' : [26],     'frequencies' : [123.47082531403106],                    'start' : 0,                  'duration' : 1.6216216216216217, 'stop' : 1.6216216216216217, 'note' : 'B2' }
            ];

            actual.forEach((a, i) => {
                Object.keys(a).forEach(k => {
                    if ((k === 'indexes') || (k === 'note')) {
                        expect(a[k]).toEqual(expected[i][k]);
                    } else if ((k === 'start') || (k === 'duration') || (k === 'stop')) {
                        expect(a[k]).toBeCloseTo(expected[i][k], 3);
                    } else {
                        expected[i][k].forEach((e, j) => {
                            expect(a[k][j]).toBeCloseTo(e, 3);
                        });
                    }
                });
            });
        });

        it('should return the array that contains performance information', () => {
            const actual = mml.get();
            const expected = [
                [
                    { 'indexes' : ['R'],            'frequencies' : [0],                                                                            'start' : 6.081081081081081,  'duration' : 0.8108108108108109,  'stop' : 6.891891891891891,  'note' : 'R4' },
                    { 'indexes' : [48],             'frequencies' : [440.00000000000017],                                                           'start' : 5.675675675675675,  'duration' : 0.40540540540540543, 'stop' : 6.081081081081081,  'note' : 'A8' },
                    { 'indexes' : [45],             'frequencies' : [369.9944227116345],                                                            'start' : 5.27027027027027,   'duration' : 0.40540540540540543, 'stop' : 5.675675675675675,  'note' : 'F+8' },
                    { 'indexes' : [48, 45, 40],     'frequencies' : [440.00000000000017, 369.9944227116345, 277.1826309768722],                     'start' : 3.2432432432432434, 'duration' : 2.027027027027027,   'stop' : 5.27027027027027,   'note' : 'AF+C+2&AF+C+8' },
                    { 'indexes' : [47],             'frequencies' : [415.30469757994535],                                                           'start' : 2.4324324324324325, 'duration' : 0.8108108108108109,  'stop' : 3.2432432432432434, 'note' : 'G+4' },
                    { 'indexes' : [48, 43, 38],     'frequencies' : [440.00000000000017, 329.62755691287015, 246.94165062806215],                   'start' : 1.6216216216216217, 'duration' : 0.8108108108108109,  'stop' : 2.4324324324324325, 'note' : 'AEB4' },
                    { 'indexes' : [48, 45, 41, 38], 'frequencies' : [440.00000000000017, 369.9944227116345, 293.6647679174077, 246.94165062806215], 'start' : 0,                  'duration' : 1.6216216216216217,  'stop' : 1.6216216216216217, 'note' : 'AF+DB2' }
                ],
                [
                    { 'indexes' : [31, 19], 'frequencies' : [164.81377845643502, 82.40688922821751], 'start' : 25.94594594594594,  'duration' : 6.486486486486487,  'stop' : 32.43243243243243,  'note' : 'EE1&EE1' },
                    { 'indexes' : [29, 17], 'frequencies' : [146.83238395870382, 73.41619197935191], 'start' : 22.702702702702698, 'duration' : 3.2432432432432434, 'stop' : 25.94594594594594,  'note' : 'DD1' },
                    { 'indexes' : [19],     'frequencies' : [82.40688922821751],                     'start' : 21.081081081081077, 'duration' : 1.6216216216216217, 'stop' : 22.702702702702698, 'note' : 'E2' },
                    { 'indexes' : [21],     'frequencies' : [92.49860567790861],                     'start' : 19.459459459459456, 'duration' : 1.6216216216216217, 'stop' : 21.081081081081077, 'note' : 'F+2' },
                    { 'indexes' : [19],     'frequencies' : [82.40688922821751],                     'start' : 16.216216216216214, 'duration' : 3.2432432432432434, 'stop' : 19.459459459459456, 'note' : 'E1' },
                    { 'indexes' : [24],     'frequencies' : [110.00000000000003],                    'start' : 12.972972972972972, 'duration' : 3.2432432432432434, 'stop' : 16.216216216216214, 'note' : 'A1' },
                    { 'indexes' : [31],     'frequencies' : [164.81377845643502],                    'start' : 11.35135135135135,  'duration' : 1.6216216216216217, 'stop' : 12.972972972972972, 'note' : 'E2' },
                    { 'indexes' : [29],     'frequencies' : [146.83238395870382],                    'start' : 9.72972972972973,   'duration' : 1.6216216216216217, 'stop' : 11.35135135135135,  'note' : 'D2' },
                    { 'indexes' : [28],     'frequencies' : [138.59131548843607],                    'start' : 8.108108108108109,  'duration' : 1.6216216216216217, 'stop' : 9.72972972972973,   'note' : 'C+2' },
                    { 'indexes' : [26],     'frequencies' : [123.47082531403106],                    'start' : 6.486486486486487,  'duration' : 1.6216216216216217, 'stop' : 8.108108108108109,  'note' : 'B2' },
                    { 'indexes' : [29],     'frequencies' : [146.83238395870382],                    'start' : 3.2432432432432434, 'duration' : 3.2432432432432434, 'stop' : 6.486486486486487,  'note' : 'D1' },
                    { 'indexes' : [28],     'frequencies' : [138.59131548843607],                    'start' : 1.6216216216216217, 'duration' : 1.6216216216216217, 'stop' : 3.2432432432432434, 'note' : 'C+2' },
                    { 'indexes' : [26],     'frequencies' : [123.47082531403106],                    'start' : 0,                  'duration' : 1.6216216216216217, 'stop' : 1.6216216216216217, 'note' : 'B2' }
                ]
            ];

            actual[0].forEach((a, i) => {
                Object.keys(a).forEach(k => {
                    if ((k === 'indexes') || (k === 'note')) {
                        expect(a[k]).toEqual(expected[0][i][k]);
                    } else if ((k === 'start') || (k === 'duration') || (k === 'stop')) {
                        expect(a[k]).toBeCloseTo(expected[0][i][k], 3);
                    } else {
                        expected[0][i][k].forEach((e, j) => {
                            expect(a[k][j]).toBeCloseTo(e, 3);
                        });
                    }
                });
            });

            actual[1].forEach((a, i) => {
                Object.keys(a).forEach(k => {
                    if ((k === 'indexes') || (k === 'note')) {
                        expect(a[k]).toEqual(expected[1][i][k]);
                    } else if ((k === 'start') || (k === 'duration') || (k === 'stop')) {
                        expect(a[k]).toBeCloseTo(expected[1][i][k], 3);
                    } else {
                        expected[1][i][k].forEach((e, j) => {
                            expect(a[k][j]).toBeCloseTo(e, 3);
                        });
                    }
                });
            });
        });
    });
});
