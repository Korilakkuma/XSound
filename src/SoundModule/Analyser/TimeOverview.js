'use strict';

import { Visualizer } from './Visualizer';

/**
 * This private class defines properties for drawing audio wave in overview of time domain.
 * @constructor
 * @extends {Visualizer}
 */
export class TimeOverview extends Visualizer {
    /**
     * @param {number} sampleRate This argument is sample rate.
     */
    constructor(sampleRate) {
        super(sampleRate);

        // for `TimeOverview#update`, `TimeOverview#drag`
        this.savedImage = null;
        this.length     = 0;

        this.currentTime  = 'rgba(0, 0, 0, 0.5)';  // This style is used for the rectangle that displays current time of audio
        this.plotInterval = 0.0625;                // Draw wave at intervals of this value [sec]
        this.textInterval = 60;                    // Draw text at intervals of this value [sec]
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

            let v = null;

            switch (k) {
                case 'currenttime':
                    if (value === undefined) {
                        return this.currentTime;
                    }

                    this.currentTime = String(value).toLowerCase();

                    break;
                case 'plotinterval':
                case 'textinterval':
                    if (value === undefined) {
                        return this[k.replace('interval', 'Interval')];
                    }

                    v = parseFloat(value);

                    if (v > 0) {
                        this[k.replace('interval', 'Interval')] = v;
                    }

                    break;
                default:
                    break;
            }
        }

