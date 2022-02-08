import { ChannelNumber } from '../../types';
import { Visualizer, VisualizerParams, Color, GraphicsStyles } from './Visualizer';

export type MouseEventTypes = 'mousedown' | 'mousemove' | 'mouseup' | 'touchstart' | 'touchmove' | 'touchend';

export type DragMode = 'update' | 'sprite';

export type DragCallbackFunction = (event: MouseEvent | TouchEvent, startTime: number, endTime: number, mode: DragMode, direction: boolean) => void;

export type CurrentTimeStyles = {
  width?: number,  // Not used currently
  color?: Color
};

export type TimeOverviewParams = VisualizerParams & {
  currentTime?: CurrentTimeStyles,
  sprite?: Color,
  plotInterval?: number,
  textInterval?: number,
  mode?: DragMode
};

const SVG_CURRENT_TIME_CLASS_NAME = 'xsound-svg-current-time';
const SVG_SPRITE_CLASS_NAME       = 'xsound-svg-sprite';

/**
 * This private class visualizes audio wave overview in time domain.
 * @constructor
 * @extends {Visualizer}
 */
export class TimeOverview extends Visualizer {
  private callback: DragCallbackFunction = () => {};

  private currentImageData: ImageData | null = null;
  private currentSVGElement: Element | null = null;
  private currentDataSize = 0;

  // for `update`, `drag`
  // This style is used for rectangle that displays audio current time
  private currentTime: CurrentTimeStyles = {
    width: 1,
    color: 'rgba(0, 0, 0, 0.5)'
  };

  // This style is used for rectangle that displays sprite range
  private sprite: Color = 'rgba(255, 255, 255, 0.25)';

  private plotInterval = 0.0625;
  private textInterval = 60;

  private isDown = false;
  private mode: DragMode = 'update';

  private offsetX = 0;
  private startTime = 0;
  private endTime = 0;

  /**
   * @param {number} sampleRate This argument is sample rate.
   * @param {ChannelNumber} channel This argument is channel number (Left: 0, Right: 1 ...).
   */
  constructor(sampleRate: number, channel: ChannelNumber) {
    super(sampleRate, channel);

    this.onMouseStart = this.onMouseStart.bind(this);
    this.onMouseMove  = this.onMouseMove.bind(this);
    this.onMouseUp    = this.onMouseUp.bind(this);

    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove  = this.onTouchMove.bind(this);
    this.onTouchEnd   = this.onTouchEnd.bind(this);
  }

  /** @override */
  public override setup(element: HTMLCanvasElement | SVGSVGElement): TimeOverview {
    super.setup(element);
    return this;
  }

  /**
   * This method gets or sets parameters for visualizing audio wave.
   * This method is overloaded for type interface and type check.
   * @param {keyof TimeOverviewParams|TimeOverviewParams} params This argument is string if getter. Otherwise, setter.
   * @return {TimeOverviewParams[keyof TimeOverviewParams]|TimeOverview} Return value is parameter for visualizing audio wave if getter.
   *     Otherwise, return value is for method chain.
   * @override
   */
  public override param(params: 'interval'): number;
  public override param(params: 'styles'): GraphicsStyles;
  public override param(params: 'currentTime'): CurrentTimeStyles;
  public override param(params: 'sprite'): Color;
  public override param(params: 'plotInterval'): number;
  public override param(params: 'textInterval'): number;
  public override param(params: 'mode'): DragMode;
  public override param(params: TimeOverviewParams): TimeOverview;
  public override param(params: keyof TimeOverviewParams | TimeOverviewParams): TimeOverviewParams[keyof TimeOverviewParams] | TimeOverview {
    if (typeof params === 'string') {
      switch (params) {
        case 'currentTime':
          return this.currentTime;
        case 'sprite':
          return this.sprite;
        case 'plotInterval':
          return this.plotInterval;
        case 'textInterval':
          return this.textInterval;
        case 'mode':
          return this.mode;
        case 'interval':
          return super.param(params);
        case 'styles':
          return super.param(params);
        default:
          return this;
      }
    }

    for (const [key, value] of Object.entries(params)) {
      // TODO:
      switch (key) {
        case 'currentTime':
          if (typeof value === 'object') {
            this.currentTime = { ...this.currentTime, ...value };
          }

          break;
        case 'sprite':
          if (typeof value === 'string') {
            this.sprite = value;
          }

          break;
        case 'plotInterval':
          if (typeof value === 'number') {
            this.plotInterval = value;
          }

          break;
        case 'textInterval':
          if (typeof value === 'number') {
            this.textInterval = value;
          }

          break;
        case 'mode':
          if (typeof value === 'string') {
            if ((value === 'update') || (value === 'sprite')) {
              this.mode = value;
            }
          }

          break;
        default:
          break;
      }
    }

    super.param(params);

    return this;
  }

