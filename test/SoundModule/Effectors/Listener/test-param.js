'use strict';

import { Listener } from '../../../../src/SoundModule/Effectors/Listener';

describe('Listener TEST', () => {
    describe('Listener#param', () => {
        const listener = new Listener(audiocontext);

        describe('x', () => {
            afterEach(() => {
                listener.param('x', 0);
            });

            // Getter
            // Positive
            it('should return 0', () => {
                expect(listener.param('x')).toEqual(0);
            });

            // Negative
            it('should return the instance of `Listener`', () => {
                expect(listener.param('')).toEqual(jasmine.any(Listener));
            });

            // Setter
            // Positive
            it('should return 1000.5', () => {
                listener.param('x', 1000.5);
                expect(listener.param('x')).toEqual(1000.5);
            });

            it('should return -1000.5', () => {
                listener.param('x', -1000.5);
                expect(listener.param('x')).toEqual(-1000.5);
            });

            // Negative
            it('should return 0', () => {
                listener.param('x', '');
                expect(listener.param('x')).toEqual(0);
            });
        });

        describe('y', () => {
            afterEach(() => {
                listener.param('y', 0);
            });

            // Getter
            // Positive
            it('should return 0', () => {
                expect(listener.param('y')).toEqual(0);
            });

            // Negative
            it('should return the instance of `Listener`', () => {
                expect(listener.param('')).toEqual(jasmine.any(Listener));
            });

            // Setter
            // Positive
            it('should return 1000.5', () => {
                listener.param('y', 1000.5);
                expect(listener.param('y')).toEqual(1000.5);
            });

            it('should return -1000.5', () => {
                listener.param('y', -1000.5);
                expect(listener.param('y')).toEqual(-1000.5);
            });

            // Negative
            it('should return 0', () => {
                listener.param('y', '');
                expect(listener.param('y')).toEqual(0);
            });
        });

        describe('z', () => {
            afterEach(() => {
                listener.param('z', 0);
            });

            // Getter
            // Positive
            it('should return 0', () => {
                expect(listener.param('z')).toEqual(0);
            });

            // Negative
            it('should return the instance of `Listener`', () => {
                expect(listener.param('')).toEqual(jasmine.any(Listener));
            });

            // Setter
            // Positive
            it('should return 1000.5', () => {
                listener.param('z', 1000.5);
                expect(listener.param('z')).toEqual(1000.5);
            });

            it('should return -1000.5', () => {
                listener.param('z', -1000.5);
                expect(listener.param('z')).toEqual(-1000.5);
            });

            // Negative
            it('should return 0', () => {
                listener.param('z', '');
                expect(listener.param('z')).toEqual(0);
            });
        });

        describe('fx', () => {
            afterEach(() => {
                listener.param('fx', 0);
            });

            // Getter
            // Positive
            it('should return 0', () => {
                expect(listener.param('fx')).toEqual(0);
            });

            // Negative
            it('should return the instance of `Listener`', () => {
                expect(listener.param('')).toEqual(jasmine.any(Listener));
            });

            // Setter
            // Positive
            it('should return 1000.5', () => {
                listener.param('fx', 1000.5);
                expect(listener.param('fx')).toEqual(1000.5);
            });

            it('should return -1000.5', () => {
                listener.param('fx', -1000.5);
                expect(listener.param('fx')).toEqual(-1000.5);
            });

            // Negative
            it('should return 0', () => {
                listener.param('fx', '');
                expect(listener.param('fx')).toEqual(0);
            });
        });

        describe('fy', () => {
            afterEach(() => {
                listener.param('fy', 0);
            });

            // Getter
            // Positive
            it('should return 0', () => {
                expect(listener.param('fy')).toEqual(0);
            });

            // Negative
            it('should return the instance of `Listener`', () => {
                expect(listener.param('')).toEqual(jasmine.any(Listener));
            });

            // Setter
            // Positive
            it('should return 1000.5', () => {
                listener.param('fy', 1000.5);
                expect(listener.param('fy')).toEqual(1000.5);
            });

            it('should return -1000.5', () => {
                listener.param('fy', -1000.5);
                expect(listener.param('fy')).toEqual(-1000.5);
            });

            // Negative
            it('should return 0', () => {
                listener.param('fy', '');
                expect(listener.param('fy')).toEqual(0);
            });
        });

        describe('fz', () => {
            afterEach(() => {
                listener.param('fz', -1);
            });

            // Getter
            // Positive
            it('should return -1', () => {
                expect(listener.param('fz')).toEqual(-1);
            });

            // Negative
            it('should return the instance of `Listener`', () => {
                expect(listener.param('')).toEqual(jasmine.any(Listener));
            });

            // Setter
            // Positive
            it('should return 1000.5', () => {
                listener.param('fz', 1000.5);
                expect(listener.param('fz')).toEqual(1000.5);
            });

            it('should return -1000.5', () => {
                listener.param('fz', -1000.5);
                expect(listener.param('fz')).toEqual(-1000.5);
            });

            // Negative
            it('should return -1', () => {
                listener.param('fz', '');
                expect(listener.param('fz')).toEqual(-1);
            });
        });

        describe('ux', () => {
            afterEach(() => {
                listener.param('ux', 0);
            });

            // Getter
            // Positive
            it('should return 0', () => {
                expect(listener.param('ux')).toEqual(0);
            });

            // Negative
            it('should return the instance of `Listener`', () => {
                expect(listener.param('')).toEqual(jasmine.any(Listener));
            });

            // Setter
            // Positive
            it('should return 1000.5', () => {
                listener.param('ux', 1000.5);
                expect(listener.param('ux')).toEqual(1000.5);
            });

            it('should return -1000.5', () => {
                listener.param('ux', -1000.5);
                expect(listener.param('ux')).toEqual(-1000.5);
            });

            // Negative
            it('should return 0', () => {
                listener.param('ux', '');
                expect(listener.param('ux')).toEqual(0);
            });
        });

        describe('uy', () => {
            afterEach(() => {
                listener.param('uy', 1);
            });

            // Getter
            // Positive
            it('should return 1', () => {
                expect(listener.param('uy')).toEqual(1);
            });

            // Negative
            it('should return the instance of `Listener`', () => {
                expect(listener.param('')).toEqual(jasmine.any(Listener));
            });

            // Setter
            // Positive
            it('should return 1000.5', () => {
                listener.param('uy', 1000.5);
                expect(listener.param('uy')).toEqual(1000.5);
            });

            it('should return -1000.5', () => {
                listener.param('uy', -1000.5);
                expect(listener.param('uy')).toEqual(-1000.5);
            });

            // Negative
            it('should return 1', () => {
                listener.param('uy', '');
                expect(listener.param('uy')).toEqual(1);
            });
        });

        describe('uz', () => {
            afterEach(() => {
                listener.param('uz', 0);
            });

            // Getter
            // Positive
            it('should return 0', () => {
                expect(listener.param('uz')).toEqual(0);
            });

            // Negative
            it('should return the instance of `Listener`', () => {
                expect(listener.param('')).toEqual(jasmine.any(Listener));
            });

            // Setter
            // Positive
            it('should return 1000.5', () => {
                listener.param('uz', 1000.5);
                expect(listener.param('uz')).toEqual(1000.5);
            });

            it('should return -1000.5', () => {
                listener.param('uz', -1000.5);
                expect(listener.param('uz')).toEqual(-1000.5);
            });

            // Negative
            it('should return 0', () => {
                listener.param('uz', '');
                expect(listener.param('uz')).toEqual(0);
            });
        });
    });
});
