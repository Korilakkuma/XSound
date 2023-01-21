'use strict';

import './types';
import { SoundModule, SoundModuleParams, Module, ModuleName } from './SoundModule';
import {
  OscillatorModule,
  OscillatorModuleParams,
  Glide,
  GlideParams,
  GlideType,
  Oscillator,
  OscillatorParams,
  OscillatorCustomType
} from './OscillatorModule';
import { OneshotModule, OneshotModuleParams, OneshotSetting, OneshotSettings, OneshotErrorText } from './OneshotModule';
import { NoiseModule, NoiseModuleParams, NoiseType } from './NoiseModule';
import { AudioModule, AudioModuleParams, AudioBufferSprite } from './AudioModule';
import { MediaModule, MediaModuleParams } from './MediaModule';
import { StreamModule, StreamModuleParams, MediaStreamTrackAudioSourceNode } from './StreamModule';
import { ProcessorModule } from './ProcessorModule';
import { MixerModule } from './MixerModule';
import { MIDI } from './MIDI';
import { MML, Part, Sequence, MMLSyntaxError, Tree, TokenType, TokenMap, Token } from './MML';
import {
  Analyser,
  AnalyserParams,
  Domain,
  DataType,
  FFTSize,
  Visualizer,
  VisualizerParams,
  Color,
  GraphicsApi,
  Gradient,
  Gradients,
  Shape,
  Font,
  GraphicsStyles,
  TimeOverview,
  TimeOverviewParams,
  MouseEventTypes,
  DragMode,
  DragCallbackFunction,
  CurrentTimeStyles,
  Time,
  TimeParams,
  FFT,
  FFTParams,
  SpectrumScale
} from './SoundModule/Analyser';
import { Recorder, RecorderParams, RecordType, QuantizationBit, WaveExportType, Track, Channel } from './SoundModule/Recorder';
import { Session, SessionSetupParams, SessionConnectionParams, NumberOfSessionChannels, Room, RoomMap } from './SoundModule/Session';
import { Effector } from './SoundModule/Effectors/Effector';
import { Autopanner, AutopannerParams } from './SoundModule/Effectors/Autopanner';
import { BitCrusher, BitCrusherParams } from './SoundModule/Effectors/BitCrusher';
import { Chorus, ChorusParams } from './SoundModule/Effectors/Chorus';
import { Compressor, CompressorParams } from './SoundModule/Effectors/Compressor';
import { Delay, DelayParams } from './SoundModule/Effectors/Delay';
import { EnvelopeGenerator, EnvelopeGeneratorParams } from './SoundModule/Effectors/EnvelopeGenerator';
import { Equalizer, EqualizerParams } from './SoundModule/Effectors/Equalizer';
import { Filter, FilterParams } from './SoundModule/Effectors/Filter';
import { Flanger, FlangerParams } from './SoundModule/Effectors/Flanger';
import { Fuzz, FuzzParams } from './SoundModule/Effectors/Fuzz';
import { Listener, ListenerParams } from './SoundModule/Effectors/Listener';
import { NoiseGate, NoiseGateParams } from './SoundModule/Effectors/NoiseGate';
import { NoiseSuppressor, NoiseSuppressorParams } from './SoundModule/Effectors/NoiseSuppressor';
import { OverDrive, OverDriveParams } from './SoundModule/Effectors/OverDrive';
import { Panner, PannerParams, Position3D } from './SoundModule/Effectors/Panner';
import { Phaser, PhaserParams, PhaserNumberOfStages } from './SoundModule/Effectors/Phaser';
import { PitchShifter, PitchShifterParams } from './SoundModule/Effectors/PitchShifter';
import {
  Preamp,
  PreampParams,
  PreampCurve,
  PreEqualizer,
  PreEqualizerParams,
  PostEqualizer,
  PostEqualizerParams,
  Cabinet,
  CabinetParams
} from './SoundModule/Effectors/Preamp';
import { Reverb, ReverbParams, ReverbErrorText } from './SoundModule/Effectors/Reverb';
import { Ringmodulator, RingmodulatorParams } from './SoundModule/Effectors/Ringmodulator';
import { Stereo, StereoParams } from './SoundModule/Effectors/Stereo';
import { Tremolo, TremoloParams } from './SoundModule/Effectors/Tremolo';
import { VocalCanceler, VocalCancelerParams } from './SoundModule/Effectors/VocalCanceler';
import { Wah, WahParams } from './SoundModule/Effectors/Wah';
import {
  EQUAL_TEMPERAMENT,
  FREQUENCY_RATIO,
  MIN_A,
  QUARTER_NOTE,
  HALF_UP,
  HALF_DOWN,
  DOT,
  PitchChar,
  ConvertedTime,
  isPitchChar,
  computeIndex,
  computeFrequency,
  fft,
  ifft,
  ajax,
  convertTime,
  decode,
  requestFullscreen,
  exitFullscreen,
  read,
  drop,
  file,
  toFrequencies,
  toTextFile,
  FileEvent,
  FileReaderType,
  FileReaderErrorText
} from './XSound';

