'use strict';

/**
 * This private class defines the properties that subclasses (`TimeOverview`, `Time`, `FFT`) require.
 * @constructor
 */
export class Visualizer {
    static CANVAS = 'canvas';
    static SVG    = 'svg';

    static XMLNS = 'http://www.w3.org/2000/svg';
    static XLINK = 'http://www.w3.org/1999/xlink';

    static SVG_LINEAR_GRADIENT_ID_TIME_OVERVIEW = 'svg-linear-gradient-time-overview';
    static SVG_LINEAR_GRADIENT_ID_TIME          = 'svg-linear-gradient-time';
    static SVG_LINEAR_GRADIENT_ID_FFT           = 'svg-linear-gradient-fft';

    /**
     * @param {number} sampleRate This argument is sample rate.
     */
    constructor(sampleRate) {
        this.sampleRate = sampleRate;

        this.isActive = false;

        // either 'canvas' or 'svg'
        this.graphics = '';

        // in the case of using Canvas
        this.canvas  = null;
        this.context = null;

        // in the case of using SVG
        this.svg = null;

        // for timer
        this.interval = 1000;
        this.timerid  = null;

        this.styles = {
            'shape'  : 'line',
            'grad'   : [
                {
                    'offset' : 0,
                    'color'  : 'rgba(0, 128, 255, 1.0)'
                },
                {
                    'offset' : 1,
                    'color'  : 'rgba(0, 0, 255, 1.0)'
                }
            ],
            'wave'   : 'rgba(0, 0, 255, 1.0)',
            'grid'   : 'rgba(255, 0, 0, 1.0)',
            'text'   : 'rgba(255, 255, 255, 1.0)',
            'font'   : {
                'family' : 'Arial',
                'size'   : '13px',
                'style'  : 'normal',
                'weight' : 'normal'
            },
            'width'  : 1.5,
            'cap'    : 'round',
            'join'   : 'miter',
            'top'    : 15,
            'right'  : 30,
            'bottom' : 15,
            'left'   : 30
        };
    }

    /**
     * This method sets up for using Canvas or SVG.
     * @param {HTMLCanvasElement|SVGElement} element This argument is either `HTMLCanvasElement` or `SVGElement`.
     * @return {Visualizer} This is returned for method chain.
     */
    setup(element) {
        if (element instanceof HTMLCanvasElement) {
            this.graphics = Visualizer.CANVAS;
            this.canvas   = element;
            this.context  = this.canvas.getContext('2d');
        } else if (element instanceof SVGElement) {
            this.graphics = Visualizer.SVG;
            this.svg      = element;

            // this.svg.setAttribute('xmlns',       Visualizer.XMLNS);
            // this.svg.setAttribute('xmlns:xlink', Visualizer.XLINK);
        }

        return this;
    }

    /**
     * This method is getter or setter for parameters.
     * @param {string|object} key This argument is property name in the case of string type.
     *     This argument is pair of property and value in the case of associative array.
     * @param {string|number|Array.<object>} value This argument is the value of designated property. If this argument is omitted, This method is getter.
     * @return {string|number|Array.<object>} This is returned as the value of designated property in the case of getter.
     */
    param(key, value) {
        const k = String(key).replace(/-/g, '').toLowerCase();

        let v = null;

        switch (k) {
            case 'interval':
                if (value === undefined) {
                    return this.interval;
                }

                if (String(value).toLowerCase() === 'auto') {
                    this.interval = 'auto';
                } else {
                    v = parseFloat(value);

                    if (v >= 0) {
                        this.interval = v;
                    }
                }

                break;
            case 'shape':
                if (value === undefined) {
                    return this.styles.shape;
                }

                v = String(value).toLowerCase();

                if ((v === 'line') || (v === 'rect')) {
                    this.styles.shape = (this.styles.wave !== 'gradient') ? v : 'rect';
                }

                break;
            case 'grad':
                if (value === undefined) {
                    return this.styles.grad;
                }

                if (!Array.isArray(value)) {
                    value = [value];
                }

                let isError = false;

                for (const grads of value) {
                    if (('offset' in grads) && ('color' in grads)) {
                        const offset = parseFloat(grads.offset);

                        if (isNaN(offset) || (offset < 0) || (offset > 1)) {
                            isError = true;
                            break;
                        }
                    } else {
                        isError = true;
                        break;
                    }
                }

                if (!isError) {
                    this.styles.grad = value;
                }

                break;
            case 'font':
                if (value === undefined) {
                    return this.styles[k];
                }

                if (Object.prototype.toString.call(value) === '[object Object]') {
                    for (const prop in value) {
                        if (/family|size|style|weight/i.test(prop)) {
                            this.styles.font[prop] = String(value[prop]);
                        }
                    }
                }

                break;
            case 'wave':
            case 'grid':
            case 'text':
            case 'cap' :
            case 'join':
                if (value === undefined) {
                    return this.styles[k];
                }

                if (typeof value === 'string') {
                    if ((k === 'wave') && (value === 'gradient')) {
                        this.styles.shape = 'rect';
                    }

                    this.styles[k] = value.toLowerCase();
                }

                break;
            case 'width' :
            case 'top'   :
            case 'right' :
            case 'bottom':
            case 'left'  :
                if (value === undefined) {
                    return this.styles[k];
                }

                v = (k === 'width') ? parseFloat(value) : parseInt(value, 10);

                if (v >= 0) {
                    this.styles[k] = v;
                }

                break;
            default:
                break;
        }
    }

