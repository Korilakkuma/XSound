import { Connectable } from '../interfaces';
import { BufferSize } from '../types';
import { Analyser } from './Analyser';
import { Recorder } from './Recorder';
import { Session } from './Session';
import { Effector } from './Effectors/Effector';
import { Autopanner, AutopannerParams } from './Effectors/Autopanner';
import { BitCrusher, BitCrusherParams } from './Effectors/BitCrusher';
import { Chorus, ChorusParams } from './Effectors/Chorus';
import { Compressor, CompressorParams } from './Effectors/Compressor';
import { Delay, DelayParams } from './Effectors/Delay';
import { EnvelopeGenerator, EnvelopeGeneratorParams } from './Effectors/EnvelopeGenerator';
import { Equalizer, EqualizerParams } from './Effectors/Equalizer';
import { Filter, FilterParams } from './Effectors/Filter';
import { Flanger, FlangerParams } from './Effectors/Flanger';
import { Fuzz, FuzzParams } from './Effectors/Fuzz';
import { Listener, ListenerParams } from './Effectors/Listener';
import { NoiseGate, NoiseGateParams }  from '../SoundModule/Effectors/NoiseGate';
import { NoiseSuppressor, NoiseSuppressorParams }  from '../SoundModule/Effectors/NoiseSuppressor';
import { OverDrive, OverDriveParams }  from '../SoundModule/Effectors/OverDrive';
import { Panner, PannerParams } from './Effectors/Panner';
import { Phaser, PhaserParams } from './Effectors/Phaser';
import { PitchShifter, PitchShifterParams } from './Effectors/PitchShifter';
import { Preamp, PreampParams } from './Effectors/Preamp';
import { Reverb, ReverbParams } from './Effectors/Reverb';
import { Ringmodulator, RingmodulatorParams } from './Effectors/Ringmodulator';
import { Stereo, StereoParams } from './Effectors/Stereo';
import { Tremolo, TremoloParams } from './Effectors/Tremolo';
import { VocalCanceler, VocalCancelerParams } from './Effectors/VocalCanceler';
import { Wah, WahParams } from './Effectors/Wah';

export type Module     = Analyser | Recorder | Session | Stereo | Compressor | BitCrusher | OverDrive | Fuzz | Preamp | Wah | PitchShifter | Equalizer | Filter | Autopanner | Tremolo | Ringmodulator | Phaser | Flanger | Chorus | Delay | Reverb | Panner | Listener | EnvelopeGenerator | NoiseGate | NoiseSuppressor | VocalCanceler;
export type ModuleName = 'analyser' | 'recorder' | 'session' | 'autopanner' | 'bitcrusher' | 'overdrive' | 'fuzz' | 'chorus' | 'compressor' | 'delay' | 'preamp' | 'equalizer' | 'filter' | 'flanger' | 'listener' | 'panner' | 'phaser' | 'pitchshifter' | 'reverb' | 'ringmodulator' | 'stereo' | 'tremolo' | 'wah' | 'envelopegenerator' | 'noisegate' | 'noisesuppressor' | 'vocalcanceler';

export type SoundModuleParams = {
  mastervolume?: number,
  stereo?: StereoParams,
  compressor?: CompressorParams,
  bitcrusher?: BitCrusherParams,
  overdrive?: OverDriveParams,
  fuzz?: FuzzParams,
  preamp?: PreampParams,
  wah?: WahParams,
  pitchshifter?: PitchShifterParams,
  equalizer?: EqualizerParams,
  filter?: FilterParams,
  autopanner?: AutopannerParams,
  tremolo?: TremoloParams,
  ringmodulator?: RingmodulatorParams,
  phaser?: PhaserParams,
  flanger?: FlangerParams,
  chorus?: ChorusParams,
  delay?: DelayParams,
  reverb?: ReverbParams,
  panner?: PannerParams,
  listener?: ListenerParams,
  envelopegenerator?: EnvelopeGeneratorParams,
  noisegate?: NoiseGateParams,
  noisesuppressor?: NoiseSuppressorParams,
  vocalcanceler?: VocalCancelerParams
};

/**
 * This class is superclass that is the top in this library.
 * This class is extended as subclass (`OscillatorModule`, `OneshotModule`, `NoiseModule`, `AudioModule`, `MediaModule`, `StreamModule`, `ProcessorModule`, `MixerModule` ...etc).
 * @constructor
 * @abstract
 */
