import type { Connectable } from '../interfaces';
import type { Effector } from './Effectors/Effector';
import type { AutopannerParams } from './Effectors/Autopanner';
import type { BitCrusherParams } from './Effectors/BitCrusher';
import type { ChorusParams } from './Effectors/Chorus';
import type { CompressorParams } from './Effectors/Compressor';
import type { DelayParams } from './Effectors/Delay';
import type { EnvelopeGeneratorParams } from './Effectors/EnvelopeGenerator';
import type { EqualizerParams } from './Effectors/Equalizer';
import type { FilterParams } from './Effectors/Filter';
import type { FlangerParams } from './Effectors/Flanger';
import type { FuzzParams } from './Effectors/Fuzz';
import type { ListenerParams } from './Effectors/Listener';
import type { NoiseGateParams } from '../SoundModule/Effectors/NoiseGate';
import type { NoiseSuppressorParams } from '../SoundModule/Effectors/NoiseSuppressor';
import type { OverDriveParams } from '../SoundModule/Effectors/OverDrive';
import type { PannerParams } from './Effectors/Panner';
import type { PhaserParams } from './Effectors/Phaser';
import type { PitchShifterParams } from './Effectors/PitchShifter';
import type { PreampParams } from './Effectors/Preamp';
import type { ReverbParams } from './Effectors/Reverb';
import type { RingmodulatorParams } from './Effectors/Ringmodulator';
import type { StereoParams } from './Effectors/Stereo';
import type { TremoloParams } from './Effectors/Tremolo';
import type { VocalCancelerParams } from './Effectors/VocalCanceler';
import type { WahParams } from './Effectors/Wah';

import { SoundModuleProcessor } from './SoundModuleProcessor';
import { Analyser } from './Analyser';
import { Recorder } from './Recorder';
import { Autopanner } from './Effectors/Autopanner';
import { BitCrusher } from './Effectors/BitCrusher';
import { Chorus } from './Effectors/Chorus';
import { Compressor } from './Effectors/Compressor';
import { Delay } from './Effectors/Delay';
import { EnvelopeGenerator } from './Effectors/EnvelopeGenerator';
import { Equalizer } from './Effectors/Equalizer';
import { Filter } from './Effectors/Filter';
import { Flanger } from './Effectors/Flanger';
import { Fuzz } from './Effectors/Fuzz';
import { Listener } from './Effectors/Listener';
import { NoiseGate }  from '../SoundModule/Effectors/NoiseGate';
import { NoiseSuppressor }  from '../SoundModule/Effectors/NoiseSuppressor';
import { OverDrive }  from '../SoundModule/Effectors/OverDrive';
import { Panner } from './Effectors/Panner';
import { Phaser } from './Effectors/Phaser';
import { PitchShifter } from './Effectors/PitchShifter';
import { Preamp } from './Effectors/Preamp';
import { Reverb } from './Effectors/Reverb';
import { Ringmodulator } from './Effectors/Ringmodulator';
import { Stereo } from './Effectors/Stereo';
import { Tremolo } from './Effectors/Tremolo';
import { VocalCanceler } from './Effectors/VocalCanceler';
import { Wah } from './Effectors/Wah';

export type Module =
  Analyser          |
  Recorder          |
  Autopanner        |
  BitCrusher        |
  Chorus            |
  Compressor        |
  Delay             |
  EnvelopeGenerator |
  Equalizer         |
  Filter            |
  Flanger           |
  Fuzz              |
  Listener          |
  NoiseGate         |
  NoiseSuppressor   |
  OverDrive         |
  Panner            |
  Phaser            |
  PitchShifter      |
  Preamp            |
  Reverb            |
  Ringmodulator     |
  Stereo            |
  Tremolo           |
  VocalCanceler     |
  Wah;

export type ModuleName =
  'analyser'          |
  'recorder'          |
  'autopanner'        |
  'bitcrusher'        |
  'chorus'            |
  'compressor'        |
  'delay'             |
  'envelopegenerator' |
  'equalizer'         |
  'filter'            |
  'flanger'           |
  'fuzz'              |
  'listener'          |
  'noisegate'         |
  'noisesuppressor'   |
  'overdrive'         |
  'panner'            |
  'phaser'            |
  'pitchshifter'      |
  'preamp'            |
  'reverb'            |
  'ringmodulator'     |
  'stereo'            |
  'tremolo'           |
  'vocalcanceler'     |
  'wah';

