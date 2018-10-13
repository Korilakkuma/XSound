'use strict';

import { Panner } from '../../../src/SoundModule/Panner';

describe('Panner TEST', () => {
    describe('Panner#param', () => {
        const panner = new Panner(audiocontext, 1024);

        describe('x', () => {
            afterEach(() => {
                panner.param('x', 0);
            });

            // Getter
            // Positive
            it('should return 0', () => {
                expect(panner.param('x')).toEqual(0);
            });

            // Negative
            it('should return the instance of `Panner`', () => {
                expect(panner.param('')).toEqual(jasmine.any(Panner));
            });

            // Setter
            // Positive
            it('should return 1000.5', () => {
                panner.param('x', 1000.5);
                expect(panner.param('x')).toEqual(1000.5);
            });
            it('should return -1000.5', () => {
                panner.param('x', -1000.5);
                expect(panner.param('x')).toEqual(-1000.5);
            });

            // Negative
            it('should return 0', () => {
                panner.param('x', '');
                expect(panner.param('x')).toEqual(0);
            });
        });

        describe('y', () => {
            afterEach(() => {
                panner.param('y', 0);
            });

            // Getter
            // Positive
            it('should return 0', () => {
                expect(panner.param('y')).toEqual(0);
            });

            // Negative
            it('should return the instance of `Panner`', () => {
                expect(panner.param('')).toEqual(jasmine.any(Panner));
            });

            // Setter
            // Positive
            it('should return 1000.5', () => {
                panner.param('y', 1000.5);
                expect(panner.param('y')).toEqual(1000.5);
            });

            it('should return -1000.5', () => {
                panner.param('y', -1000.5);
                expect(panner.param('y')).toEqual(-1000.5);
            });

            // Negative
            it('should return 0', () => {
                panner.param('y', '');
                expect(panner.param('y')).toEqual(0);
            });
        });

        describe('z', () => {
            afterEach(() => {
                panner.param('z', 0);
            });

            // Getter
            // Positive
            it('should return 0', () => {
                expect(panner.param('z')).toEqual(0);
            });

            // Negative
            it('should return the instance of `Panner`', () => {
                expect(panner.param('')).toEqual(jasmine.any(Panner));
            });

            // Setter
            // Positive
            it('should return 1000.5', () => {
                panner.param('z', 1000.5);
                expect(panner.param('z')).toEqual(1000.5);
            });

            it('should return -1000.5', () => {
                panner.param('z', -1000.5);
                expect(panner.param('z')).toEqual(-1000.5);
            });

            // Negative
            it('should return 0', () => {
                panner.param('z', '');
                expect(panner.param('z')).toEqual(0);
            });
        });

        describe('ox', () => {
            afterEach(() => {
                panner.param('ox', 1);
            });

            // Getter
            // Positive
            it('should return 1', () => {
                expect(panner.param('ox')).toEqual(1);
            });

            // Negative
            it('should return the instance of `Panner`', () => {
                expect(panner.param('')).toEqual(jasmine.any(Panner));
            });

            // Setter
            // Positive
            it('should return 1000.5', () => {
                panner.param('ox', 1000.5);
                expect(panner.param('ox')).toEqual(1000.5);
            });

            it('should return -1000.5', () => {
                panner.param('ox', -1000.5);
                expect(panner.param('ox')).toEqual(-1000.5);
            });

            // Negative
            it('should return 1', () => {
                panner.param('ox', '');
                expect(panner.param('ox')).toEqual(1);
            });

        });

        describe('oy', () => {
            afterEach(() => {
                panner.param('oy', 0);
            });

            // Getter
            // Positive
            it('should return 0', () => {
                expect(panner.param('oy')).toEqual(0);
            });

            // Negative
            it('should return the instance of `Panner`', () => {
                expect(panner.param('')).toEqual(jasmine.any(Panner));
            });

            // Setter
            // Positive
            it('should return 1000.5', () => {
                panner.param('oy', 1000.5);
                expect(panner.param('oy')).toEqual(1000.5);
            });

            it('should return -1000.5', () => {
                panner.param('oy', -1000.5);
                expect(panner.param('oy')).toEqual(-1000.5);
            });

            // Negative
            it('should return 0', () => {
                panner.param('oy', '');
                expect(panner.param('oy')).toEqual(0);
            });
        });

        describe('oz', () => {
            afterEach(() => {
                panner.param('oz', 0);
            });

            // Getter
            // Positive
            it('should return 0', () => {
                expect(panner.param('oz')).toEqual(0);
            });

            // Negative
            it('should return the instance of `Panner`', () => {
                expect(panner.param('')).toEqual(jasmine.any(Panner));
            });

            // Setter
            // Positive
            it('should return 1000.5', () => {
                panner.param('oz', 1000.5);
                expect(panner.param('oz')).toEqual(1000.5);
            });

            it('should return -1000.5', () => {
                panner.param('oz', -1000.5);
                expect(panner.param('oz')).toEqual(-1000.5);
            });

            // Negative
            it('should return 0', () => {
                panner.param('oz', '');
                expect(panner.param('oz')).toEqual(0);
            });
        });

        describe('refdistance', () => {
            afterEach(() => {
                panner.param('refdistance', 1);
            });

            // Getter
            // Positive
            it('should return 1', () => {
                expect(panner.param('refdistance')).toEqual(1);
            });

            // Negative
            it('should return the instance of `Panner`', () => {
                expect(panner.param('')).toEqual(jasmine.any(Panner));
            });

            // Setter
            // Positive
            it('should return 1000.5', () => {
                panner.param('refdistance', 1000.5);
                expect(panner.param('refdistance')).toEqual(1000.5);
            });

            it('should return 0', () => {
                panner.param('refdistance', 0);
                expect(panner.param('refdistance')).toEqual(0);
            });

            // Negative
            it('should return 1', () => {
                panner.param('refdistance', -0.1);
                expect(panner.param('refdistance')).toEqual(1);
            });
        });

        describe('maxDistance', () => {
            afterEach(() => {
                panner.param('maxDistance', 10000);
            });

            // Getter
            // Positive
            it('should return 10000', () => {
                expect(panner.param('maxDistance')).toEqual(10000);
            });

            // Negative
            it('should return the instance of `Panner`', () => {
                expect(panner.param('')).toEqual(jasmine.any(Panner));
            });

            // Setter
            // Positive
            it('should return 1000.5', () => {
                panner.param('maxDistance', 1000.5);
                expect(panner.param('maxDistance')).toEqual(1000.5);
            });

            it('should return 0.5', () => {
                panner.param('maxDistance', 0.5);
                expect(panner.param('maxDistance')).toEqual(0.5);
            });

            // Negative
            it('should return 10000', () => {
                panner.param('maxDistance', 0);
                expect(panner.param('maxDistance')).toEqual(10000);
            });
        });

        describe('rolloffFactor', () => {
            afterEach(() => {
                panner.param('rolloffFactor', 1);
            });

            // Getter
            // Positive
            it('should return 1', () => {
                expect(panner.param('rolloffFactor')).toEqual(1);
            });

            // Negative
            it('should return the instance of `Panner`', () => {
                expect(panner.param('')).toEqual(jasmine.any(Panner));
            });

            // Setter
            // Positive
            it('should return 1000.5', () => {
                panner.param('rolloffFactor', 1000.5);
                expect(panner.param('rolloffFactor')).toEqual(1000.5);
            });

            it('should return -1000.5', () => {
                panner.param('rolloffFactor', -1000.5);
                expect(panner.param('rolloffFactor')).toEqual(-1000.5);
            });

            // Negative
            it('should return 1', () => {
                panner.param('rolloffFactor', '');
                expect(panner.param('rolloffFactor')).toEqual(1);
            });
        });

        describe('coneInnerAngle', () => {
            afterEach(() => {
                panner.param('coneInnerAngle', 360);
            });

            // Getter
            // Positive
            it('should return 1', () => {
                expect(panner.param('coneInnerAngle')).toEqual(360);
            });

            // Negative
            it('should return the instance of `Panner`', () => {
                expect(panner.param('')).toEqual(jasmine.any(Panner));
            });

            // Setter
            // Positive
            it('should return 360.5', () => {
                panner.param('coneInnerAngle', 360.5);
                expect(panner.param('coneInnerAngle')).toEqual(360.5);
            });

            it('should return -1000.5', () => {
                panner.param('coneInnerAngle', -360.5);
                expect(panner.param('coneInnerAngle')).toEqual(-360.5);
            });

            // Negative
            it('should return 360', () => {
                panner.param('coneInnerAngle', '');
                expect(panner.param('coneInnerAngle')).toEqual(360);
            });
        });

        describe('coneOuterAngle', () => {
            afterEach(() => {
                panner.param('coneOuterAngle', 360);
            });

            // Getter
            // Positive
            it('should return 1', () => {
                expect(panner.param('coneOuterAngle')).toEqual(360);
            });

            // Negative
            it('should return the instance of `Panner`', () => {
                expect(panner.param('')).toEqual(jasmine.any(Panner));
            });

            // Setter
            // Positive
            it('should return 360.5', () => {
                panner.param('coneOuterAngle', 360.5);
                expect(panner.param('coneOuterAngle')).toEqual(360.5);
            });

            it('should return -1000.5', () => {
                panner.param('coneOuterAngle', -360.5);
                expect(panner.param('coneOuterAngle')).toEqual(-360.5);
            });

            // Negative
            it('should return 360', () => {
                panner.param('coneOuterAngle', '');
                expect(panner.param('coneOuterAngle')).toEqual(360);
            });
        });

        describe('coneOuterGain', () => {
            afterEach(() => {
                panner.param('coneOuterGain', 0);
            });

            // Getter
            // Positive
            it('should return 0', () => {
                expect(panner.param('coneOuterGain')).toEqual(0);
            });

            // Negative
            it('should return the instance of `Panner`', () => {
                expect(panner.param('')).toEqual(jasmine.any(Panner));
            });

            // Setter
            // Positive
            it('should return 1000.5', () => {
                panner.param('coneOuterGain', 1000.5);
                expect(panner.param('coneOuterGain')).toEqual(1000.5);
            });

            it('should return -1000.5', () => {
                panner.param('coneOuterGain', -1000.5);
                expect(panner.param('coneOuterGain')).toEqual(-1000.5);
            });

            // Negative
            it('should return 0', () => {
                panner.param('coneOuterGain', '');
                expect(panner.param('coneOuterGain')).toEqual(0);
            });
        });

        describe('panningModel', () => {
            afterEach(() => {
                panner.param('panningModel', 'HRTF');
            });

            // Getter
            // Positive
            it('should return "HRTF"', () => {
                expect(panner.param('panningModel')).toEqual('HRTF');
            });

            // Negative
            it('should return the instance of `Panner`', () => {
                expect(panner.param('')).toEqual(jasmine.any(Panner));
            });

            // Setter
            // Positive
            it('should return "HRTF"', () => {
                panner.param('panningModel', 'HRTF');
                expect(panner.param('panningModel')).toEqual('HRTF');
            });

            it('should return "equalpower"', () => {
                panner.param('panningModel', 'equalpower');
                expect(panner.param('panningModel')).toEqual('equalpower');
            });

            // Negative
            it('should return "HRTF"', () => {
                panner.param('panningModel', '');
                expect(panner.param('panningModel')).toEqual('HRTF');
            });
        });

        describe('distanceModel', () => {
            afterEach(() => {
                panner.param('distanceModel', 'inverse');
            });

            // Getter
            // Positive
            it('should return "inverse"', () => {
                expect(panner.param('distanceModel')).toEqual('inverse');
            });

            // Negative
            it('should return the instance of `Panner`', () => {
                expect(panner.param('')).toEqual(jasmine.any(Panner));
            });

            // Setter
            // Positive
            it('should return "linear"', () => {
                panner.param('distanceModel', 'linear');
                expect(panner.param('distanceModel')).toEqual('linear');
            });

            it('should return "inverse"', () => {
                panner.param('distanceModel', 'inverse');
                expect(panner.param('distanceModel')).toEqual('inverse');
            });

            it('should return "exponential"', () => {
                panner.param('distanceModel', 'exponential');
                expect(panner.param('distanceModel')).toEqual('exponential');
            });

            // Negative
            it('should return "inverse"', () => {
                panner.param('distanceModel', '');
                expect(panner.param('distanceModel')).toEqual('inverse');
            });
        });
    });
});