  /**
   * This method visualizes audio current time on Canvas or SVG.
   * @param {number} time This argument is audio current time.
   * @return {TimeOverview} Return value is for method chain.
   */
  public update(time: number): TimeOverview {
    switch (this.graphics) {
      case 'canvas': {
        if (this.currentImageData === null) {
          return this;
        }

        if ((this.canvas === null) || (this.context === null)) {
          return this;
        }

        const context = this.context;
        const width   = this.canvas.width;
        const height  = this.canvas.height;

        const innerWidth  = width  - ((this.styles.left ?? 30) + (this.styles.right ?? 30));
        const innerHeight = height - ((this.styles.top ?? 15)  + (this.styles.bottom ?? 15));
        const x           = ((time * this.sampleRate) / this.currentDataSize) * innerWidth;
        const left        = this.styles.left ?? 30;
        const top         = this.styles.top ?? 15;

        const currentTimeColor = this.currentTime.color ?? 'rgba(0, 0, 0, 0.5)';

        context.clearRect(0, 0, width, height);
        context.putImageData(this.currentImageData, 0, 0);

        switch (this.mode) {
          case 'update': {
            context.fillStyle = currentTimeColor;
            context.fillRect(left, (top + 1), x, (innerHeight - 1));

            break;
          }

          case 'sprite': {
            if (this.endTime !== 0) {
              const baseX = Math.trunc(((Math.abs(this.endTime - this.startTime) * this.sampleRate) / this.currentDataSize) * innerWidth);

              context.fillStyle = this.sprite;

              if (x >= this.offsetX) {
                context.fillRect((left + this.offsetX), (top + 1), baseX, (innerHeight - 1));
              } else {
                context.fillRect((left + this.offsetX - baseX), (top + 1), baseX, (innerHeight - 1));
              }
            }

            context.fillStyle = currentTimeColor;

            if (x >= this.offsetX) {
              context.fillRect((left + this.offsetX), (top + 1), Math.abs(x - this.offsetX), (innerHeight - 1));
            } else {
              context.fillRect((left + x), (top + 1), Math.abs(x - this.offsetX), (innerHeight - 1));
            }

            break;
          }

          default:
            break;
        }

        break;
      }

      case 'svg': {
        if (this.currentSVGElement === null) {
          return this;
        }

        if (this.svg) {
          const rect = this.svg.querySelector(`.${SVG_CURRENT_TIME_CLASS_NAME}`);

          if (rect === null) {
            return this;
          }

          const width      = parseInt((this.svg.getAttribute('width') ?? '0'), 10);
          const top        = this.styles.top ?? 15;
          const left       = this.styles.left ?? 30;
          const right      = this.styles.right ?? 30;
          const innerWidth = width  - (left + right);
          const x          = ((time * this.sampleRate) / this.currentDataSize) * innerWidth;

          if (this.mode === 'update') {
            rect.setAttribute('x', left.toString(10));
            rect.setAttribute('width', x.toString(10));
            // rect.setAttribute('transform', `translate(${x} 0)`);
            rect.setAttribute('aria-label', 'current time');
          } else if (this.mode === 'sprite') {
            if (this.endTime !== 0) {
              const prevRect = this.svg.querySelector(`.${SVG_SPRITE_CLASS_NAME}`);

              if (prevRect) {
                prevRect.parentNode?.removeChild(prevRect);
              }

              const baseRect = document.createElementNS(TimeOverview.XMLNS, 'rect');

              baseRect.classList.add(SVG_SPRITE_CLASS_NAME);

              const baseX = Math.trunc(((Math.abs(this.endTime - this.startTime) * this.sampleRate) / this.currentDataSize) * innerWidth);

              baseRect.setAttribute('y', (top + 1).toString(10));
              baseRect.setAttribute('height', (rect.getAttribute('height') ?? '0'));
              baseRect.setAttribute('stroke', 'none');
              baseRect.setAttribute('fill', this.sprite);
              baseRect.setAttribute('aria-label', 'current time');

              if (x >= this.offsetX) {
                baseRect.setAttribute('x', (left + this.offsetX).toString(10));
              } else {
                baseRect.setAttribute('x', (left + this.offsetX - baseX).toString(10));
              }

              baseRect.setAttribute('width', baseX.toString(10));

              this.svg.appendChild(baseRect);
              this.svg.appendChild(rect);
            }

            if (x >= this.offsetX) {
              rect.setAttribute('x', (left + this.offsetX).toString(10));
            } else {
              rect.setAttribute('x', (left + x).toString(10));
            }

            rect.setAttribute('width', Math.abs(x - this.offsetX).toString(10));
            rect.setAttribute('aria-label', 'sprite time');
          }
        }

        break;
      }

      default:
        break;
    }

    return this;
  }

