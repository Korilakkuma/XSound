'use strict';

import { Visualizer } from './Visualizer';

/**
 * This private class defines properties for drawing sound wave in frequency domain (spectrum).
 * @constructor
 * @extends {Visualizer}
 */
export class FFT extends Visualizer {
    static UINT  = 'uint';
    static FLOAT = 'float';

    /**
     * @param {number} sampleRate This argument is sample rate.
     */
    constructor(sampleRate) {
        super(sampleRate);

        this.type         = FFT.UINT;  // unsigned int 8 bit (`Uint8Array`) or float 32 bit (`Float32Array`)
        this.size         = 256;       // Range for drawing
        this.textInterval = 1000;      // Draw text at intervals of this value [Hz]
    }

    /** @override */
    param(key, value) {
        if (Object.prototype.toString.call(arguments[0]) === '[object Object]') {
            // Associative array
            for (const k in arguments[0]) {
                this.param(k, arguments[0][k]);
            }
        } else {
            const k = String(key).replace(/-/g, '').toLowerCase();

            const r = super.param(k, value);

            if (r !== undefined) {
                return r;
            }

            let v   = null;
            let min = null;
            let max = null;

            switch (k) {
                case 'type':
                    if (value === undefined) {
                        return this.type;
                    }

                    v = String(value).toLowerCase();

                    if ((v === FFT.UINT) || (v === FFT.FLOAT)) {
                        this.type = v;
                    }

                    break;
                case 'size':
                    if (value === undefined) {
                        return this.size;
                    }

                    v   = parseInt(value, 10);
                    min = 0;
                    max = 1024;  // `AnalyserNode#fftSize` max 2048 -> half 1024

                    if ((v > min) && (v <= max)) {
                        this.size = v;
                    }

                    break;
                case 'textinterval':
                    if (value === undefined) {
                        return this.textInterval;
                    }

                    v = parseFloat(value);

                    if (v > 0) {
                        this.textInterval = v;
                    }

                    break;
                default:
                    break;
            }
        }

        return this;
    }

