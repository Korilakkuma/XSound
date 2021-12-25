import { BufferSize } from '../types';
import { SoundModule, SoundModuleParams }  from '../SoundModule';

export type NoiseType = 'whitenoise' | 'pinknoise' | 'browniannoise';

export type NoiseModuleParams = SoundModuleParams & {
  type: NoiseType
};

export type NoiseModuleParam = Partial<Pick<NoiseModuleParams, 'mastervolume' | 'type'>>;

export class NoiseModule extends SoundModule {
  private type: NoiseType = 'whitenoise';
  private runningAnalyser = false;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   * @param {BufferSize} bufferSize This argument is buffer size for `ScriptProcessorNode`.
   */
  constructor(context: AudioContext, bufferSize: BufferSize) {
    super(context, bufferSize);
    this.envelopegenerator.setGenerator(0);
  }

  /**
   * This method defines noop for the same API.
   */
  public setup(): NoiseModule {
    // Noop
    return this;
  }

  /**
   * This method defines noop for the same API.
   */
  public ready(): NoiseModule {
    // Noop
    return this;
  }

  /**
   * This method starts noise.
   * @return {NoiseModule} Return value is for method chain.
   */
  public start(): NoiseModule {
    const startTime = this.context.currentTime;

    // Clear previous
    this.envelopegenerator.clear(true);
    this.processor.disconnect(0);
    this.processor.onaudioprocess = null;

    // ScriptProcessorNode (Input) -> GainNode (Envelope Generator)
    this.connect(this.processor);
    this.envelopegenerator.ready(0, this.processor, null);

    this.envelopegenerator.start(startTime);

    if (!this.runningAnalyser) {
      this.analyser.start('time');
      this.analyser.start('fft');
      this.runningAnalyser = true;
    }

    this.on(startTime);

    const bufferSize = this.processor.bufferSize;

    let lastOut = 0;

    this.processor.onaudioprocess = (event: AudioProcessingEvent) => {
      const outputLs = event.outputBuffer.getChannelData(0);
      const outputRs = event.outputBuffer.getChannelData(1);

      if (this.envelopegenerator.paused()) {
        this.processor.disconnect(0);
        this.processor.onaudioprocess = null;

        this.analyser.stop('time');
        this.analyser.stop('fft');

        this.runningAnalyser = false;
      } else {
        switch (this.type) {
          case 'whitenoise': {
            for (let i = 0; i < bufferSize; i++) {
              outputLs[i] = 2 * (Math.random() - 0.5);
              outputRs[i] = 2 * (Math.random() - 0.5);
            }

            break;
          }

          case 'pinknoise': {
            // ref: https://noisehack.com/generate-noise-web-audio-api/
            let b0 = 0;
            let b1 = 0;
            let b2 = 0;
            let b3 = 0;
            let b4 = 0;
            let b5 = 0;
            let b6 = 0;

            for (let i = 0; i < bufferSize; i++) {
              const white = (Math.random() * 2) - 1;

              b0 = (0.99886 * b0) + (white * 0.0555179);
              b1 = (0.99332 * b1) + (white * 0.0750759);
              b2 = (0.96900 * b2) + (white * 0.1538520);
              b3 = (0.86650 * b3) + (white * 0.3104856);
              b4 = (0.55000 * b4) + (white * 0.5329522);
              b5 = (-0.7616 * b5) - (white * 0.0168980);

              outputLs[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + (white * 0.5362);
              outputRs[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + (white * 0.5362);

              outputLs[i] *= 0.11;
              outputRs[i] *= 0.11;

              b6 = white * 0.115926;
            }

            break;
          }

          case 'browniannoise': {
            // ref: https://noisehack.com/generate-noise-web-audio-api/
            for (let i = 0; i < bufferSize; i++) {
              const white = (Math.random() * 2) - 1;

              outputLs[i] = (lastOut + (0.02 * white)) / 1.02;
              outputRs[i] = (lastOut + (0.02 * white)) / 1.02;

              lastOut = (lastOut + (0.02 * white)) / 1.02;

              outputLs[i] *= 3.5;
              outputRs[i] *= 3.5;
            }

            break;
          }

          default:
            break;
        }
      }
    };

    return this;
  }

  /**
   * This method stops noise.
   * @return {NoiseModule} Return value is for method chain.
   */
  public stop(): NoiseModule {
    const stopTime = this.context.currentTime;

    this.envelopegenerator.stop(stopTime);
    this.off(stopTime);

    return this;
  }

  /**
   * This method gets or sets parameters for noise module.
   * @param {keyof NoiseModuleParam|NoiseModuleParam} params This argument is string if getter. Otherwise, setter.
   * @return {NoiseParam[keyof NoiseParam]|NoiseModule} Return value is parameter for noise module if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: keyof NoiseModuleParam | NoiseModuleParam): NoiseModuleParam[keyof NoiseModuleParam] | NoiseModule {
    if (typeof params === 'string') {
      switch (params) {
        case 'mastervolume':
          return this.mastervolume.gain.value;
        case 'type':
          return this.type;
        default:
          return this;
      }
    }

    for (const [key, value] of Object.entries(params)) {
      switch (key) {
        case 'mastervolume':
          if (typeof value === 'number') {
            this.mastervolume.gain.value = value;
          }

          break;
        case 'type':
          if (typeof value === 'string') {
            this.type = value;
          }

          break;
        default:
          break;
      }
    }

    return this;
  }

  /** @override */
  public params(): NoiseModuleParams {
    const params = super.params();

    return {
      ...params,
      type: this.type
    };
  }

  /** @override */
  public toString(): string {
    return '[NoiseModule]';
  }
}