    /**
     * This method draws sound wave to Canvas or SVG. This method conceals difference of API for drawing.
     * @param {Uint8Array|Float32Array} data This argument is data for drawing.
     * @param {number} minDecibels This argument is parameter for spectrum. The default value is -100 dB.
     * @param {number} maxDecibels This argument is parameter for spectrum. The default value is -30 dB.
     * @return {Visualizer} This is returned for method chain.
     */
    start(data, minDecibels, maxDecibels) {
        switch (this.graphics) {
            case Visualizer.CANVAS:
                this.drawOnCanvas(data, minDecibels, maxDecibels);
                break;
            case Visualizer.SVG:
                this.drawBySVG(data, minDecibels, maxDecibels);
                break;
            default:
                break;
        }

        return this;
    }

    /**
     * This method creates string for `Data URL` or `HTML` for the drawn figure.
     * @return {string|Visualizer} This is returned as `Data URL` or `HTML` string. If `setup` method has not been invoked, this is returned for method chain.
     */
    create() {
        switch (this.graphics) {
            case Visualizer.CANVAS:
                return this.canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
            case Visualizer.SVG:
                return this.svg.outerHTML;
            default:
                return this;
        }
    }

    /**
     * This method toggles active state or inactive state.
     * @param {boolean|string} state If this argument is boolean, state is changed the designated.
     *     If this argument is 'toggle', state is changed automatically.
     *     If this argument is omitted, this method is getter.
     * @return {boolean|Visualizer} This is returned as current state. Otherwise, this is returned for method chain.
     */
    state(state) {
        if (state === undefined) {
            return this.isActive;
        }

        if (String(state).toLowerCase() === 'toggle') {
            this.isActive = !this.isActive;
        } else {
            this.isActive = Boolean(state);
        }

        return this;
    }

    /**
     * This method draws time domain data of `Float32Array` to Canvas.
     * @param {CanvasRenderingContext2D} context This argument is the instance of `CanvasRenderingContext2D`.
     * @param {Float32Array} data This argument is time domain data.
     * @param {number} innerWidth This argument is the width of drawing area.
     * @param {number} innerHeight This argument is the height of drawing area.
     * @param {number} middle This argument is the middle of drawing area.
     * @param {number} nPlotInterval This argument is the interval of drawing.
     */
    drawTimeDomainFloat32ArrayOnCanvas(context, data, innerWidth, innerHeight, middle, nPlotInterval) {
        if (!(context instanceof CanvasRenderingContext2D)) {
            return this;
        }

        if (!(data instanceof Float32Array)) {
            return this;
        }

        let w = parseInt(innerWidth, 10);
        let h = parseInt(innerHeight, 10);
        let m = parseInt(middle, 10);

        if (isNaN(w)) { w = 0; }
        if (isNaN(h)) { h = 0; }
        if (isNaN(m)) { m = 0; }

        // Begin drawing
        switch (this.styles.shape) {
            case 'line':
                // Set style
                context.strokeStyle = this.styles.wave;
                context.lineWidth   = this.styles.width;
                context.lineCap     = this.styles.cap;
                context.lineJoin    = this.styles.join;

                // Draw wave
                context.beginPath();

                for (let i = 0, len = data.length; i < len; i++) {
                    if ((nPlotInterval === null) || (nPlotInterval === undefined) || ((i % nPlotInterval) === 0)) {
                        const x = ((i / len) * w) + this.styles.left;
                        const y = ((1 - data[i]) * (h / 2)) + this.styles.top;

                        if (i === 0) {
                            context.moveTo((x + (this.styles.width / 2)),  y);
                        } else {
                            context.lineTo(x, y);
                        }
                    }
                }

                context.stroke();

                break;
            case 'rect':
                // Set style
                if (this.styles.wave !== 'gradient') {
                    context.fillStyle = this.styles.wave;
                }

                // Draw wave
                for (let i = 0, len = data.length; i < len; i++) {
                    if ((nPlotInterval === null) || (nPlotInterval === undefined) || ((i % nPlotInterval) === 0)) {
                        const x = ((i / len) * w) + this.styles.left;
                        const y = -1 * (data[i] * (h / 2));

                        // Set style
                        if (this.styles.wave === 'gradient') {
                            const upside   = (innerHeight / 2) + this.styles.top;
                            const gradient = context.createLinearGradient(0, upside, 0, (upside + y));

                            for (const gradients of this.styles.grad) {
                                gradient.addColorStop(gradients.offset, gradients.color);
                            }

                            context.fillStyle = gradient;
                        }

                        context.fillRect(x, m, this.styles.width, y);
                    }
                }

                break;
            default:
                break;
        }

        return this;
    }