export type SoundModuleParams = {
  mastervolume?: number,
  autopanner?: AutopannerParams,
  bitcrusher?: BitCrusherParams,
  chorus?: ChorusParams,
  compressor?: CompressorParams,
  delay?: DelayParams,
  envelopegenerator?: EnvelopeGeneratorParams,
  equalizer?: EqualizerParams,
  filter?: FilterParams,
  flanger?: FlangerParams,
  fuzz?: FuzzParams,
  listener?: ListenerParams,
  noisegate?: NoiseGateParams,
  noisesuppressor?: NoiseSuppressorParams,
  overdrive?: OverDriveParams,
  panner?: PannerParams,
  phaser?: PhaserParams,
  pitchshifter?: PitchShifterParams,
  preamp?: PreampParams,
  reverb?: ReverbParams,
  ringmodulator?: RingmodulatorParams,
  stereo?: StereoParams,
  tremolo?: TremoloParams,
  vocalcanceler?: VocalCancelerParams,
  wah?: WahParams
};

export { SoundModuleProcessor };

/**
 * This class is superclass that is the top in this library.
 * This class is extended as subclass (`OscillatorModule`, `OneshotModule`, `NoiseModule`, `AudioModule`, `MediaModule`, `StreamModule`, `ProcessorModule`, `MixerModule` ...etc).
 */
export abstract class SoundModule implements Connectable {
  public static readonly NUMBER_OF_INPUTS  = 2;
  public static readonly NUMBER_OF_OUTPUTS = 2;

  protected context: AudioContext;
  protected destination: AudioDestinationNode | MediaStreamAudioDestinationNode;

  protected modules: Connectable[] = [];

  protected mastervolume: GainNode;
  protected processor: AudioWorkletNode;

  protected analyser: Analyser;
  protected recorder: Recorder;

  protected autopanner: Autopanner;
  protected bitcrusher: BitCrusher;
  protected chorus: Chorus;
  protected compressor: Compressor;
  protected delay: Delay;
  protected envelopegenerator: EnvelopeGenerator;
  protected equalizer: Equalizer;
  protected filter: Filter;
  protected flanger: Flanger;
  protected fuzz: Fuzz;
  protected listener: Listener;
  protected noisegate: NoiseGate;
  protected noisesuppressor: NoiseSuppressor;
  protected overdrive: OverDrive;
  protected panner: Panner;
  protected phaser: Phaser;
  protected pitchshifter: PitchShifter;
  protected preamp: Preamp;
  protected reverb: Reverb;
  protected ringmodulator: Ringmodulator;
  protected stereo: Stereo;
  protected tremolo: Tremolo;
  protected vocalcanceler: VocalCanceler;
  protected wah: Wah;

  protected runningAnalyser = false;
  protected mixed = false;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    this.context = context;

    this.destination = context.destination;

    this.mastervolume = context.createGain();
    this.processor    = new AudioWorkletNode(context, SoundModuleProcessor.name);

    this.analyser          = new Analyser(context);
    this.recorder          = new Recorder(context);
    this.autopanner        = new Autopanner(context);
    this.bitcrusher        = new BitCrusher(context);
    this.chorus            = new Chorus(context);
    this.compressor        = new Compressor(context);
    this.delay             = new Delay(context);
    this.envelopegenerator = new EnvelopeGenerator(context);
    this.equalizer         = new Equalizer(context);
    this.filter            = new Filter(context);
    this.flanger           = new Flanger(context);
    this.fuzz              = new Fuzz(context);
    this.listener          = new Listener(context);
    this.noisegate         = new NoiseGate(context);
    this.noisesuppressor   = new NoiseSuppressor(context);
    this.overdrive         = new OverDrive(context);
    this.panner            = new Panner(context);
    this.phaser            = new Phaser(context);
    this.pitchshifter      = new PitchShifter(context);
    this.preamp            = new Preamp(context);
    this.reverb            = new Reverb(context);
    this.ringmodulator     = new Ringmodulator(context);
    this.stereo            = new Stereo(context);
    this.tremolo           = new Tremolo(context);
    this.vocalcanceler     = new VocalCanceler(context);
    this.wah               = new Wah(context);

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
      this.pitchshifter,
      this.tremolo,
      this.ringmodulator,
      this.phaser,
      this.flanger,
      this.chorus,
      this.delay,
      this.reverb,
      this.panner,
      this.autopanner
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

    this.mastervolume.connect(this.destination);

    // for analyser
    this.mastervolume.connect(this.analyser.INPUT);