    /**
     * This method draws sound wave in frequency domain (spectrum) to Canvas.
     * @param {Uint8Array|Float32Array} data This argument is data for drawing.
     * @param {number} minDecibels This argument is in order to determine the range of drawing. The default value is -100 dB.
     * @param {number} maxDecibels This argument is in order to determine the range of drawing. The default value is -30 dB.
     * @return {FFT} This is returned for method chain.
     * @override
     */
    drawOnCanvas(data, minDecibels, maxDecibels) {
        if (!((this.canvas instanceof HTMLCanvasElement) && this.isActive)) {
            return this;
        }

        const mindB = parseFloat(minDecibels);
        const maxdB = parseFloat(maxDecibels);

        const range = maxdB - mindB;

        const context = this.context;

        const { width, height } = this.canvas;

        const innerWidth  = width  - (this.styles.left + this.styles.right);
        const innerHeight = height - (this.styles.top  + this.styles.bottom);

        const drawnSize = (this.size > data.length) ? data.length : this.size;

        // Frequency resolution (Sampling rate / FFT size)
        const fsDivN = this.sampleRate / (2 * data.length);

        // Draw text at intervals of `this.textInterval`
        const nTextInterval = Math.floor(this.textInterval / fsDivN);

        // Erase previous wave
        context.clearRect(0, 0, width, height);

        // Begin drawing
        switch (this.type) {
            case FFT.FLOAT:
                // Set style
                context.strokeStyle = (this.styles.wave !== 'gradient') ? this.styles.wave : 'rgba(0, 0, 255, 1.0)';  // line only
                context.lineWidth   = this.styles.width;
                context.lineCap     = this.styles.cap;
                context.lineJoin    = this.styles.join;

                // Draw wave
                context.beginPath();

                for (let i = 0; i < drawnSize; i++) {
                    const x = ((i / drawnSize) * innerWidth) + this.styles.left;
                    const y = (Math.abs(data[i] - maxdB) * (innerHeight / range)) + this.styles.top;  // [dB] * [px / dB] = [px]

                    if (i === 0) {
                        context.moveTo((x + (this.styles.width / 2)), y);
                    } else {
                        context.lineTo(x, y);
                    }
                }

                context.stroke();

                break;
            case FFT.UINT:
            default:
                switch (this.styles.shape) {
                    case 'line':
                        // Set style
                        context.strokeStyle = this.styles.wave;
                        context.lineWidth   = this.styles.width;
                        context.lineCap     = this.styles.cap;
                        context.lineJoin    = this.styles.join;

                        context.beginPath();

                        // Draw wave
                        for (let i = 0; i < drawnSize; i++) {
                            const x = ((i / drawnSize) * innerWidth) + this.styles.left;
                            const y = ((1 - (data[i] / 255)) * innerHeight) + this.styles.top;

                            if (i === 0) {
                                context.moveTo((x + (this.styles.width / 2)), y);
                            } else {
                                context.lineTo(x, y);
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
                        for (let i = 0; i < drawnSize; i++) {
                            const x = ((i / drawnSize) * innerWidth) + this.styles.left;
                            const y = -1 * ((data[i] / 255) * innerHeight);

                            // Set style
                            if (this.styles.wave === 'gradient') {
                                const upside   = innerHeight + this.styles.top;
                                const gradient = context.createLinearGradient(0, upside, 0, (upside + y));

                                for (const gradients of this.styles.grad) {
                                    gradient.addColorStop(gradients.offset, gradients.color);
                                }

                                context.fillStyle = gradient;
                            }

                            context.fillRect(x, (innerHeight + this.styles.top), this.styles.width, y);
                        }

                        break;
                    default:
                        break;
                }

                break;
        }

        if ((this.styles.grid !== 'none') || (this.styles.text !== 'none')) {
            // Draw grid and text (X axis)
            for (let i = 0; i < drawnSize; i++) {
                if ((i % nTextInterval) === 0) {
                    const x = Math.floor((i / drawnSize) * innerWidth) + this.styles.left;

                    const f = Math.floor(this.textInterval * (i / nTextInterval));
                    const t = (f < 1000) ? `${f} Hz` : `${String(f / 1000).slice(0, 3)} kHz`;

                    // Draw grid
                    if (this.styles.grid !== 'none') {
                        context.fillStyle = this.styles.grid;
                        context.fillRect(x, this.styles.top, 1, innerHeight);
                    }

                    // Draw text
                    if (this.styles.text !== 'none') {
                        context.fillStyle = this.styles.text;
                        context.font      = this.createFontString();
                        context.fillText(t, (x - (context.measureText(t).width / 2)), (this.styles.top + innerHeight + parseInt(this.styles.font.size, 10)));
                    }
                }
            }

            // Draw grid and text (Y axis)
            switch (this.type) {
                case FFT.FLOAT:
                    for (let i = mindB; i <= maxdB; i += 10) {
                        const t = `${i} dB`;
                        const x = Math.floor(this.styles.left - context.measureText(t).width);
                        const y = Math.floor(((-1 * (i - maxdB)) / range) * innerHeight) + this.styles.top;

                        // Draw grid
                        if (this.styles.grid !== 'none') {
                            context.fillStyle = this.styles.grid;
                            context.fillRect(this.styles.left, y, innerWidth, 1);
                        }

                        // Draw text
                        if (this.styles.text !== 'none') {
                            context.fillStyle = this.styles.text;
                            context.font      = this.createFontString();
                            context.fillText(t, x, (y - Math.floor(parseInt(this.styles.font.size, 10) / 4)));
                        }
                    }

                    break;
                case FFT.UINT:
                default:
                    const texts = ['0.00', '0.25', '0.50', '0.75', '1.00'];

                    for (const t of texts) {
                        const x = Math.floor(this.styles.left - context.measureText(t).width);
                        const y = ((1 - parseFloat(t)) * innerHeight) + this.styles.top;

                        // Draw grid
                        if (this.styles.grid !== 'none') {
                            context.fillStyle = this.styles.grid;
                            context.fillRect(this.styles.left, y, innerWidth, 1);
                        }

                        // Draw text
                        if (this.styles.text !== 'none') {
                            context.fillStyle = this.styles.text;
                            context.font      = this.createFontString();
                            context.fillText(t, x, (y - Math.floor(parseInt(this.styles.font.size, 10) / 4)));
                        }
                    }

                    break;
            }
        }

        return this;
    }

    /**
     * This method draws sound wave in frequency domain (spectrum) to SVG.
     * @param {Uint8Array|Float32Array} data This argument is data for drawing.
     * @param {number} minDecibels This argument is in order to determine the range of drawing. The default value is -100 dB.
     * @param {number} maxDecibels This argument is in order to determine the range of drawing. The default value is -30 dB.
     * @return {FFT} This is returned for method chain.
     * @override
     */
    drawBySVG(data, minDecibels, maxDecibels) {
        if (!((this.svg instanceof SVGElement) && this.isActive)) {
            return this;
        }

        const mindB = parseFloat(minDecibels);
        const maxdB = parseFloat(maxDecibels);

        const range = maxdB - mindB;

        const svg = this.svg;

        const width       = parseInt(svg.getAttribute('width'), 10);
        const height      = parseInt(svg.getAttribute('height'), 10);
        const innerWidth  = width  - (this.styles.left + this.styles.right);
        const innerHeight = height - (this.styles.top  + this.styles.bottom);

        const drawnSize = (this.size > data.length) ? data.length : this.size;

        // Frequency resolution (sample rate / FFT size)
        const fsDivN = this.sampleRate / (2 * data.length);

        // Draw text at intervals of `this.textInterval`
        const nTextInterval = Math.floor(this.textInterval / fsDivN);

        // Erase previous wave
        svg.innerHTML = '';

        // Begin drawing
        switch (this.type) {
            case FFT.FLOAT:
                // Draw wave
                const path = document.createElementNS(Visualizer.XMLNS, 'path');

                let d = '';

                for (let i = 0; i < drawnSize; i++) {
                    const x = Math.floor((i / drawnSize) * innerWidth) + this.styles.left;
                    const y = Math.floor(-1 * (data[i] - maxdB) * (innerHeight / range)) + this.styles.top;

                    if (i === 0) {
                        d += `M${x + (this.styles.width / 2)} ${y}`;
                    } else {
                        d += ` L${x} ${y}`;
                    }
                }

                path.setAttribute('d', d);

                path.setAttribute('stroke',          ((this.styles.wave !== 'gradient') ? this.styles.wave : 'rgba(0, 0, 255, 1.0)'));  // line only
                path.setAttribute('fill',            'none');
                path.setAttribute('stroke-width',    this.styles.width);
                path.setAttribute('stroke-linecap',  this.styles.cap);
                path.setAttribute('stroke-linejoin', this.styles.join);

                svg.appendChild(path);

                break;
            case FFT.UINT:
            default:
                switch (this.styles.shape) {
                    case 'line':
                        // Draw wave
                        const path = document.createElementNS(Visualizer.XMLNS, 'path');

                        let d = '';

                        for (let i = 0; i < drawnSize; i++) {
                            const x = Math.floor((i / drawnSize) * innerWidth) + this.styles.left;
                            const y = Math.floor((1 - (data[i] / 255)) * innerHeight) + this.styles.top;

                            if (i === 0) {
                                d += `M${x + (this.styles.width / 2)} ${y}`;
                            } else {
                                d += ` L${x} ${y}`;
                            }
                        }

                        path.setAttribute('d', d);

                        path.setAttribute('stroke',          this.styles.wave);
                        path.setAttribute('fill',            'none');
                        path.setAttribute('stroke-width',    this.styles.width);
                        path.setAttribute('stroke-linecap',  this.styles.cap);
                        path.setAttribute('stroke-linejoin', this.styles.join);

                        svg.appendChild(path);

                        break;
                    case 'rect':
                        // Draw wave
                        let defs = null;

                        if (this.styles.wave === 'gradient') {
                            defs = this.createSVGLinearGradient(Visualizer.SVG_LINEAR_GRADIENT_ID_FFT);
                        }

                        // Draw wave
                        const g = document.createElementNS(Visualizer.XMLNS, 'g');

                        if (defs !== null) {
                            g.appendChild(defs);
                        }

                        for (let i = 0; i < drawnSize; i++) {
                            const rect = document.createElementNS(Visualizer.XMLNS, 'rect');

                            const x = Math.floor((i / drawnSize) * innerWidth) + this.styles.left;
                            const y = Math.floor((data[i] / 255) * innerHeight);

                            rect.setAttribute('x',     x);
                            rect.setAttribute('y',     (this.styles.top + innerHeight));
                            rect.setAttribute('width', this.styles.width);

                            if (y < 0) {
                                rect.setAttribute('height', -y);
                            } else {
                                rect.setAttribute('height',    y);
                                rect.setAttribute('transform', `rotate(180 ${x + (this.styles.width / 2)} ${this.styles.top + innerHeight})`);
                            }

                            rect.setAttribute('stroke', 'none');
                            rect.setAttribute('fill',   (defs === null) ? this.styles.wave : `url(#${Visualizer.SVG_LINEAR_GRADIENT_ID_FFT})`);

                            g.appendChild(rect);
                        }

                        svg.appendChild(g);

                        break;
                    default:
                        break;
                }

                break;
        }

        if ((this.styles.grid !== 'none') || (this.styles.text !== 'none')) {
            // Draw grid and text (X axis)
            for (let i = 0; i < drawnSize; i++) {
                if ((i % nTextInterval) === 0) {
                    const x = Math.floor((i / drawnSize) * innerWidth) + this.styles.left;

                    const f = Math.floor(this.textInterval * (i / nTextInterval));
                    const t = (f < 1000) ? `${f} Hz` : `${String(f / 1000).slice(0, 3)} kHz`;

                    // Draw grid
                    if (this.styles.grid !== 'none') {
                        const rect = document.createElementNS(Visualizer.XMLNS, 'rect');

                        rect.setAttribute('x',      x);
                        rect.setAttribute('y',      this.styles.top);
                        rect.setAttribute('width',  1);
                        rect.setAttribute('height', innerHeight);

                        rect.setAttribute('stroke', 'none');
                        rect.setAttribute('fill',   this.styles.grid);

                        svg.appendChild(rect);
                    }

                    // Draw text
                    if (this.styles.text !== 'none') {
                        const text = document.createElementNS(Visualizer.XMLNS, 'text');

                        text.textContent = t;

                        text.setAttribute('x', x);
                        text.setAttribute('y', (this.styles.top + innerHeight + parseInt(this.styles.font.size, 10)));

                        text.setAttribute('text-anchor', 'middle');
                        text.setAttribute('stroke',      'none');
                        text.setAttribute('fill',        this.styles.text);
                        text.setAttribute('font-family', this.styles.font.family);
                        text.setAttribute('font-size',   this.styles.font.size);
                        text.setAttribute('font-style',  this.styles.font.style);
                        text.setAttribute('font-weight', this.styles.font.weight);

                        svg.appendChild(text);
                    }
                }
            }

            // Draw grid and text (Y axis)
            switch (this.type) {
                case FFT.FLOAT:
                    for (let i = mindB; i <= maxdB; i += 10) {
                        const t = `${i}dB`;
                        const x = this.styles.left;
                        const y = Math.floor(((-1 * (i - maxdB)) / range) * innerHeight) + this.styles.top;

                        // Draw grid
                        if (this.styles.grid !== 'none') {
                            const rect = document.createElementNS(Visualizer.XMLNS, 'rect');

                            rect.setAttribute('x',      x);
                            rect.setAttribute('y',      y);
                            rect.setAttribute('width',  innerWidth);
                            rect.setAttribute('height', 1);

                            rect.setAttribute('stroke', 'none');
                            rect.setAttribute('fill',   this.styles.grid);

                            svg.appendChild(rect);
                        }

                        // Draw text
                        if (this.styles.text !== 'none') {
                            const text = document.createElementNS(Visualizer.XMLNS, 'text');

                            text.textContent = t;

                            text.setAttribute('x', x);
                            text.setAttribute('y', (y - Math.floor(parseInt(this.styles.font.size, 10) / 4)));

                            text.setAttribute('text-anchor', 'end');
                            text.setAttribute('stroke',      'none');
                            text.setAttribute('fill',        this.styles.text);
                            text.setAttribute('font-family', this.styles.font.family);
                            text.setAttribute('font-size',   this.styles.font.size);
                            text.setAttribute('font-style',  this.styles.font.style);
                            text.setAttribute('font-weight', this.styles.font.weight);

                            svg.appendChild(text);
                        }
                    }

                    break;
                case FFT.UINT:
                default:
                    const texts = ['0.00', '0.25', '0.50', '0.75', '1.00'];

                    for (const t of texts) {
                        const x = this.styles.left;
                        const y = ((1 - parseFloat(t)) * innerHeight) + this.styles.top;

                        // Draw grid
                        if (this.styles.grid !== 'none') {
                            const rect = document.createElementNS(Visualizer.XMLNS, 'rect');

                            rect.setAttribute('x',      x);
                            rect.setAttribute('y',      y);
                            rect.setAttribute('width',  innerWidth);
                            rect.setAttribute('height', 1);

                            rect.setAttribute('stroke', 'none');
                            rect.setAttribute('fill',   this.styles.grid);

                            svg.appendChild(rect);
                        }

                        // Draw text
                        if (this.styles.text !== 'none') {
                            const text = document.createElementNS(Visualizer.XMLNS, 'text');

                            text.textContent = t;

                            text.setAttribute('x', x);
                            text.setAttribute('y', (y - Math.floor(parseInt(this.styles.font.size, 10) / 4)));

                            text.setAttribute('text-anchor', 'end');
                            text.setAttribute('stroke',      'none');
                            text.setAttribute('fill',        this.styles.text);
                            text.setAttribute('font-family', this.styles.font.family);
                            text.setAttribute('font-size',   this.styles.font.size);
                            text.setAttribute('font-style',  this.styles.font.style);
                            text.setAttribute('font-weight', this.styles.font.weight);

                            svg.appendChild(text);
                        }
                    }

                    break;
            }
        }

        return this;
    }

    /** @override */
    toString() {
        return '[SoundModule Analyser FFT]';
    }
}