    /**
     * This method draws time domain data of `Float32Array` to SVG.
     * @param {Float32Array} data This argument is time domain data.
     * @param {number} innerWidth This argument is the width of drawing area.
     * @param {number} innerHeight This argument is the height of drawing area.
     * @param {number} middle This argument is the middle of drawing area.
     * @param {number} nPlotInterval This argument is the interval of drawing.
     * @param {string} linearGradientId This argument is id attribute for `SVGLinearGradientElement`.
     * @return {SVGPathElement|SVGGElement} This is returned as `SVGElement`.
     */
    drawTimeDomainFloat32ArrayBySVG(data, innerWidth, innerHeight, middle, nPlotInterval, linearGradientId) {
        let w = parseInt(innerWidth, 10);
        let h = parseInt(innerHeight, 10);
        let m = parseInt(middle, 10);

        if (isNaN(w)) { w = 0; }
        if (isNaN(h)) { h = 0; }
        if (isNaN(m)) { m = 0; }

        switch (this.styles.shape) {
            case 'line':
                // Draw wave
                const path = document.createElementNS(Visualizer.XMLNS, 'path');

                let d = '';

                for (let i = 0, len = data.length; i < len; i++) {
                    if ((nPlotInterval === null) || (nPlotInterval === undefined) || ((i % nPlotInterval) === 0)) {
                        const x = ((i / len) * w) + this.styles.left;
                        const y = ((1 - data[i]) * (h / 2)) + this.styles.top;

                        if (i === 0) {
                            d += `M${x + (this.styles.width / 2)} ${y}`;
                        } else {
                            d += ` L${x} ${y}`;
                        }
                    }
                }

                path.setAttribute('d', d);

                path.setAttribute('stroke',          this.styles.wave);
                path.setAttribute('fill',            'none');
                path.setAttribute('stroke-width',    this.styles.width);
                path.setAttribute('stroke-linecap',  this.styles.cap);
                path.setAttribute('stroke-linejoin', this.styles.join);

                return path;
            case 'rect':
                let defs = null;

                if (this.styles.wave === 'gradient') {
                    defs = this.createSVGLinearGradient(linearGradientId);
                }

                // Draw wave
                const g = document.createElementNS(Visualizer.XMLNS, 'g');

                if (defs !== null) {
                    g.appendChild(defs);
                }

                for (let i = 0, len = data.length; i < len; i++) {
                    if ((nPlotInterval === null) || (nPlotInterval === undefined) || ((i % nPlotInterval) === 0)) {
                        const rect = document.createElementNS(Visualizer.XMLNS, 'rect');

                        const x = ((i / len) * w) + this.styles.left;
                        const y = data[i] * (innerHeight / 2);

                        rect.setAttribute('x',     x);
                        rect.setAttribute('y',     m);
                        rect.setAttribute('width', this.styles.width);

                        if (y < 0) {
                            rect.setAttribute('height', -y);
                        } else {
                            rect.setAttribute('height',    y);
                            rect.setAttribute('transform', `rotate(180 ${x + (this.styles.width / 2)} ${m})`);
                        }

                        rect.setAttribute('stroke', 'none');
                        rect.setAttribute('fill',   (defs === null) ? this.styles.wave : `url(#${linearGradientId})`);

                        g.appendChild(rect);
                    }
                }

                return g;
            default:
                return null;
        }
    }

    /**
     * This method creates elements for SVG linear gradient.
     * @param {string} linearGradientId This argument is id attribute for `SVGLinearGradientElement`.
     * @return {SVGDefsElement} This is returned as the instance of `SVGDefsElement`.
     */
    createSVGLinearGradient(linearGradientId) {
        const defs           = document.createElementNS(Visualizer.XMLNS, 'defs');
        const linearGradient = document.createElementNS(Visualizer.XMLNS, 'linearGradient');

        linearGradient.setAttribute('id', String(linearGradientId));
        linearGradient.setAttribute('x1', '0%');
        linearGradient.setAttribute('y1', '0%');
        linearGradient.setAttribute('x2', '0%');
        linearGradient.setAttribute('y2', '100%');

        for (const gradients of this.styles.grad) {
            const stop = document.createElementNS(Visualizer.XMLNS, 'stop');

            stop.setAttribute('offset',     gradients.offset);
            stop.setAttribute('stop-color', gradients.color);

            linearGradient.appendChild(stop);
        }

        defs.appendChild(linearGradient);

        return defs;
    }

    /**
     * This method creates string for font.
     * @return {string} This is returned as string for font.
     */
    createFontString() {
        const { size, style, weight, family } = this.styles.font;

        return `${size} ${style} ${weight} "${family}"`;
    }

    /** @abstract */
    drawOnCanvas() {
    }

    /** @abstract */
    drawBySVG() {
    }

    /** @override */
    toString() {
        return '[SoundModule Analyser Visualizer]';
    }
}