  /**
   * This method registers event listener for updating current time or spriting audio by drag.
   * @param {DragCallbackFunction} callback This argument is invoked during drag.
   * @return {TimeOverview} Return value is for method chain.
   */
  public drag(callback?: DragCallbackFunction): TimeOverview {
    let visualizationNode: HTMLCanvasElement | Element | null = null;

    switch (this.graphics) {
      case 'canvas':
        if (this.canvas === null) {
          return this;
        }

        visualizationNode = this.canvas;
        break;
      case 'svg':
        if (this.svg === null) {
          return this;
        }

        visualizationNode = this.svg;
        break;
      default:
        return this;
    }

    if (visualizationNode === null) {
      return this;
    }

    if (callback) {
      this.callback = callback;
    }

    visualizationNode.removeEventListener('mousedown', { handleEvent: this.onMouseStart }, false);
    visualizationNode.removeEventListener('mousemove', { handleEvent: this.onMouseMove  }, false);
    window.removeEventListener('mouseup',              { handleEvent: this.onMouseUp    }, false);

    visualizationNode.removeEventListener('touchstart', { handleEvent: this.onTouchStart }, false);
    visualizationNode.removeEventListener('touchmove',  { handleEvent: this.onTouchMove  }, false);
    window.removeEventListener('touchend',              { handleEvent: this.onTouchEnd   }, false);

    visualizationNode.addEventListener('mousedown', { handleEvent: this.onMouseStart }, false);
    visualizationNode.addEventListener('mousemove', { handleEvent: this.onMouseMove  }, false);
    window.addEventListener('mouseup',              { handleEvent: this.onMouseUp    }, false);

    visualizationNode.addEventListener('touchstart', { handleEvent: this.onTouchStart }, false);
    visualizationNode.addEventListener('touchmove',  { handleEvent: this.onTouchMove  }, false);
    window.addEventListener('touchend',              { handleEvent: this.onTouchEnd   }, false);

    return this;
  }

  /** @override */
  public override clear(): TimeOverview {
    super.clear();
    return this;
  }

  /** @override */
  public override activate(): TimeOverview {
    super.activate();
    return this;
  }

  /** @override */
  public override deactivate(): TimeOverview {
    super.deactivate();
    return this;
  }

