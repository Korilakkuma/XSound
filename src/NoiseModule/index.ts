import type { SoundModuleParams, Module, ModuleName } from '../SoundModule';
import type { NoiseProcessingMessageEventData } from './NoiseModuleProcessor';
import type { Analyser } from '../SoundModule/Analyser';
import type { Recorder } from '../SoundModule/Recorder';
import type { Autopanner } from '../SoundModule/Effectors/Autopanner';
import type { BitCrusher } from '../SoundModule/Effectors/BitCrusher';
import type { Chorus } from '../SoundModule/Effectors/Chorus';
import type { Compressor } from '../SoundModule/Effectors/Compressor';
import type { Delay } from '../SoundModule/Effectors/Delay';
import type { EnvelopeGenerator } from '../SoundModule/Effectors/EnvelopeGenerator';
import type { Equalizer } from '../SoundModule/Effectors/Equalizer';
import type { Filter } from '../SoundModule/Effectors/Filter';
import type { Flanger } from '../SoundModule/Effectors/Flanger';
import type { Fuzz } from '../SoundModule/Effectors/Fuzz';
import type { Listener } from '../SoundModule/Effectors/Listener';
import type { NoiseGate } from '../SoundModule/Effectors/NoiseGate';
import type { NoiseSuppressor } from '../SoundModule/Effectors/NoiseSuppressor';
import type { OverDrive } from '../SoundModule/Effectors/OverDrive';
import type { Panner } from '../SoundModule/Effectors/Panner';
import type { Phaser } from '../SoundModule/Effectors/Phaser';
import type { PitchShifter } from '../SoundModule/Effectors/PitchShifter';
import type { Preamp } from '../SoundModule/Effectors/Preamp';
import type { Reverb } from '../SoundModule/Effectors/Reverb';
import type { Ringmodulator } from '../SoundModule/Effectors/Ringmodulator';
import type { Stereo } from '../SoundModule/Effectors/Stereo';
import type { Tremolo } from '../SoundModule/Effectors/Tremolo';
import type { VocalCanceler } from '../SoundModule/Effectors/VocalCanceler';
import type { Wah } from '../SoundModule/Effectors/Wah';

import { SoundModule } from '../SoundModule';
import { NoiseModuleProcessor } from './NoiseModuleProcessor';

// @ts-expect-error Because of import WebAssembly Module
import wasm from './WebAssemblyModules/noisegenerator.wasm';

export type NoiseType = 'whitenoise' | 'pinknoise' | 'browniannoise';

export type NoiseModuleParams = SoundModuleParams & {
  type?: NoiseType
};

export { NoiseModuleProcessor };

/**
 * This subclass is for generating noise.
 */