export abstract class SoundModule implements Connectable {
  public static readonly NUMBER_OF_INPUTS  = 2;
  public static readonly NUMBER_OF_OUTPUTS = 2;

  protected context: AudioContext;

  protected modules: Connectable[] = [];

  protected mastervolume: GainNode;
  protected processor: ScriptProcessorNode;

  protected analyser: Analyser;
  protected recorder: Recorder;
  protected session: Session;

  protected stereo: Stereo;
  protected compressor: Compressor;
  protected bitcrusher: BitCrusher;
  protected overdrive: OverDrive;
  protected fuzz: Fuzz;
  protected preamp: Preamp;
  protected wah: Wah;
  protected pitchshifter: PitchShifter;
  protected equalizer: Equalizer;
  protected filter: Filter;
  protected autopanner: Autopanner;
  protected tremolo: Tremolo;
  protected ringmodulator: Ringmodulator;
  protected phaser: Phaser;
  protected flanger: Flanger;
  protected chorus: Chorus;
  protected delay: Delay;
  protected reverb: Reverb;
  protected panner: Panner;
  protected listener: Listener;
  protected envelopegenerator: EnvelopeGenerator;
  protected noisegate: NoiseGate;
  protected noisesuppressor: NoiseSuppressor;
  protected vocalcanceler: VocalCanceler;

  protected runningAnalyser = false;
  protected mixed = false;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   * @param {BufferSize} bufferSize This argument is buffer size for `ScriptProcessorNode`.
   */
  constructor(context: AudioContext, bufferSize: BufferSize) {
    this.context = context;

    this.mastervolume = context.createGain();
    this.processor    = context.createScriptProcessor(bufferSize, SoundModule.NUMBER_OF_INPUTS, SoundModule.NUMBER_OF_OUTPUTS);

    this.analyser          = new Analyser(context);
    this.recorder          = new Recorder(context, bufferSize, 2, 2);
    this.session           = new Session(context);
    this.stereo            = new Stereo(context, bufferSize);
    this.compressor        = new Compressor(context);
    this.bitcrusher        = new BitCrusher(context);
    this.overdrive         = new OverDrive(context);
    this.fuzz              = new Fuzz(context);
    this.preamp            = new Preamp(context);
    this.wah               = new Wah(context);
    this.pitchshifter      = new PitchShifter(context, bufferSize);
    this.equalizer         = new Equalizer(context);
    this.filter            = new Filter(context);
    this.autopanner        = new Autopanner(context);
    this.tremolo           = new Tremolo(context);
    this.ringmodulator     = new Ringmodulator(context);
    this.phaser            = new Phaser(context);
    this.flanger           = new Flanger(context);
    this.chorus            = new Chorus(context);
    this.delay             = new Delay(context);
    this.reverb            = new Reverb(context);
    this.panner            = new Panner(context);
    this.listener          = new Listener(context);
    this.envelopegenerator = new EnvelopeGenerator(context);
    this.noisegate         = new NoiseGate(context);
    this.noisesuppressor   = new NoiseSuppressor(context, bufferSize);
    this.vocalcanceler     = new VocalCanceler(context, bufferSize);

    // The default order for connection
    this.modules = [
      this.compressor,
      this.wah,
      this.bitcrusher,
      this.overdrive,
      this.fuzz,
      this.preamp,
      this.equalizer,
      this.filter,
      this.noisegate,
      this.noisesuppressor,
      this.pitchshifter,
      this.tremolo,
      this.ringmodulator,
      this.phaser,
      this.flanger,
      this.chorus,
      this.delay,
      this.reverb,
      this.panner,
      this.autopanner,
      this.vocalcanceler,
      this.stereo
    ];
  }