  /**
   * This method visualizes audio wave overview to Canvas.
   * @param {Float32Array} data This argument is audio data for visualization.
   * @override
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected override visualizeOnCanvas(data: Uint8Array | Float32Array, _minDecibels?: number, _maxDecibels?: number): void {
    if ((this.canvas === null) || (this.context === null) || !this.isActive || (data instanceof Uint8Array)) {
      return;
    }

    const context     = this.context;
    const width       = this.canvas.width;
    const height      = this.canvas.height;
    const top         = this.styles.top ?? 15;
    const bottom      = this.styles.bottom ?? 15;
    const left        = this.styles.left ?? 30;
    const right       = this.styles.right ?? 30;
    const innerWidth  = width  - (left + right);
    const innerHeight = height - (top  + bottom);
    const middle      = Math.trunc(innerHeight / 2) + top;

    const gridColor = this.styles.grid ?? 'none';
    const textColor = this.styles.text ?? 'none';
    const fontSize  = parseInt((this.styles.font?.size ?? '13px'), 10);

    // Visualize wave at intervals of `this.plotInterval`
    const numberOfPlots = Math.trunc(this.plotInterval * this.sampleRate);

    // Visualize text at intervals of `this.textInterval`
    const numberOfTexts = Math.trunc(this.textInterval * this.sampleRate);

    // Erase previous wave
    context.clearRect(0, 0, width, height);

    // Begin visualization
    this.visualizeTimeDomainFloat32ArrayOnCanvas(context, data, innerWidth, innerHeight, middle, numberOfPlots);

    if ((gridColor !== 'none') || (textColor !== 'none')) {
      // Visualize grid and text (X axis)
      for (let i = 0, len = data.length; i < len; i++) {
        if ((i % numberOfTexts) === 0) {
          const x = Math.trunc((i / len) * innerWidth) + left;
          const t = `${Math.trunc((i / this.sampleRate) / 60)} min`;

          // Visualize grid
          if (gridColor !== 'none') {
            context.fillStyle = gridColor;
            context.fillRect(x, top, 1, innerHeight);
          }

          // Visualize text
          if (textColor !== 'none') {
            context.fillStyle = textColor;
            context.font      = this.createFontString();
            context.fillText(t, (x - (context.measureText(t).width / 2)), (top + innerHeight + fontSize));
          }
        }
      }

      // Visualize grid and text (Y axis)
      for (const t of ['-1.00', '-0.50', ' 0.00', ' 0.50', ' 1.00']) {
        const x = Math.trunc(left - context.measureText(t).width);
        const y = Math.trunc((1 - parseFloat(t.trim())) * (innerHeight / 2)) + top;

        // Visualize grid
        if (gridColor !== 'none') {
          context.fillStyle = gridColor;
          context.fillRect(left, y, innerWidth, 1);
        }

        // Visualize text
        if (textColor !== 'none') {
          context.fillStyle = textColor;
          context.font      = this.createFontString();
          context.fillText(t, x, (y - Math.trunc(fontSize / 4)));
        }
      }
    }

    // for `update`, `drag`
    this.currentImageData = context.getImageData(0, 0, width, height);
    this.currentDataSize  = data.length;

    // This rectangle displays audio current time
    context.fillStyle = this.currentTime.color ?? 'rgba(0, 0, 0, 0.5)';
    context.fillRect(left, top, 1, innerHeight);
  }

  /**
   * This method visualizes audio wave overview to SVG.
   * @param {Float32Array} data This argument is audio data for visualization.
   * @override
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected override visualizeBySVG(data: Uint8Array | Float32Array, _minDecibels?: number, _maxDecibels?: number): void {
    if ((this.svg === null) || !this.isActive || (data instanceof Uint8Array)) {
      return;
    }

    const svg = this.svg;

    const width       = parseInt((svg.getAttribute('width') ?? '0'), 10);
    const height      = parseInt((svg.getAttribute('height') ?? '0'), 10);
    const top         = this.styles.top ?? 15;
    const bottom      = this.styles.bottom ?? 15;
    const left        = this.styles.left ?? 30;
    const right       = this.styles.right ?? 30;
    const innerWidth  = width  - (left + right);
    const innerHeight = height - (top  + bottom);
    const middle      = Math.trunc(innerHeight / 2) + top;

    const gridColor = this.styles.grid ?? 'none';
    const textColor = this.styles.text ?? 'none';
    const fontSize  = parseInt((this.styles.font?.size ?? '13px'), 10);

    // Visualize wave at intervals of `this.plotInterval`
    const numberOfPlots = Math.trunc(this.plotInterval * this.sampleRate);

    // Visualize text at intervals of `this.textInterval`
    const numberOfTexts = Math.trunc(this.textInterval * this.sampleRate);

    // Erase previous wave
    svg.innerHTML = '';

    // Begin visualization
    const element = this.visualizeTimeDomainFloat32ArrayBySVG(data, innerWidth, innerHeight, middle, numberOfPlots, `${TimeOverview.SVG_LINEAR_GRADIENT_ID_TIME_OVERVIEW}-${this.channel}`);

    if (element) {
      svg.appendChild(element);
    }

    if ((gridColor !== 'none') || (textColor !== 'none')) {
      // Visualize grid and text (X axis)
      for (let i = 0, len = data.length; i < len; i++) {
        if ((i % numberOfTexts) === 0) {
          const x = Math.trunc((i / len) * innerWidth) + left;
          const t = `${Math.trunc((i / this.sampleRate) / 60)} min`;

          // Visualize grid
          if (gridColor !== 'none') {
            const rect = document.createElementNS(TimeOverview.XMLNS, 'rect');

            rect.setAttribute('x',      x.toString(10));
            rect.setAttribute('y',      top.toString(10));
            rect.setAttribute('width',  '1');
            rect.setAttribute('height', innerHeight.toString(10));

            rect.setAttribute('stroke', 'none');
            rect.setAttribute('fill',   gridColor);

            svg.appendChild(rect);
          }

          // Visualize text
          if (textColor !== 'none') {
            const text = document.createElementNS(TimeOverview.XMLNS, 'text');

            text.textContent = t;

            text.setAttribute('x', x.toString(10));
            text.setAttribute('y', (top + innerHeight + fontSize).toString(10));

            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('stroke',      'none');
            text.setAttribute('fill',        textColor);
            text.setAttribute('font-family', (this.styles.font?.family ?? 'Arial'));
            text.setAttribute('font-size',   fontSize.toString(10));
            text.setAttribute('font-style',  (this.styles.font?.style ?? 'normal'));
            text.setAttribute('font-weight', (this.styles.font?.weight ?? 'normal'));

            svg.appendChild(text);
          }
        }
      }

      // Visualize grid and text (Y axis)
      for (const t of ['-1.00', '-0.50', ' 0.00', ' 0.50', ' 1.00']) {
        const x = left;
        const y = Math.trunc((1 - parseFloat(t.trim())) * (innerHeight / 2)) + top;

        // Visualize grid
        if (gridColor !== 'none') {
          const rect = document.createElementNS(TimeOverview.XMLNS, 'rect');

          rect.setAttribute('x',      x.toString(10));
          rect.setAttribute('y',      y.toString(10));
          rect.setAttribute('width',  innerWidth.toString(10));
          rect.setAttribute('height', '1');

          rect.setAttribute('stroke', 'none');
          rect.setAttribute('fill',   gridColor);

          svg.appendChild(rect);
        }

        // Visualize text
        if (textColor !== 'none') {
          const text = document.createElementNS(TimeOverview.XMLNS, 'text');

          text.textContent = t;

          text.setAttribute('x', x.toString(10));
          text.setAttribute('y', (y - Math.trunc(fontSize / 4)).toString(10));

          text.setAttribute('text-anchor', 'end');
          text.setAttribute('stroke',      'none');
          text.setAttribute('fill',        textColor);
          text.setAttribute('font-family', (this.styles.font?.family ?? 'Arial'));
          text.setAttribute('font-size',   fontSize.toString(10));
          text.setAttribute('font-style',  (this.styles.font?.style ?? 'normal'));
          text.setAttribute('font-weight', (this.styles.font?.weight ?? 'normal'));

          svg.appendChild(text);
        }
      }
    }

    // This rectangle displays audio current time
    const rect = document.createElementNS(TimeOverview.XMLNS, 'rect');

    rect.classList.add(SVG_CURRENT_TIME_CLASS_NAME);

    rect.setAttribute('y', (top + 1).toString(10));
    rect.setAttribute('height', (innerHeight - 1).toString(10));
    rect.setAttribute('stroke', 'none');
    rect.setAttribute('fill', (this.currentTime.color ?? 'rgba(0, 0, 0, 0.5)'));

    svg.appendChild(rect);

    // for `update`, `drag`
    this.currentSVGElement = svg;
    this.currentDataSize   = data.length;
  }

  /**
   * This method visualizes rectangle for audio current time.
   * @param {MouseEvent|TouchEvent} event This argument is instance of `MouseEvent` or `TouchEvent`.
   * @param {MouseEventTypes} type This argument is one of 'mousedown', 'mousemove', 'mouseup', 'touchstart', 'touchmove', 'touchend'.
   * @param {number} offsetX This argument is X coordinate on Canvas or SVG from window.
   */
  private visualize(event: MouseEvent | TouchEvent, type: MouseEventTypes, offsetX: number): void {
    let offsetLeft = 0;
    let width      = 0;

    switch (this.graphics) {
      case 'canvas':
        if (this.canvas === null) {
          return;
        }

        offsetLeft = this.canvas.offsetLeft;
        width      = this.canvas.width;
        break;
      case 'svg':
        if (this.svg === null) {
          return;
        }

        offsetLeft = this.svg.parentElement?.offsetLeft ?? 0;
        width      = parseInt((this.svg.getAttribute('width') ?? '0'), 10);
        break;
      default:
        break;
    }

    let x = offsetX - (offsetLeft + (this.styles.left ?? 30));

    if (this.graphics === 'canvas' && this.canvas?.parentElement) {
      x += this.canvas.parentElement.scrollLeft;
    }

    if (this.graphics === 'svg' && this.svg?.parentElement) {
      x += this.svg.parentElement.scrollLeft;
    }

    width -= ((this.styles.left ?? 30) + (this.styles.right ?? 30));

    // Exceed ?
    if (x < 0)     { x = 0; }
    if (x > width) { x = width; }

    const plot = (x / width) * this.currentDataSize;
    const time = plot / this.sampleRate;

    if ((type === 'mousedown') || (type === 'touchstart')) {
      this.offsetX   = x;
      this.startTime = time;
      this.endTime   = 0;
    }

    if ((type === 'mouseup') || (type === 'touchend')) {
      this.endTime = time;
    }

    this.update(time);

    if (this.startTime <= time) {
      this.callback(event, this.startTime, time, this.mode, true);
    } else if (this.startTime > time) {
      this.callback(event, time, this.startTime, this.mode, false);
    }
  }