export class NoiseModule extends SoundModule {
  private type: NoiseType = 'whitenoise';

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context);

    this.processor = new AudioWorkletNode(context, NoiseModuleProcessor.name);

    this.envelopegenerator.setGenerator(0);

    fetch(wasm)
      .then(async (response) => {
        const wasm = await response.arrayBuffer();

        this.processor.port.postMessage(wasm);
      })
      .catch((error: Error) => {
        throw error;
      });
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

    if (!this.mixed) {
      // AudioWorkletNode (Input) -> GainNode (Envelope Generator)
      const generator = this.envelopegenerator.getGenerator(0);

      if (generator) {
        this.connect(generator);
      }
    }

    this.envelopegenerator.ready(0, this.processor, null);

    this.envelopegenerator.start(startTime);

    if (!this.runningAnalyser) {
      this.analyser.start('time', 0);
      this.analyser.start('time', 1);
      this.analyser.start('fft', 0);
      this.analyser.start('fft', 1);
      this.analyser.start('spectrogram', 0);
      this.analyser.start('spectrogram', 1);

      this.runningAnalyser = true;
    }

    this.on(startTime);

    const message: NoiseProcessingMessageEventData = { processing: true };

    this.processor.port.postMessage(message);

    return this;
  }

  /**
   * This method stops noise.
   * @return {NoiseModule} Return value is for method chain.
   */
  public stop(): NoiseModule {
    const stopTime = this.context.currentTime;

    // Attack or Decay or Sustain -> Release
    this.envelopegenerator.stop(stopTime);

    this.off(stopTime);

    const message: NoiseProcessingMessageEventData = { processing: false };

    this.processor.port.postMessage(message);

    return this;
  }

  /**
   * This method gets or sets parameters for noise module.
   * @param {keyof NoiseModuleParams|NoiseModuleParams} params This argument is string if getter. Otherwise, setter.
   * @return {NoiseModuleParams[keyof NoiseModuleParams]|NoiseModule} Return value is parameter for noise module if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: 'mastervolume'): number;
  public param(params: 'type'): NoiseType;
  public param(params: NoiseModuleParams): NoiseModule;
  public param(params: keyof NoiseModuleParams | NoiseModuleParams): NoiseModuleParams[keyof NoiseModuleParams] | NoiseModule {
    if (typeof params === 'string') {
      switch (params) {
        case 'mastervolume': {
          return this.mastervolume.gain.value;
        }

        case 'type': {
          return this.type;
        }
      }
    }

    for (const [key, value] of Object.entries(params)) {
      switch (key) {
        case 'mastervolume': {
          if (typeof value === 'number') {
            this.mastervolume.gain.value = value;
          }

          break;
        }

        case 'type': {
          if (typeof value === 'string') {
            if ((value === 'whitenoise') || (value === 'pinknoise') || (value === 'browniannoise')) {
              this.type = value;

              const message: NoiseModuleParams = { type: value };

              this.processor.port.postMessage(message);
            }
          }

          break;
        }
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
  public module(moduleName: 'autopanner'): Autopanner;
  public module(moduleName: 'bitcrusher'): BitCrusher;
  public module(moduleName: 'chorus'): Chorus;
  public module(moduleName: 'compressor'): Compressor;
  public module(moduleName: 'delay'): Delay;
  public module(moduleName: 'envelopegenerator'): EnvelopeGenerator;
  public module(moduleName: 'equalizer'): Equalizer;
  public module(moduleName: 'filter'): Filter;
  public module(moduleName: 'flanger'): Flanger;
  public module(moduleName: 'fuzz'): Fuzz;
  public module(moduleName: 'listener'): Listener;
  public module(moduleName: 'noisegate'): NoiseGate;
  public module(moduleName: 'noisesuppressor'): NoiseSuppressor;
  public module(moduleName: 'overdrive'): OverDrive;
  public module(moduleName: 'panner'): Panner;
  public module(moduleName: 'phaser'): Phaser;
  public module(moduleName: 'pitchshifter'): PitchShifter;
  public module(moduleName: 'preamp'): Preamp;
  public module(moduleName: 'reverb'): Reverb;
  public module(moduleName: 'ringmodulator'): Ringmodulator;
  public module(moduleName: 'stereo'): Stereo;
  public module(moduleName: 'tremolo'): Tremolo;
  public module(moduleName: 'vocalcanceler'): VocalCanceler;
  public module(moduleName: 'wah'): Wah;
  public module(moduleName: ModuleName): Module {
    switch (moduleName) {
      case 'analyser': {
        return this.analyser;
      }

      case 'recorder': {
        return this.recorder;
      }

      case 'autopanner': {
        return this.autopanner;
      }

      case 'bitcrusher': {
        return this.bitcrusher;
      }

      case 'chorus': {
        return this.chorus;
      }

      case 'compressor': {
        return this.compressor;
      }

      case 'delay': {
        return this.delay;
      }

      case 'envelopegenerator': {
        return this.envelopegenerator;
      }

      case 'equalizer': {
        return this.equalizer;
      }

      case 'filter': {
        return this.filter;
      }

      case 'flanger': {
        return this.flanger;
      }

      case 'fuzz': {
        return this.fuzz;
      }

      case 'listener': {
        return this.listener;
      }

      case 'noisegate': {
        return this.noisegate;
      }

      case 'noisesuppressor': {
        return this.noisesuppressor;
      }

      case 'overdrive': {
        return this.overdrive;
      }

      case 'panner': {
        return this.panner;
      }

      case 'phaser': {
        return this.phaser;
      }

      case 'pitchshifter': {
        return this.pitchshifter;
      }

      case 'preamp': {
        return this.preamp;
      }

      case 'reverb': {
        return this.reverb;
      }

      case 'ringmodulator': {
        return this.ringmodulator;
      }

      case 'stereo': {
        return this.stereo;
      }

      case 'tremolo': {
        return this.tremolo;
      }

      case 'vocalcanceler': {
        return this.vocalcanceler;
      }

      case 'wah': {
        return this.wah;
      }
    }
  }

  /** @override */
  public override disconnect() {
    const generator = this.envelopegenerator.getGenerator(0);

    if (generator) {
      generator.disconnect(0);
    }
  }

  /**
   * This method gets noise module parameters as associative array.
   * @return {NoiseModuleParams}
   * @override
   */
  public override params(): Required<NoiseModuleParams> {
    const params = super.params();

    return {
      ...params,
      type: this.type
    };
  }

  /** @override */
  public override get INPUT(): GainNode | null {
    const generator = this.envelopegenerator.getGenerator(0);

    if (generator) {
      return generator;
    }

    return null;
  }

  /** @override */
  public override get OUTPUT(): GainNode {
    return this.mastervolume;
  }
}