export type Source     = OscillatorModule | OneshotModule | NoiseModule | AudioModule | MediaModule | StreamModule | ProcessorModule | MixerModule | MIDI | MML;
export type SourceName = 'oscillator' | 'oneshot' | 'noise' | 'audio' | 'media' | 'stream' | 'processor' | 'mixer' | 'midi' | 'mml';

// for legacy browsers
window.AudioContext = window.AudioContext || window.webkitAudioContext;
window.URL          = window.URL          || window.webkitURL;

const audiocontext = new AudioContext();

// Memoize instance
const sources: { [sourceName: string]: Source | null } = {
  oscillator: new OscillatorModule(audiocontext, 0),
  oneshot   : new OneshotModule(audiocontext, 0),
  noise     : new NoiseModule(audiocontext, 0),
  audio     : new AudioModule(audiocontext, 0),
  media     : new MediaModule(audiocontext, 0),
  stream    : new StreamModule(audiocontext, 0),
  processor : new ProcessorModule(audiocontext, 0),
  mixer     : new MixerModule(audiocontext, 0),
  midi      : new MIDI(),
  mml       : new MML()
};

/**
 * This function gets instance of `Source`.
 * This functions is overloaded for type interface and type check.
 * @param {SourceName|string} sourceName This argument selects instance for sound source.
 * @return {Source|null}
 */
function XSound(sourceName: 'oscillator'): OscillatorModule;
function XSound(sourceName: 'oneshot'): OneshotModule;
function XSound(sourceName: 'noise'): NoiseModule;
function XSound(sourceName: 'audio'): AudioModule;
function XSound(sourceName: 'media'): MediaModule;
function XSound(sourceName: 'stream'): StreamModule;
function XSound(sourceName: 'processor'): ProcessorModule;
function XSound(sourceName: 'mixer'): MixerModule;
function XSound(sourceName: 'midi'): MIDI;
function XSound(sourceName: 'mml'): MML;
function XSound(sourecName: string): Source | null {
  switch (sourecName) {
    case 'oscillator':
      return sources.oscillator;
    case 'oneshot':
      return sources.oneshot;
    case 'noise':
      return sources.noise;
    case 'audio':
      return sources.audio;
    case 'media':
      return sources.media;
    case 'stream':
      return sources.stream;
    case 'processor':
      return sources.processor;
    case 'mixer':
      return sources.mixer;
    case 'midi':
      return sources.midi;
    case 'mml':
      return sources.mml;
    default:
      return null;
  }
}

/**
 * Class (Static) properties
 */
XSound.SAMPLE_RATE       = audiocontext.sampleRate;
XSound.EQUAL_TEMPERAMENT = EQUAL_TEMPERAMENT;
XSound.FREQUENCY_RATIO   = FREQUENCY_RATIO;
XSound.MIN_A             = MIN_A;
XSound.QUARTER_NOT       = QUARTER_NOTE;
XSound.HALF_UP           = HALF_UP;
XSound.HALF_DOWN         = HALF_DOWN;
XSound.DOT               = DOT;
XSound.isPitchChar       = isPitchChar;
XSound.computeIndex      = computeIndex;
XSound.computeFrequency  = computeFrequency;
XSound.fft               = fft;
XSound.ifft              = ifft;
XSound.ajax              = ajax;
XSound.convertTime       = convertTime;
XSound.decode            = decode;
XSound.requestFullscreen = requestFullscreen;
XSound.exitFullscreen    = exitFullscreen;
XSound.read              = read;
XSound.drop              = drop;
XSound.file              = file;
XSound.toFrequencies     = toFrequencies;
XSound.toTextFile        = toTextFile;

// Export classes
XSound.Analyser = Analyser;
XSound.Recorder = Recorder;
XSound.Session  = Session;