  /**
   * This method is event listener for visualizing rectangle.
   * @param {MouseEvent} event This argument is instance of `MouseEvent`.
   */
  private onMouseStart(event: MouseEvent): void {
    if (event.type === 'mousedown') {
      this.visualize(event, event.type, this.getOffsetX(event));
    }

    this.isDown = true;
  }

  /**
   * This method is event listener for visualizing rectangle.
   * @param {MouseEvent} event This argument is instance of `MouseEvent`.
   */
  private onMouseMove(event: MouseEvent): void {
    if (!this.isDown) {
      return;
    }

    // Improve rendering performance by stopping event bubbling
    event.stopPropagation();

    if (event.type === 'mousemove') {
      this.visualize(event, event.type, this.getOffsetX(event));
    }
  }

  /**
   * This method is event listener for visualizing rectangle.
   * @param {MouseEvent} event This argument is instance of `MouseEvent`.
   */
  private onMouseUp(event: MouseEvent): void {
    if (!this.isDown) {
      return;
    }

    if (event.type === 'mouseup') {
      this.visualize(event, event.type, this.getOffsetX(event));
    }

    this.isDown = false;
  }

  /**
   * This method is event listener for visualizing rectangle.
   * @param {TouchEvent} event This argument is instance of `TouchEvent`.
   */
  private onTouchStart(event: TouchEvent): void {
    if (event.type === 'touchstart') {
      this.visualize(event, event.type, this.getOffsetX(event));
    }

    this.isDown = true;
  }

