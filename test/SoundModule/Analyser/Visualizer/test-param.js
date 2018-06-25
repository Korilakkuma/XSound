'use strict';

import Visualizer from '../../../../src/SoundModule/Analyser/Visualizer';

describe('Visualizer TEST', () => {
    describe('Visualizer#param', () => {
        const visualizer = new Visualizer(audiocontext.sampleRate);

        describe('interval', () => {
            afterEach(() => {
                visualizer.param('interval', 1000);
            });

            // Getter
            // Positive
            it('should return 1000', () => {
                expect(visualizer.param('interval')).toEqual(1000);
            });

            // Negative
            it('should return `undefined`', () => {
                expect(visualizer.param('')).toBeUndefined();
            });

            // Setter
            // Positive
            it('should return 500.5', () => {
                visualizer.param('interval', 500.5);
                expect(visualizer.param('interval')).toEqual(500.5);
            });

            it('should return 0', () => {
                visualizer.param('interval', 0);
                expect(visualizer.param('interval')).toEqual(0);
            });

            it('should return "auto"', () => {
                visualizer.param('interval', 'auto');
                expect(visualizer.param('interval')).toEqual('auto');
            });

            // Negative
            it('should return 1000', () => {
                visualizer.param('interval', -0.5);
                expect(visualizer.param('interval')).toEqual(1000);
            });
        });

        describe('shape', () => {
            afterEach(() => {
                visualizer.param('wave', 'rgba(0, 0, 255, 1.0)');
                visualizer.param('shape', 'line');
            });

            // Getter
            // Positive
            it('should return "line"', () => {
                expect(visualizer.param('shape')).toEqual('line');
            });

            // Negative
            it('should return `undefined`', () => {
                expect(visualizer.param('')).toBeUndefined();
            });

            // Setter
            // Positive
            it('should return "line"', () => {
                visualizer.param('shape', 'line');
                expect(visualizer.param('shape')).toEqual('line');
            });

            it('should return "rect"', () => {
                visualizer.param('shape', 'rect');
                expect(visualizer.param('shape')).toEqual('rect');
            });

            it('should return "rect"', () => {
                visualizer.param('wave', 'gradient');
                visualizer.param('shape', 'line');
                expect(visualizer.param('shape')).toEqual('rect');
            });

            // Negative
            it('should return "line"', () => {
                visualizer.param('shape', 'circle');
                expect(visualizer.param('shape')).toEqual('line');
            });
        });

        describe('grad', () => {
            afterEach(() => {
                visualizer.param('grad', [
                    { 'offset' : 0, 'color' : 'rgba(0, 128, 255, 1.0)' },
                    { 'offset' : 1, 'color' : 'rgba(0, 0, 255, 1.0)'   }
                ]);
            });

            // Getter
            // Positive

            it('should return array that contains associative array for gradient', () => {
                expect(visualizer.param('grad')).toEqual([
                    { 'offset' : 0, 'color' : 'rgba(0, 128, 255, 1.0)' },
                    { 'offset' : 1, 'color' : 'rgba(0, 0, 255, 1.0)'   }
                ]);
            });

            // Negative
            it('should return `undefined`', () => {
                expect(visualizer.param('')).toBeUndefined();
            });

            // Setter
            // Positive
            it('should return array that contains associative array for gradient', () => {
                visualizer.param('grad', [
                    { 'offset' : 0,   'color' : 'rgba(0, 128, 255, 1.0)' },
                    { 'offset' : 0.5, 'color' : 'rgba(0,  64, 255, 1.0)' },
                    { 'offset' : 1,   'color' : 'rgba(0,   0, 255, 1.0)' }
                ]);

                expect(visualizer.param('grad')).toEqual([
                    { 'offset' : 0,   'color' : 'rgba(0, 128, 255, 1.0)' },
                    { 'offset' : 0.5, 'color' : 'rgba(0,  64, 255, 1.0)' },
                    { 'offset' : 1,   'color' : 'rgba(0,   0, 255, 1.0)' }
                ]);
            });

            // Negative
            it('should return array that contains associative array for gradient', () => {
                visualizer.param('grad', [
                    { 'offset' : 0   },
                    { 'offset' : 0.5 },
                    { 'offset' : 1   }
                ]);

                expect(visualizer.param('grad')).toEqual([
                    { 'offset' : 0, 'color' : 'rgba(0, 128, 255, 1.0)' },
                    { 'offset' : 1, 'color' : 'rgba(0, 0, 255, 1.0)'   }
                ]);
            });

            it('should return array that contains associative array for gradient', () => {
                visualizer.param('grad', [
                    { 'color' : 'rgba(255, 128, 0, 1.0)' },
                    { 'color' : 'rgba(255,   0, 0, 1.0)' }
                ]);

                expect(visualizer.param('grad')).toEqual([
                    { 'offset' : 0, 'color' : 'rgba(0, 128, 255, 1.0)' },
                    { 'offset' : 1, 'color' : 'rgba(0, 0, 255, 1.0)'   }
                ]);
            });

        });

        describe('font', () => {
            afterEach(() => {
                visualizer.param('font', {
                    'family' : 'Arial',
                    'size'   : '13px',
                    'style'  : 'normal',
                    'weight' : 'normal'
                });
            });

            // Getter
            // Positive
            it('should return associative array for font', () => {
                expect(visualizer.param('font')).toEqual({
                    'family' : 'Arial',
                    'size'   : '13px',
                    'style'  : 'normal',
                    'weight' : 'normal'
                });
            });

            // Negative
            it('should return `undefined`', () => {
                expect(visualizer.param('')).toBeUndefined();
            });

            // Setter
            // Positive
            it('should return associative array for font', () => {
                visualizer.param('font', {
                    'family' : 'Helvetica',
                    'size'   : '16px',
                    'style'  : 'italic',
                    'weight' : 'lighter'
                });

                expect(visualizer.param('font')).toEqual({
                    'family' : 'Helvetica',
                    'size'   : '16px',
                    'style'  : 'italic',
                    'weight' : 'lighter'
                });
            });

            it('should return associative array for font', () => {
                visualizer.param('font', { 'family' : 'Helvetica' });
                expect(visualizer.param('font')).toEqual({
                    'family' : 'Helvetica',
                    'size'   : '13px',
                    'style'  : 'normal',
                    'weight' : 'normal'
                });
            });

            // Negative
            it('should return associative array for font', () => {
                visualizer.param('font', {
                    'a' : 'Helvetica',
                    'b' : '16px',
                    'c' : 'italic',
                    'd' : 'lighter'
                });

                expect(visualizer.param('font')).toEqual({
                    'family' : 'Arial',
                    'size'   : '13px',
                    'style'  : 'normal',
                    'weight' : 'normal'
                });
            });
        });

        describe('wave', () => {
            afterEach(() => {
                visualizer.param('wave', 'rgba(0, 0, 255, 1.0)');
            });

            // Getter
            // Positive
            it('should return "rgba(0, 0, 255, 1.0)"', () => {
                expect(visualizer.param('wave')).toEqual('rgba(0, 0, 255, 1.0)');
            });

            // Negative
            it('should return `undefined`', () => {
                expect(visualizer.param('')).toBeUndefined();
            });

            // Setter
            it('should return "#dd11ff"', () => {
                visualizer.param('wave', '#dd11ff');
                expect(visualizer.param('wave')).toEqual('#dd11ff');
            });

            it('should return "gradient"', () => {
                visualizer.param('wave', 'gradient');
                expect(visualizer.param('wave')).toEqual('gradient');
                expect(visualizer.param('shape')).toEqual('rect');
            });
        });

        describe('grid', () => {
            afterEach(() => {
                visualizer.param('grid', 'rgba(255, 0, 0, 1.0)');
            });

            // Getter
            // Positive
            it('should return "rgba(255, 0, 0, 1.0)"', () => {
                expect(visualizer.param('grid')).toEqual('rgba(255, 0, 0, 1.0)');
            });

            // Negative
            it('should return `undefined`', () => {
                expect(visualizer.param('')).toBeUndefined();
            });

            // Setter
            it('should return "#cc0000"', () => {
                visualizer.param('grid', '#cc0000');
                expect(visualizer.param('grid')).toEqual('#cc0000');
            });
        });

        describe('text', () => {
            afterEach(() => {
                visualizer.param('text', 'rgba(255, 255, 255, 1.0)');
            });

            // Getter
            // Positive
            it('should return "rgba(255, 255, 255, 1.0)"', () => {
                expect(visualizer.param('text')).toEqual('rgba(255, 255, 255, 1.0)');
            });

            // Negative
            it('should return `undefined`', () => {
                expect(visualizer.param('')).toBeUndefined();
            });

            // Setter
            it('should return "#fafafa"', () => {
                visualizer.param('text', '#fafafa');
                expect(visualizer.param('text')).toEqual('#fafafa');
            });
        });

        describe('cap', () => {
            afterEach(() => {
                visualizer.param('cap', 'round');
            });

            // Getter
            // Positive
            it('should return "round"', () => {
                expect(visualizer.param('cap')).toEqual('round');
            });

            // Negative
            it('should return `undefined`', () => {
                expect(visualizer.param('')).toBeUndefined();
            });

            // Setter
            it('should return "butt"', () => {
                visualizer.param('cap', 'butt');
                expect(visualizer.param('cap')).toEqual('butt');
            });
        });

        describe('join', () => {
            afterEach(() => {
                visualizer.param('join', 'miter');
            });

            // Getter
            // Positive
            it('should return "miter"', () => {
                expect(visualizer.param('join')).toEqual('miter');
            });

            // Negative
            it('should return `undefined`', () => {
                expect(visualizer.param('')).toBeUndefined();
            });

            // Setter
            it('should return "round"', () => {
                visualizer.param('join', 'round');
                expect(visualizer.param('join')).toEqual('round');
            });
        });

        describe('width', () => {
            afterEach(() => {
                visualizer.param('width', 1.5);
            });

            // Getter
            // Positive
            it('should return 1.5', () => {
                expect(visualizer.param('width')).toEqual(1.5);
            });

            // Negative
            it('should return `undefined`', () => {
                expect(visualizer.param('')).toBeUndefined();
            });

            // Setter
            // Positive
            it('should return 10.5', () => {
                visualizer.param('width', 10.5);
                expect(visualizer.param('width')).toEqual(10.5);
            });

            it('should return 0', () => {
                visualizer.param('width', 0);
                expect(visualizer.param('width')).toEqual(0);
            });

            // Negative
            it('should return 1.5', () => {
                visualizer.param('width', -0.5);
                expect(visualizer.param('width')).toEqual(1.5);
            });
        });

        describe('top', () => {
            afterEach(() => {
                visualizer.param('top', 15);
            });

            // Getter
            // Positive
            it('should return 15', () => {
                expect(visualizer.param('top')).toEqual(15);
            });

            // Negative
            it('should return `undefined`', () => {
                expect(visualizer.param('')).toBeUndefined();
            });

            // Setter
            // Positive
            it('should return 10', () => {
                visualizer.param('top', 10);
                expect(visualizer.param('top')).toEqual(10);
            });

            it('should return 0', () => {
                visualizer.param('top', 0);
                expect(visualizer.param('top')).toEqual(0);
            });

            // Negative
            it('should return 15', () => {
                visualizer.param('top', -1.1);
                expect(visualizer.param('top')).toEqual(15);
            });
        });

        describe('right', () => {
            afterEach(() => {
                visualizer.param('right', 30);
            });

            // Getter
            // Positive
            it('should return 30', () => {
                expect(visualizer.param('right')).toEqual(30);
            });

            // Negative
            it('should return `undefined`', () => {
                expect(visualizer.param('')).toBeUndefined();
            });

            // Setter
            // Positive
            it('should return 10', () => {
                visualizer.param('right', 10);
                expect(visualizer.param('right')).toEqual(10);
            });

            it('should return 0', () => {
                visualizer.param('right', 0);
                expect(visualizer.param('right')).toEqual(0);
            });

            // Negative
            it('should return 30', () => {
                visualizer.param('right', -1.1);
                expect(visualizer.param('right')).toEqual(30);
            });
        });

        describe('bottom', () => {
            afterEach(() => {
                visualizer.param('bottom', 15);
            });

            // Getter
            // Positive
            it('should return 15', () => {
                expect(visualizer.param('bottom')).toEqual(15);
            });

            // Negative
            it('should return `undefined`', () => {
                expect(visualizer.param('')).toBeUndefined();
            });

            // Setter
            // Positive
            it('should return 10', () => {
                visualizer.param('bottom', 10);
                expect(visualizer.param('bottom')).toEqual(10);
            });

            it('should return 0', () => {
                visualizer.param('bottom', 0);
                expect(visualizer.param('bottom')).toEqual(0);
            });

            // Negative
            it('should return 15', () => {
                visualizer.param('bottom', -1.1);
                expect(visualizer.param('bottom')).toEqual(15);
            });
        });

        describe('left', () => {
            afterEach(() => {
                visualizer.param('left', 30);
            });

            // Getter
            // Positive
            it('should return 30', () => {
                expect(visualizer.param('left')).toEqual(30);
            });

            // Negative
            it('should return `undefined`', () => {
                expect(visualizer.param('')).toBeUndefined();
            });

            // Setter
            // Positive
            it('should return 10', () => {
                visualizer.param('left', 10);
                expect(visualizer.param('left')).toEqual(10);
            });

            it('should return 0', () => {
                visualizer.param('left', 0);
                expect(visualizer.param('left')).toEqual(0);
            });

            // Negative
            it('should return 30', () => {
                visualizer.param('left', -1.1);
                expect(visualizer.param('left')).toEqual(30);
            });
        });
    });
});