  /**
   * This method connects `AudioNode`s.
   * @param {AudioNode} source This argument is `AudioNode` as sound source.
   */
  public connect(source: AudioNode): void {
    // Start connection
    // AudioSourceNode (Input)-> AudioNode -> ... -> AudioNode -> GainNode (Master Volume) -> AnalyserNode  -> AudioDestinationNode (Output)
    source.disconnect(0);  // Clear connection

    if (this.modules.length > 0) {
      const input = this.modules[0].INPUT;

      if (input === null) {
        return;
      }

      source.connect(input);
    } else {
      source.connect(this.mastervolume);
    }

    for (let i = 0, len = this.modules.length; i < len; i++) {
      const output = this.modules[i].OUTPUT;

      if (output === null) {
        continue;
      }

      // Clear connection
      output.disconnect(0);

      if (i < (this.modules.length - 1)) {
        const input = this.modules[i + 1].INPUT;

        if (input === null) {
          continue;
        }

        // Connect to next `AudioNode`
        output.connect(input);
      } else {
        output.connect(this.mastervolume);
      }
    }

    this.mastervolume.connect(this.context.destination);

    // for analyser
    this.mastervolume.connect(this.analyser.INPUT);

    // for recorder
    this.mastervolume.connect(this.recorder.INPUT);
    this.recorder.OUTPUT.connect(this.context.destination);

    // for session
    this.mastervolume.connect(this.session.INPUT);
    this.session.OUTPUT.connect(this.context.destination);
  }

  /**
   * This method changes buffer size for `ScriptProcessorNode`.
   * If resize is needed, should invoke this method on initialization.
   * @param {BufferSize} bufferSize This argument is buffer size for `ScriptProcessorNode`.
   * @return {SoundModule} Return value is for method chain.
   */
  public resize(bufferSize: BufferSize): SoundModule {
    this.init(this.context, bufferSize);
    return this;
  }

  /**
   * This method gets buffer size for `ScriptProcessorNode`.
   * @return {BufferSize}
   */
  public getBufferSize(): number {
    return this.processor.bufferSize;
  }

  /**
   * This method installs customized effector.
   * @param {string} effectorName This argument selects effector.
   * @param {Effector} effector This argument is subclass that extends `Effector` class.
   * @return {Effector} Return value is instance of customized effector.
   */
  public install(effectorName: string, effector: Effector): Effector {
    if (this.modules.every((module: Connectable) => module !== effector)) {
      this.modules.push(effector);
    }

    return effector;
  }

  /**
   * This method starts effectors.
   * @param {number} startTime This argument is used for scheduling parameter.
   * @return {SoundModule} Return value is for method chain.
   */
  public on(startTime?: number): SoundModule {
    const s = startTime ?? this.context.currentTime;

    this.stereo.start();
    this.bitcrusher.start();
    this.overdrive.start();
    this.fuzz.start();
    this.chorus.start(s);
    this.flanger.start(s);
    this.phaser.start(s);
    this.autopanner.start(s);
    this.tremolo.start(s);
    this.ringmodulator.start(s);
    this.wah.start(s);
    this.filter.start(s);

    return this;
  }

  /**
   * This method stops effectors.
   * @param {number} stopTime This argument is used for scheduling parameter.
   * @return {SoundModule} Return value is for method chain.
   */
  public off(stopTime?: number): SoundModule {
    const s = stopTime ?? this.context.currentTime;

    this.stereo.stop();
    this.bitcrusher.stop();
    this.overdrive.stop();
    this.fuzz.stop();
    this.chorus.stop(s);
    this.flanger.stop(s);
    this.phaser.stop(s);
    this.autopanner.stop(s);
    this.tremolo.stop(s);
    this.ringmodulator.stop(s);
    this.wah.stop(s);
    this.filter.stop(s);

    return this;
  }

  /**
   * This method stops analyser, recorder and `onaudioprocess` event.
   * @return {SoundModule} Return value is for method chain.
   */
  public suspend(): SoundModule {
    this.analyser.stop('time');
    this.analyser.stop('fft');
    this.runningAnalyser = false;

    this.recorder.stop();

    this.processor.disconnect(0);

    return this;
  }

  /**
   * This method is invoked on mixing.
   * @return {SoundModule} Return value is for method chain.
   */
  public mix(): SoundModule {
    this.mixed = true;
    return this;
  }

  /**
   * This method is invoked on demixing.
   * @return {SoundModule} Return value is for method chain.
   */
  public demix(): SoundModule {
    this.mixed = false;
    return this;
  }