XSound.Effector        = Effector;
XSound.Autopanner      = Autopanner;
XSound.BitCrusher      = BitCrusher;
XSound.Chorus          = Chorus;
XSound.Compressor      = Compressor;
XSound.Delay           = Delay;
XSound.Equalizer       = Equalizer;
XSound.Filter          = Filter;
XSound.Flanger         = Flanger;
XSound.Fuzz            = Fuzz;
XSound.Listener        = Listener;
XSound.NoiseGate       = NoiseGate;
XSound.NoiseSuppressor = NoiseSuppressor;
XSound.OverDrive       = OverDrive;
XSound.Panner          = Panner;
XSound.Phaser          = Phaser;
XSound.PitchShifter    = PitchShifter;
XSound.Preamp          = Preamp;
XSound.Reverb          = Reverb;
XSound.Ringmodulator   = Ringmodulator;
XSound.Stereo          = Stereo;
XSound.Tremolo         = Tremolo;
XSound.VocalCanceler   = VocalCanceler;
XSound.Wah             = Wah;

/**
 * This class (static) method changes `AudioContextState` to 'running'.
 * Initial state is 'suspended' by Autoplay Policy.
 * Therefore, this method must be invoked by user gestures.
 * @return {Promise<void>} Return value is `Promise`.
 */
XSound.setup = (): Promise<void> => {
  if (audiocontext.state !== 'running') {
    return audiocontext.resume();
  }

  return Promise.reject();
};

/**
 * This class (static) method returns closure that gets cloned instance of `Source`.
 * @return {function}
 */
XSound.clone = (): typeof ClonedXSound => {
  const clonedSources: { [sourceName: string]: Source | null } = {
    oscillator: new OscillatorModule(audiocontext, 0),
    oneshot   : new OneshotModule(audiocontext, 0),
    noise     : new NoiseModule(audiocontext, 0),
    audio     : new AudioModule(audiocontext, 0),
    media     : new MediaModule(audiocontext, 0),
    stream    : new StreamModule(audiocontext, 0),
    mixer     : new MixerModule(audiocontext, 0),
    processor : new ProcessorModule(audiocontext, 0),
    midi      : new MIDI(),
    mml       : new MML()
  };

  function ClonedXSound(sourceName: 'oscillator'): OscillatorModule;
  function ClonedXSound(sourceName: 'oneshot'): OneshotModule;
  function ClonedXSound(sourceName: 'noise'): NoiseModule;
  function ClonedXSound(sourceName: 'audio'): AudioModule;
  function ClonedXSound(sourceName: 'media'): MediaModule;
  function ClonedXSound(sourceName: 'stream'): StreamModule;
  function ClonedXSound(sourceName: 'processor'): ProcessorModule;
  function ClonedXSound(sourceName: 'mixer'): MixerModule;
  function ClonedXSound(sourceName: 'midi'): MIDI;
  function ClonedXSound(sourceName: 'mml'): MML;
  function ClonedXSound(sourecName: string): Source | null {
    switch (sourecName) {
      case 'oscillator':
        return clonedSources.oscillator;
      case 'oneshot':
        return clonedSources.oneshot;
      case 'noise':
        return clonedSources.noise;
      case 'audio':
        return clonedSources.audio;
      case 'media':
        return clonedSources.media;
      case 'stream':
        return clonedSources.stream;
      case 'processor':
        return clonedSources.processor;
      case 'mixer':
        return clonedSources.mixer;
      case 'midi':
        return clonedSources.midi;
      case 'mml':
        return clonedSources.mml;
      default:
        return null;
    }
  }

  ClonedXSound.free = (unusedSources: Source[]): void => {
    for (const unusedSource of unusedSources) {
      // Already deleted ?
      if (unusedSource === null) {
        continue;
      }

      Object.entries(clonedSources).forEach(([sourceName, clonedSource]: [string, Source | null]) => {
        if (unusedSource === clonedSource) {
          clonedSources[sourceName] = null;
        }
      });
    }
  };

  // Closure
  return ClonedXSound;
};

/**
 * This class (static) method releases memory of unused instances.
 * @param {Array<Source>} unusedSources This argument is array that contains unused instance of `Source`.
 */
XSound.free = (unusedSources: Source[]): void => {
  for (const unusedSource of unusedSources) {
    // Already deleted ?
    if (unusedSource === null) {
      continue;
    }

    Object.entries(sources).forEach(([sourceName, memoizedSource]: [string, Source | null]) => {
      if (unusedSource === memoizedSource) {
        sources[sourceName] = null;  // Release heap
      }
    });
  }
};

/**
 * This method deletes `XSound` function as global object.
 * @param {boolean} deep This argument selects whether deleting both of global objects.
 *     If this value is `true`, both of global objects are deleted.
 * @return {XSound}
 */