  /**
   * This method is event listener for visualizing rectangle.
   * @param {TouchEvent} event This argument is instance of `TouchEvent`.
   */
  private onTouchMove(event: TouchEvent): void {
    if (!this.isDown) {
      return;
    }

    // Improve rendering performance by stopping event bubbling
    event.stopPropagation();

    // for Touch Panel
    event.preventDefault();

    if (event.type === 'touchmove') {
      this.visualize(event, event.type, this.getOffsetX(event));
    }
  }

  /**
   * This method is event listener for visualizing rectangle.
   * @param {TouchEvent} event This argument is instance of `TouchEvent`.
   */
  private onTouchEnd(event: TouchEvent): void {
    if (!this.isDown) {
      return;
    }

    if (event.type === 'touchend') {
      this.visualize(event, event.type, this.getOffsetX(event));
    }

    this.isDown = false;
  }

  /**
   * This method returns X coordinate from instance of `MouseEvent` or `TouchEvent`.
   * @param {MouseEvent|TouchEvent} event This argument is instance of `MouseEvent` or `TouchEvent`.
   * @return {number} Return value is X coordinate as mouse or touch position.
   */
  private getOffsetX(event: MouseEvent | TouchEvent): number {
    if (event instanceof MouseEvent) {
      return event.pageX;
    }

    if (event instanceof TouchEvent) {
      return event.touches[0].pageX;
    }

    return 0;
  }
}