        return this;
    }

    /**
     * This method draws audio wave in overview of time domain to Canvas.
     * @param {Float32Array} data This argument is data for drawing.
     * @return {TimeOverview} This is returned for method chain.
     * @override
     */
    drawOnCanvas(data) {
        if (!((this.canvas instanceof HTMLCanvasElement) && this.isActive)) {
            return this;
        }

        const context = this.context;

        const { width, height } = this.canvas;

        const innerWidth  = width  - (this.styles.left + this.styles.right);
        const innerHeight = height - (this.styles.top  + this.styles.bottom);
        const middle      = Math.floor(innerHeight / 2) + this.styles.top;

        // Draw wave at intervals of `this.plotInterval`
        const nPlotInterval = Math.floor(this.plotInterval * this.sampleRate);

        // Draw text at intervals of `this.textInterval`
        const nTextInterval = Math.floor(this.textInterval * this.sampleRate);

        // Erase previous wave
        context.clearRect(0, 0, width, height);

        // Begin drawing
        this.drawTimeDomainFloat32ArrayOnCanvas(context, data, innerWidth, innerHeight, middle, nPlotInterval);

        if ((this.styles.grid !== 'none') || (this.styles.text !== 'none')) {
            // Draw grid and text (X axis)
            for (let i = 0, len = data.length; i < len; i++) {
                if ((i % nTextInterval) === 0) {
                    const x = Math.floor((i / len) * innerWidth) + this.styles.left;
                    const t = `${Math.floor((i / this.sampleRate) / 60)} min`;

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
            const texts = ['-1.00', '-0.50', ' 0.00', ' 0.50', ' 1.00'];

            for (const t of texts) {
                const x = Math.floor(this.styles.left - context.measureText(t).width);
                const y = Math.floor((1 - parseFloat(t.trim())) * (innerHeight / 2)) + this.styles.top;

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
        }

        // for `TimeOverview#update`, `TimeOverview#drag`
        this.savedImage = context.getImageData(0, 0, width, height);
        this.length     = data.length;

        // This rectangle displays current time of audio
        context.fillStyle = this.currentTime;
        context.fillRect(this.styles.left, this.styles.top, 1, innerHeight);

        return this;
    }

    /**
     * This method draws audio wave in overview of time domain to SVG.
     * @param {Float32Array} data This argument is data for drawing.
     * @return {TimeOverview} This is returned for method chain.
     * @override
     */
    drawBySVG(data) {
        if (!((this.svg instanceof SVGElement) && this.isActive)) {
            return this;
        }

        const svg = this.svg;

        const width       = parseInt(svg.getAttribute('width'), 10);
        const height      = parseInt(svg.getAttribute('height'), 10);
        const innerWidth  = width  - (this.styles.left + this.styles.right);
        const innerHeight = height - (this.styles.top  + this.styles.bottom);
        const middle      = Math.floor(innerHeight / 2) + this.styles.top;

        // Draw wave at intervals of `this.plotInterval`
        const nPlotInterval = Math.floor(this.plotInterval * this.sampleRate);

        // Draw text at intervals of `this.textInterval`
        const nTextInterval = Math.floor(this.textInterval * this.sampleRate);

        // Erase previous wave
        svg.innerHTML = '';

        // Begin drawing
        svg.appendChild(this.drawTimeDomainFloat32ArrayBySVG(data, innerWidth, innerHeight, middle, nPlotInterval, Visualizer.SVG_LINEAR_GRADIENT_ID_TIME_OVERVIEW));

        if ((this.styles.grid !== 'none') || (this.styles.text !== 'none')) {
            // Draw grid and text (X axis)
            for (let i = 0, len = data.length; i < len; i++) {
                if ((i % nTextInterval) === 0) {
                    const x = Math.floor((i / len) * innerWidth) + this.styles.left;
                    const t = Math.floor((i / this.sampleRate) / 60) + ' min';

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
            const texts = ['-1.00', '-0.50', ' 0.00', ' 0.50', ' 1.00'];

            for (const t of texts) {
                const x = this.styles.left;
                const y = Math.floor((1 - parseFloat(t.trim())) * (innerHeight / 2)) + this.styles.top;

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
        }

        // This rectangle displays current time of audio
        const rect = document.createElementNS(Visualizer.XMLNS, 'rect');

        rect.classList.add('svg-current-time');

        rect.setAttribute('x',      this.styles.left);
        rect.setAttribute('y',      (this.styles.top + 1));
        // rect.setAttribute('width',  1);
        rect.setAttribute('height', (innerHeight - 1));

        rect.setAttribute('stroke', 'none');
        rect.setAttribute('fill',   this.currentTime);

        svg.appendChild(rect);

        // for `TimeOverview#update`, `TimeOverview#drag`
        this.savedImage = svg;
        this.length     = data.length;

        return this;
    }

    /**
     * This method draws current time of audio on Canvas or SVG.
     * @param {number} time This argument is current time of audio.
     * @return {TimeOverview} This is returned for method chain.
     */
    update(time) {
        const t = parseFloat(time);

        if (isNaN(t) || (t < 0)) {
            return this;
        }

        switch (this.graphics) {
            case Visualizer.CANVAS:
                if (this.savedImage instanceof ImageData) {
                    const context = this.context;

                    const { width, height } = this.canvas;

                    const innerWidth  = width  - (this.styles.left + this.styles.right);
                    const innerHeight = height - (this.styles.top  + this.styles.bottom);
                    const x           = Math.floor(((t * this.sampleRate) / this.length) * innerWidth);

                    context.clearRect(0, 0, width, height);
                    context.putImageData(this.savedImage, 0, 0);

                    context.fillStyle = this.currentTime;
                    context.fillRect(this.styles.left, (this.styles.top + 1), x, (innerHeight - 1));
                }

                break;
            case Visualizer.SVG:
                const rect = this.svg.querySelector('.svg-current-time');

                if (rect instanceof SVGElement) {
                    const width      = parseInt(this.svg.getAttribute('width'), 10);
                    const innerWidth = width  - (this.styles.left + this.styles.right);
                    const x          = Math.floor(((t * this.sampleRate) / this.length) * innerWidth);

                    rect.setAttribute('width', x);
                    // rect.setAttribute('transform', `translate(${x} 0)`);
                }

                break;
            default:
                break;
        }

        return this;
    }

    /**
     * This method registers event listener for setting current time by drag.
     * @param {function} callback This argument is invoked when current time is changed.
     * @return {TimeOverview} This is returned for method chain.
     */
    drag(callback) {
        let drawNode = null;

        let start = '';
        let move  = '';
        let end   = '';

        // Touch Panel ?
        if (/iPhone|iPad|iPod|Android/.test(navigator.userAgent)) {
            start = 'touchstart';
            move  = 'touchmove';
            end   = 'touchend';
        } else {
            start = 'mousedown';
            move  = 'mousemove';
            end   = 'mouseup';
        }

        switch (this.graphics) {
            case Visualizer.CANVAS:
                drawNode = this.canvas;
                break;
            case Visualizer.SVG:
                drawNode = this.svg;
                break;
            default:
                return this;
        }

        let isDown = false;

        drawNode.addEventListener(start, event => {
            this.draw(this.getOffsetX(event), callback);
            isDown = true;
        }, true);

        drawNode.addEventListener(move, event => {
            if (isDown) {
                event.preventDefault();  // for Touch Panel
                this.draw(this.getOffsetX(event), callback);
            }
        }, true);

        window.addEventListener(end, () => {
            if (isDown) {
                isDown = false;
            }
        }, true);

        return this;
    }

    /**
     * This method draws the rectangle for current time of audio.
     * @param {number} offsetX This argument is X coordinate on Canvas or SVG.
     * @param {function} callback This argument is invoked when the rectangle is drawn.
     * @return {TimeOverview} This is returned for method chain.
     */
    draw(offsetX, callback) {
        let offsetLeft = 0;
        let width      = 0;

        switch (this.graphics) {
            case Visualizer.CANVAS:
                offsetLeft = this.canvas.offsetLeft;
                width      = this.canvas.width;
                break;
            case Visualizer.SVG:
                offsetLeft = this.svg.parentNode.offsetLeft;
                width      = parseInt(this.svg.getAttribute('width'), 10);
                break;
            default:
                break;
        }

        let x = offsetX - (offsetLeft + this.styles.left);

        width -= (this.styles.left + this.styles.right);

        // Exceed ?
        if (x < 0)     {x = 0;}
        if (x > width) {x = width;}

        const plot = (x / width) * this.length;
        const time = plot / this.sampleRate;

        this.update(time);

        if (Object.prototype.toString.call(callback) === '[object Function]') {
            callback(time);
        }

        return this;
    }

    /**
     * This method returns X coordinate from `Event` object.
     * @param {Event} event This argument is the instance of `Event`.
     * @return {number} This is returned as X coordinate.
     */
    getOffsetX(event) {
        if (event.pageX) {
            return event.pageX;
        }

        if (event.touches[0]) {
            return event.touches[0].pageX;
        }

        return this;
    }

    /** @override */
    toString() {
        return '[SoundModule Analyser TimeOverview]';
    }
}