XSound.noConflict = (deep: boolean): typeof XSound => {
  if (window.X === XSound) {
    window.X = undefined;
  }

  // both of global objects are removed ?
  if (deep && (window.XSound === XSound)) {
    window.XSound = undefined;
  }

  return XSound;
};

/**
 * This class (static) method gets instance of `AudioContext`.
 * @return {AudioContext}
 */
XSound.get = (): AudioContext => {
  return audiocontext;
};

/**
 * This class (static) method gets elapsed time from creating instance of `AudioContext`.
 * @return {number}
 */
XSound.getCurrentTime = (): number => {
  return audiocontext.currentTime;
};

// for Autoplay Policy
const setup = (): void => {
  XSound.setup().then(() => {}).catch(() => {});

  document.removeEventListener('click',      setup, false);
  document.removeEventListener('mousedown',  setup, false);
  document.removeEventListener('mouseup',    setup, false);
  document.removeEventListener('touchstart', setup, false);
  document.removeEventListener('touchend',   setup, false);
};

document.addEventListener('click',      setup, false);
document.addEventListener('mousedown',  setup, false);
document.addEventListener('mouseup',    setup, false);
document.addEventListener('touchstart', setup, false);
document.addEventListener('touchend',   setup, false);

export type {
  SoundModule,
  SoundModuleParams,
  Module,
  ModuleName,
  OscillatorModule,
  OscillatorModuleParams,
  Glide,
  GlideParams,
  GlideType,
  Oscillator,
  OscillatorParams,
  OscillatorCustomType,
  OneshotModule,
  OneshotModuleParams,
  OneshotSetting,
  OneshotSettings,
  OneshotErrorText,
  NoiseModule,
  NoiseModuleParams,
  NoiseType,
  AudioModule,
  AudioModuleParams,
  AudioBufferSprite,
  MediaModule,
  MediaModuleParams,
  StreamModule,
  StreamModuleParams,
  MediaStreamTrackAudioSourceNode,
  ProcessorModule,
  MixerModule,
  MIDI,
  MML,
  Part,
  Sequence,
  MMLSyntaxError,
  Tree,
  TokenType,
  TokenMap,
  Token,
  Analyser,
  AnalyserParams,
  Domain,
  DataType,
  FFTSize,
  Color,
  Visualizer,
  VisualizerParams,
  GraphicsApi,
  Gradient,
  Gradients,
  Shape,
  Font,
  GraphicsStyles,
  TimeOverview,
  TimeOverviewParams,
  MouseEventTypes,
  DragMode,
  DragCallbackFunction,
  CurrentTimeStyles,
  Time,
  TimeParams,
  FFT,
  FFTParams,
  SpectrumScale,
  Recorder,
  RecorderParams,
  RecordType,
  QuantizationBit,
  WaveExportType,
  Track,
  Channel,
  Session,
  SessionSetupParams,
  SessionConnectionParams,
  NumberOfSessionChannels,
  Room,
  RoomMap,
  Effector,
  Autopanner,
  AutopannerParams,
  BitCrusher,
  BitCrusherParams,
  Chorus,
  ChorusParams,
  Compressor,
  CompressorParams,
  Delay,
  DelayParams,
  EnvelopeGenerator,
  EnvelopeGeneratorParams,
  Equalizer,
  EqualizerParams,
  Filter,
  FilterParams,
  Flanger,
  FlangerParams,
  Fuzz,
  FuzzParams,
  Listener,
  ListenerParams,
  NoiseGate,
  NoiseGateParams,
  NoiseSuppressor,
  NoiseSuppressorParams,
  OverDrive,
  OverDriveParams,
  Panner,
  PannerParams,
  Position3D,
  Phaser,
  PhaserParams,
  PhaserNumberOfStages,
  PitchShifter,
  PitchShifterParams,
  Preamp,
  PreampParams,
  PreampCurve,
  PreEqualizer,
  PreEqualizerParams,
  PostEqualizer,
  PostEqualizerParams,
  Cabinet,
  CabinetParams,
  Reverb,
  ReverbParams,
  ReverbErrorText,
  Ringmodulator,
  RingmodulatorParams,
  Stereo,
  StereoParams,
  Tremolo,
  TremoloParams,
  VocalCanceler,
  VocalCancelerParams,
  Wah,
  WahParams,
  PitchChar,
  ConvertedTime,
  FileEvent,
  FileReaderType,
  FileReaderErrorText
};

export { XSound, XSound as X };