    // for recorder
    this.mastervolume.connect(this.recorder.INPUT);
    this.recorder.OUTPUT.connect(this.destination);
  }

  /**
   * This method disconnects instance of `AudioWorkletNode` as sound source.
   */
  public disconnect(): void {
    this.processor.disconnect(0);
  }

  /**
   * This method switches destination over to `AudioDestinationNode`.
   * @return {SoundModule} Return value is for method chain.
   */
  public audioDestination() {
    this.destination = this.context.destination;

    // Type inference every subclass
    return this;
  }

  /**
   * This method switches destination over to `MediaStreamAudioDestinationNode`.
   * @return {SoundModule} Return value is for method chain.
   */
  public streamDestination() {
    this.destination = this.context.createMediaStreamDestination();

    // Type inference every subclass
    return this;
  }

  /**
   * This method installs customized effector.
   * @param {Effector} effector This argument is subclass that extends `Effector` class.
   * @return {Effector} Return value is instance of customized effector (that extends `Effector` class).
   */
  public install<ExtendedEffector extends Effector>(effector: new (context: AudioContext) => ExtendedEffector): ExtendedEffector {
    const extendedEffector = new effector(this.context);

    this.modules.push(extendedEffector);

    return extendedEffector;
  }

  /**
   * This method starts effectors.
   * @param {number} startTime This argument is used for scheduling parameter.
   * @return {SoundModule} Return value is for method chain.
   */
  public on(startTime?: number): SoundModule {
    const s = startTime ?? this.context.currentTime;

    this.autopanner.start(s);
    this.bitcrusher.start(s);
    this.chorus.start(s);
    this.filter.start(s);
    this.flanger.start(s);
    this.fuzz.start(s);
    this.overdrive.start(s);
    this.phaser.start(s);
    this.ringmodulator.start(s);
    this.tremolo.start(s);
    this.wah.start(s);

    return this;
  }

  /**
   * This method stops effectors.
   * @param {number} stopTime This argument is used for scheduling parameter.
   * @return {SoundModule} Return value is for method chain.
   */
  public off(stopTime?: number): SoundModule {
    const s = stopTime ?? this.context.currentTime;

    this.autopanner.stop(s);
    this.bitcrusher.stop(s);
    this.chorus.stop(s);
    this.filter.stop(s);
    this.flanger.stop(s);
    this.fuzz.stop(s);
    this.overdrive.stop(s);
    this.phaser.stop(s);
    this.ringmodulator.stop(s);
    this.tremolo.stop(s);
    this.wah.stop(s);

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
  public abstract get INPUT(): GainNode | AudioWorkletNode | null;

  /**
   * Connector for output.
   */
  public abstract get OUTPUT(): GainNode;

  /**
   * This method re-initials modules.
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  protected init(context: AudioContext): void {
    this.mastervolume.disconnect(0);
    this.processor.disconnect(0);
    this.analyser.INPUT.disconnect(0);
    this.recorder.INPUT.disconnect(0);

    for (const module of this.modules) {
      if (module.INPUT) {
        module.INPUT.disconnect(0);
      }

      if (module.OUTPUT) {
        module.OUTPUT.disconnect(0);
      }
    }

    this.modules.length = 0;

    this.analyser          = new Analyser(context);
    this.recorder          = new Recorder(context);
    this.autopanner        = new Autopanner(context);
    this.bitcrusher        = new BitCrusher(context);
    this.chorus            = new Chorus(context);
    this.compressor        = new Compressor(context);
    this.delay             = new Delay(context);
    this.envelopegenerator = new EnvelopeGenerator(context);
    this.equalizer         = new Equalizer(context);
    this.filter            = new Filter(context);
    this.flanger           = new Flanger(context);
    this.fuzz              = new Fuzz(context);
    this.listener          = new Listener(context);
    this.noisegate         = new NoiseGate(context);
    this.noisesuppressor   = new NoiseSuppressor(context);
    this.overdrive         = new OverDrive(context);
    this.panner            = new Panner(context);
    this.phaser            = new Phaser(context);
    this.pitchshifter      = new PitchShifter(context);
    this.preamp            = new Preamp(context);
    this.reverb            = new Reverb(context);
    this.ringmodulator     = new Ringmodulator(context);
    this.stereo            = new Stereo(context);
    this.tremolo           = new Tremolo(context);
    this.vocalcanceler     = new VocalCanceler(context);
    this.wah               = new Wah(context);

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
      this.pitchshifter,
      this.tremolo,
      this.ringmodulator,
      this.phaser,
      this.flanger,
      this.chorus,
      this.delay,
      this.reverb,
      this.panner,
      this.autopanner
    ];
  }
}
