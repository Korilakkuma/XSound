import { BufferSize } from '../types';
import { SoundModule, SoundModuleParams, Module, ModuleName } from '../SoundModule';
import { Analyser } from '../SoundModule/Analyser';
import { Recorder } from '../SoundModule/Recorder';
import { Session } from '../SoundModule/Session';
import { Autopanner } from '../SoundModule/Effectors/Autopanner';
import { Chorus } from '../SoundModule/Effectors/Chorus';
import { Compressor } from '../SoundModule/Effectors/Compressor';
import { Delay } from '../SoundModule/Effectors/Delay';
import { Distortion } from '../SoundModule/Effectors/Distortion';
import { EnvelopeGenerator } from '../SoundModule/Effectors/EnvelopeGenerator';
import { Equalizer } from '../SoundModule/Effectors/Equalizer';
import { Filter } from '../SoundModule/Effectors/Filter';
import { Flanger } from '../SoundModule/Effectors/Flanger';
import { Listener } from '../SoundModule/Effectors/Listener';
import { Panner } from '../SoundModule/Effectors/Panner';
import { Phaser } from '../SoundModule/Effectors/Phaser';
import { PitchShifter } from '../SoundModule/Effectors/PitchShifter';
import { Reverb } from '../SoundModule/Effectors/Reverb';
import { Ringmodulator } from '../SoundModule/Effectors/Ringmodulator';
import { Stereo } from '../SoundModule/Effectors/Stereo';
import { Tremolo } from '../SoundModule/Effectors/Tremolo';
import { Wah } from '../SoundModule/Effectors/Wah';

export type NoiseType = 'whitenoise' | 'pinknoise' | 'browniannoise';

export type NoiseModuleParams = SoundModuleParams & {
  type: NoiseType
};

type Params = Partial<Pick<NoiseModuleParams, 'mastervolume' | 'type'>>;

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
   * @param {keyof Params|Params} params This argument is string if getter. Otherwise, setter.
   * @return {Params[keyof Params]|NoiseModule} Return value is parameter for noise module if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: 'mastervolume'): number;
  public param(params: 'type'): NoiseType;
  public param(params: Params): NoiseModule;
  public param(params: keyof Params | Params): Params[keyof Params] | NoiseModule {
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

  /**
   * This method gets instance of `Module` (Analyser, Recorder, Effector ... etc).
   * @param {ModuleName} moduleName This argument selects module.
   * @return {Module}
   */
  public module(moduleName: 'analyser'): Analyser;
  public module(moduleName: 'recorder'): Recorder;
  public module(moduleName: 'session'): Session;
  public module(moduleName: 'autopanner'): Autopanner;
  public module(moduleName: 'chorus'): Chorus;
  public module(moduleName: 'compressor'): Compressor;
  public module(moduleName: 'delay'): Delay;
  public module(moduleName: 'distortion'): Distortion;
  public module(moduleName: 'equalizer'): Equalizer;
  public module(moduleName: 'filter'): Filter;
  public module(moduleName: 'flanger'): Flanger;
  public module(moduleName: 'listener'): Listener;
  public module(moduleName: 'panner'): Panner;
  public module(moduleName: 'phaser'): Phaser;
  public module(moduleName: 'pitchshifter'): PitchShifter;
  public module(moduleName: 'reverb'): Reverb;
  public module(moduleName: 'ringmodulator'): Ringmodulator;
  public module(moduleName: 'stereo'): Stereo;
  public module(moduleName: 'tremolo'): Tremolo;
  public module(moduleName: 'wah'): Wah;
  public module(moduleName: 'envelopegenerator'): EnvelopeGenerator;
  public module(moduleName: ModuleName): Module | null {
    switch (moduleName) {
      case 'analyser':
        return this.analyser;
      case 'recorder':
        return this.recorder;
      case 'session':
        return this.session;
      case 'autopanner':
        return this.autopanner;
      case 'chorus':
        return this.chorus;
      case 'compressor':
        return this.compressor;
      case 'delay':
        return this.delay;
      case 'distortion':
        return this.distortion;
      case 'equalizer':
        return this.equalizer;
      case 'filter':
        return this.filter;
      case 'flanger':
        return this.flanger;
      case 'listener':
        return this.listener;
      case 'panner':
        return this.panner;
      case 'phaser':
        return this.phaser;
      case 'pitchshifter':
        return this.pitchshifter;
      case 'reverb':
        return this.reverb;
      case 'ringmodulator':
        return this.ringmodulator;
      case 'stereo':
        return this.stereo;
      case 'tremolo':
        return this.tremolo;
      case 'wah':
        return this.wah;
      case 'envelopegenerator':
        return this.envelopegenerator;
      default:
        return null;
    }
  }

  /** @override */
  public override resize(bufferSize: BufferSize): NoiseModule {
    super.init(this.context, bufferSize);
    return this;
  }

  /** @override */
  public override on(startTime?: number): NoiseModule {
    super.on(startTime);
    return this;
  }

  /** @override */
  public override off(stopTime?: number): NoiseModule {
    super.off(stopTime);
    return this;
  }

  /** @override */
  public override suspend(): NoiseModule {
    super.suspend();
    return this;
  }

  /**
   * This method gets noise module parameters as associative array.
   * @return {NoiseModuleParams}
   * @override
   */
  public override params(): NoiseModuleParams {
    const params = super.params();

    return {
      ...params,
      type: this.type
    };
  }
}