  /**
   * This method gets effector's parameters as associative array.
   * @return {SoundModuleParams}
   */
  public params(): Required<SoundModuleParams> {
    return {
      mastervolume     : this.mastervolume.gain.value,
      stereo           : this.stereo.params(),
      compressor       : this.compressor.params(),
      bitcrusher       : this.bitcrusher.params(),
      overdrive        : this.overdrive.params(),
      fuzz             : this.fuzz.params(),
      preamp           : this.preamp.params(),
      wah              : this.wah.params(),
      pitchshifter     : this.pitchshifter.params(),
      equalizer        : this.equalizer.params(),
      filter           : this.filter.params(),
      autopanner       : this.autopanner.params(),
      tremolo          : this.tremolo.params(),
      ringmodulator    : this.ringmodulator.params(),
      phaser           : this.phaser.params(),
      flanger          : this.flanger.params(),
      chorus           : this.chorus.params(),
      delay            : this.delay.params(),
      reverb           : this.reverb.params(),
      panner           : this.panner.params(),
      listener         : this.listener.params(),
      envelopegenerator: this.envelopegenerator.params(),
      noisegate        : this.noisegate.params(),
      noisesuppressor  : this.noisesuppressor.params(),
      vocalcanceler    : this.vocalcanceler.params()
    };
  }

  /**
   * This method edits module to use and module connection order.
   * @param {Array<Connectable>} modules This argument is edited modules.
   * @return {Array<Connectable>} Return value is previous modules.
   */
  public edit(modules: Connectable[]): Connectable[] {
    const previousModules = this.modules;

    this.modules = modules;

    return previousModules;
  }

  /**
   * This method gets effector's parameters as JSON.
   * @return {string}
   */
  public toJSON(): string {
    return JSON.stringify(this.params());
  }

  /**
   * Connector for input.
   */
  public abstract get INPUT(): GainNode | ScriptProcessorNode | null;

  /**
   * Connector for output.
   */
  public abstract get OUTPUT(): GainNode;

  /**
   * This method re-initials modules.
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   * @param {BufferSize} bufferSize This argument is buffer size for `ScriptProcessorNode`.
   */
  protected init(context: AudioContext, bufferSize: BufferSize): void {
    this.mastervolume.disconnect(0);
    this.processor.disconnect(0);
    this.analyser.INPUT.disconnect(0);
    this.recorder.INPUT.disconnect(0);
    this.session.INPUT.disconnect(0);

    for (const module of this.modules) {
      if (module.INPUT) {
        module.INPUT.disconnect(0);
      }

      if (module.OUTPUT) {
        module.OUTPUT.disconnect(0);
      }
    }

    this.modules.length = 0;

    this.processor = context.createScriptProcessor(bufferSize, SoundModule.NUMBER_OF_INPUTS, SoundModule.NUMBER_OF_OUTPUTS);

    this.analyser          = new Analyser(context);
    this.recorder          = new Recorder(context, bufferSize, 2, 2);
    this.session           = new Session(context);
    this.stereo            = new Stereo(context, bufferSize);
    this.compressor        = new Compressor(context);
    this.bitcrusher        = new BitCrusher(context);
    this.overdrive         = new OverDrive(context);
    this.fuzz              = new Fuzz(context);
    this.preamp            = new Preamp(context);
    this.wah               = new Wah(context);
    this.pitchshifter      = new PitchShifter(context, bufferSize);
    this.equalizer         = new Equalizer(context);
    this.filter            = new Filter(context);
    this.autopanner        = new Autopanner(context);
    this.tremolo           = new Tremolo(context);
    this.ringmodulator     = new Ringmodulator(context);
    this.phaser            = new Phaser(context);
    this.flanger           = new Flanger(context);
    this.chorus            = new Chorus(context);
    this.delay             = new Delay(context);
    this.reverb            = new Reverb(context);
    this.panner            = new Panner(context);
    this.listener          = new Listener(context);
    this.envelopegenerator = new EnvelopeGenerator(context);
    this.noisegate         = new NoiseGate(context);
    this.noisesuppressor   = new NoiseSuppressor(context, bufferSize);
    this.vocalcanceler     = new VocalCanceler(context, bufferSize);

    // The default order for connection
    this.modules = [
      this.compressor,
      this.wah,
      this.bitcrusher,
      this.overdrive,
      this.fuzz,
      this.preamp,
      this.equalizer,
      this.filter,
      this.noisegate,
      this.noisesuppressor,
      this.pitchshifter,
      this.tremolo,
      this.ringmodulator,
      this.phaser,
      this.flanger,
      this.chorus,
      this.delay,
      this.reverb,
      this.panner,
      this.autopanner,
      this.vocalcanceler,
      this.stereo
    ];
  }
}
