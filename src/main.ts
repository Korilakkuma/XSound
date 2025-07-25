'use strict';

import type { SoundModule, SoundModuleParams, Module, ModuleName } from './SoundModule';
import type { OscillatorModuleParams, Glide, GlideParams, GlideType, Oscillator, OscillatorParams, OscillatorCustomType } from './OscillatorModule';
import type { OneshotModuleParams, OneshotSetting, OneshotSettings, OneshotErrorText } from './OneshotModule';
import type { NoiseModuleParams, NoiseType } from './NoiseModule';
import type { AudioModuleParams, AudioBufferSprite } from './AudioModule';
import type { MediaModuleParams } from './MediaModule';
import type { StreamModuleParams, MediaStreamTrackAudioSourceNode } from './StreamModule';
import type { Part, Sequence, MMLSyntaxError, Tree, TokenType, TokenMap, Token, MMLScheduleWorkerMessageEventType, MMLScheduleWorkerMessageEventData } from './MML';
import type {
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
  SpectrumScale,
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
  Spectrogram,
  SpectrogramParams
} from './SoundModule/Analyser';
import type { RecorderParams, RecordType, QuantizationBit, WaveExportType, Frame, Channel, RecorderProcessorMessageEventData } from './SoundModule/Recorder';
import type { AutopannerParams } from './SoundModule/Effectors/Autopanner';
import type { BitCrusherParams } from './SoundModule/Effectors/BitCrusher';
import type { ChorusParams } from './SoundModule/Effectors/Chorus';
import type { CompressorParams } from './SoundModule/Effectors/Compressor';
import type { DelayParams } from './SoundModule/Effectors/Delay';
import type { EnvelopeGenerator, EnvelopeGeneratorParams } from './SoundModule/Effectors/EnvelopeGenerator';
import type { EqualizerParams } from './SoundModule/Effectors/Equalizer';
import type { FilterParams } from './SoundModule/Effectors/Filter';
import type { FlangerParams } from './SoundModule/Effectors/Flanger';
import type { FuzzParams } from './SoundModule/Effectors/Fuzz';
import type { ListenerParams } from './SoundModule/Effectors/Listener';
import type { NoiseGateParams } from './SoundModule/Effectors/NoiseGate';
import type { NoiseSuppressorParams } from './SoundModule/Effectors/NoiseSuppressor';
import type { OverDriveParams } from './SoundModule/Effectors/OverDrive';
import type { PannerParams, Position3D } from './SoundModule/Effectors/Panner';
import type { PhaserParams, PhaserNumberOfStages } from './SoundModule/Effectors/Phaser';
import type { PitchShifterParams } from './SoundModule/Effectors/PitchShifter';
import type { PreampParams, PreampType, PreampCurve } from './SoundModule/Effectors/Preamp';
import type {
  Marshall,
  MarshallParams,
  PreEqualizerParams as MarshallPreEqualizerParams,
  PostEqualizerParams as MarshallPostEqualizerParams
} from './SoundModule/Effectors/Preamps/Marshall';
import type {
  MesaBoogie,
  MesaBoogieParams,
  PreEqualizerParams as MesaBoogiePreEqualizerParams,
  PostEqualizerParams as MesaBoogiePostEqualizerParams
} from './SoundModule/Effectors/Preamps/MesaBoogie';
import type {
  Fender,
  FenderParams,
  PreEqualizerParams as FenderPreEqualizerParams,
  PostFilterParams as FenderPostFilterParams,
  SpeakerInches as FenderSpeakerInches
} from './SoundModule/Effectors/Preamps/Fender';
import type { CabinetParams } from './SoundModule/Effectors/Preamps/Cabinet';
import type { ReverbParams, ReverbErrorText } from './SoundModule/Effectors/Reverb';
import type { RingmodulatorParams } from './SoundModule/Effectors/Ringmodulator';
import type { StereoParams } from './SoundModule/Effectors/Stereo';
import type { TremoloParams } from './SoundModule/Effectors/Tremolo';
import type { VocalCancelerParams, VocalCancelerAlgorithm } from './SoundModule/Effectors/VocalCanceler';
import type { WahParams } from './SoundModule/Effectors/Wah';
import type { PitchChar, ConvertedTime, FileEvent, FileReaderType, FileReaderErrorText } from './XSound';
import type { FrozenArray, Inputs, Outputs, Parameters } from './worklet';

import './types';
import { SoundModuleProcessor } from './SoundModule';
import { OscillatorModule, OscillatorModuleProcessor } from './OscillatorModule';
import { OneshotModule, OneshotModuleProcessor } from './OneshotModule';
import { NoiseModule, NoiseModuleProcessor } from './NoiseModule';
import { AudioModule, AudioModuleProcessor } from './AudioModule';
import { MediaModule, MediaModuleProcessor } from './MediaModule';
import { StreamModule, StreamModuleProcessor } from './StreamModule';
import { ProcessorModule } from './ProcessorModule';
import { MixerModule, MixerModuleProcessor } from './MixerModule';
import { MIDI } from './MIDI';
import { MML } from './MML';
import { Analyser } from './SoundModule/Analyser';
import { Recorder, RecorderProcessor } from './SoundModule/Recorder';
import { Effector } from './SoundModule/Effectors/Effector';
import { Autopanner } from './SoundModule/Effectors/Autopanner';
import { BitCrusher } from './SoundModule/Effectors/BitCrusher';
import { Chorus } from './SoundModule/Effectors/Chorus';
import { Compressor } from './SoundModule/Effectors/Compressor';
import { Delay } from './SoundModule/Effectors/Delay';
import { Equalizer } from './SoundModule/Effectors/Equalizer';
import { Filter } from './SoundModule/Effectors/Filter';
import { Flanger } from './SoundModule/Effectors/Flanger';
import { Fuzz } from './SoundModule/Effectors/Fuzz';
import { Listener } from './SoundModule/Effectors/Listener';
import { NoiseGate } from './SoundModule/Effectors/NoiseGate';
import { NoiseSuppressor } from './SoundModule/Effectors/NoiseSuppressor';
import { OverDrive } from './SoundModule/Effectors/OverDrive';
import { Panner } from './SoundModule/Effectors/Panner';
import { Phaser } from './SoundModule/Effectors/Phaser';
import { PitchShifter } from './SoundModule/Effectors/PitchShifter';
import { Preamp } from './SoundModule/Effectors/Preamp';
import { Reverb } from './SoundModule/Effectors/Reverb';
import { Ringmodulator } from './SoundModule/Effectors/Ringmodulator';
import { Stereo } from './SoundModule/Effectors/Stereo';
import { Tremolo } from './SoundModule/Effectors/Tremolo';
import { VocalCanceler } from './SoundModule/Effectors/VocalCanceler';
import { Wah } from './SoundModule/Effectors/Wah';
import { NoiseGateProcessor } from './SoundModule/Effectors/AudioWorkletProcessors/NoiseGateProcessor';
import { NoiseSuppressorProcessor } from './SoundModule/Effectors/AudioWorkletProcessors/NoiseSuppressorProcessor';
import { PitchShifterProcessor } from './SoundModule/Effectors/AudioWorkletProcessors/PitchShifterProcessor';
import { VocalCancelerProcessor } from './SoundModule/Effectors/AudioWorkletProcessors/VocalCancelerProcessor';
import {
  EQUAL_TEMPERAMENT,
  FREQUENCY_RATIO,
  MIN_A,
  QUARTER_NOTE,
  HALF_UP,
  HALF_DOWN,
  DOT,
  isPitchChar,
  computeIndex,
  computeFrequency,
  computeHz,
  computePlaybackRate,
  fft,
  ifft,
  ajax,
  convertTime,
  decode,
  permission,
  requestFullscreen,
  exitFullscreen,
  read,
  drop,
  file,
  toFrequencies,
  toTextFile
} from './XSound';
import { addAudioWorklet } from './worklet';

export type Source     = OscillatorModule | OneshotModule | NoiseModule | AudioModule | MediaModule | StreamModule | ProcessorModule | MixerModule | MIDI | MML;
export type SourceName = 'oscillator' | 'oneshot' | 'noise' | 'audio' | 'media' | 'stream' | 'processor' | 'mixer' | 'midi' | 'mml';

// for legacy browsers
window.AudioContext = window.AudioContext || window.webkitAudioContext;
window.URL          = window.URL          || window.webkitURL;

const audiocontext = new AudioContext();

// Memoize instance
const sources: { [sourceName: string]: Source | null } = {
  oscillator: null,
  oneshot   : null,
  noise     : null,
  audio     : null,
  media     : null,
  stream    : null,
  processor : null,
  mixer     : null,
  midi      : null,
  mml       : null
};

const promise = Promise
  .all([
    addAudioWorklet(audiocontext, SoundModuleProcessor),
    addAudioWorklet(audiocontext, RecorderProcessor),
    addAudioWorklet(audiocontext, OscillatorModuleProcessor),
    addAudioWorklet(audiocontext, OneshotModuleProcessor),
    addAudioWorklet(audiocontext, NoiseModuleProcessor),
    addAudioWorklet(audiocontext, AudioModuleProcessor),
    addAudioWorklet(audiocontext, MediaModuleProcessor),
    addAudioWorklet(audiocontext, StreamModuleProcessor),
    addAudioWorklet(audiocontext, MixerModuleProcessor),
    addAudioWorklet(audiocontext, NoiseGateProcessor),
    addAudioWorklet(audiocontext, NoiseSuppressorProcessor),
    addAudioWorklet(audiocontext, PitchShifterProcessor),
    addAudioWorklet(audiocontext, VocalCancelerProcessor)
  ])
  .then(() => {
    sources.oscillator = new OscillatorModule(audiocontext);
    sources.oneshot    = new OneshotModule(audiocontext);
    sources.noise      = new NoiseModule(audiocontext);
    sources.audio      = new AudioModule(audiocontext);
    sources.media      = new MediaModule(audiocontext);
    sources.stream     = new StreamModule(audiocontext);
    sources.processor  = new ProcessorModule(audiocontext);
    sources.mixer      = new MixerModule(audiocontext);
    sources.midi       = new MIDI();
    sources.mml        = new MML();

    return sources;
  })
  .catch((error: Error) => {
    return error;
  });

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
    case 'oscillator': {
      return sources.oscillator;
    }

    case 'oneshot': {
      return sources.oneshot;
    }

    case 'noise': {
      return sources.noise;
    }

    case 'audio': {
      return sources.audio;
    }

    case 'media': {
      return sources.media;
    }

    case 'stream': {
      return sources.stream;
    }

    case 'processor': {
      return sources.processor;
    }

    case 'mixer': {
      return sources.mixer;
    }

    case 'midi': {
      return sources.midi;
    }

    case 'mml': {
      return sources.mml;
    }

    default: {
      return null;
    }
  }
}

/**
 * Class (Static) properties
 */
XSound.SAMPLE_RATE         = audiocontext.sampleRate;
XSound.EQUAL_TEMPERAMENT   = EQUAL_TEMPERAMENT;
XSound.FREQUENCY_RATIO     = FREQUENCY_RATIO;
XSound.MIN_A               = MIN_A;
XSound.QUARTER_NOT         = QUARTER_NOTE;
XSound.HALF_UP             = HALF_UP;
XSound.HALF_DOWN           = HALF_DOWN;
XSound.DOT                 = DOT;
XSound.isPitchChar         = isPitchChar;
XSound.computeIndex        = computeIndex;
XSound.computeHz           = computeHz;
XSound.computeFrequency    = computeFrequency;
XSound.computePlaybackRate = computePlaybackRate;
XSound.fft                 = fft;
XSound.ifft                = ifft;
XSound.ajax                = ajax;
XSound.convertTime         = convertTime;
XSound.decode              = decode;
XSound.permission          = permission;
XSound.requestFullscreen   = requestFullscreen;
XSound.exitFullscreen      = exitFullscreen;
XSound.read                = read;
XSound.drop                = drop;
XSound.file                = file;
XSound.toFrequencies       = toFrequencies;
XSound.toTextFile          = toTextFile;

// Export classes
XSound.Analyser = Analyser;
XSound.Recorder = Recorder;

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

  return Promise.resolve();
};

/**
 * This class (static) method returns `Promise` that waits instantiating `AudioWorkletProcessor`s.
 * @return {Promise<Source|null|Error>} Return value is `Promise`.
 */
XSound.promise = (): Promise<typeof sources | Error> => {
  return promise;
};

/**
 * This class (static) method returns closure that gets cloned instance of `Source`.
 * @return {function}
 */
XSound.clone = (): typeof ClonedXSound => {
  const clonedSources: { [sourceName: string]: Source | null } = {
    oscillator: null,
    oneshot   : null,
    noise     : null,
    audio     : null,
    media     : null,
    stream    : null,
    processor : null,
    mixer     : null,
    midi      : null,
    mml       : null
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
      case 'oscillator': {
        return clonedSources.oscillator;
      }

      case 'oneshot': {
        return clonedSources.oneshot;
      }

      case 'noise': {
        return clonedSources.noise;
      }

      case 'audio': {
        return clonedSources.audio;
      }

      case 'media': {
        return clonedSources.media;
      }

      case 'stream': {
        return clonedSources.stream;
      }

      case 'processor': {
        return clonedSources.processor;
      }

      case 'mixer': {
        return clonedSources.mixer;
      }

      case 'midi': {
        return clonedSources.midi;
      }

      case 'mml': {
        return clonedSources.mml;
      }

      default: {
        return null;
      }
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

  clonedSources.oscillator = new OscillatorModule(audiocontext);
  clonedSources.oneshot    = new OneshotModule(audiocontext);
  clonedSources.noise      = new NoiseModule(audiocontext);
  clonedSources.audio      = new AudioModule(audiocontext);
  clonedSources.media      = new MediaModule(audiocontext);
  clonedSources.stream     = new StreamModule(audiocontext);
  clonedSources.processor  = new ProcessorModule(audiocontext);
  clonedSources.mixer      = new MixerModule(audiocontext);
  clonedSources.midi       = new MIDI();
  clonedSources.mml        = new MML();

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

const setup = (event: MouseEvent | TouchEvent): void => {
  event.stopImmediatePropagation();

  XSound
    .setup()
    .finally(() => {
      document.removeEventListener('mousedown',  setup, false);
      document.removeEventListener('touchstart', setup, false);
    });
};

document.addEventListener('mousedown',  setup, false);
document.addEventListener('touchstart', setup, false);

export type {
  SoundModule,
  SoundModuleParams,
  SoundModuleProcessor,
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
  OscillatorModuleProcessor,
  OneshotModule,
  OneshotModuleParams,
  OneshotSetting,
  OneshotSettings,
  OneshotErrorText,
  OneshotModuleProcessor,
  NoiseModule,
  NoiseModuleParams,
  NoiseType,
  NoiseModuleProcessor,
  AudioModule,
  AudioModuleParams,
  AudioBufferSprite,
  AudioModuleProcessor,
  MediaModule,
  MediaModuleParams,
  MediaModuleProcessor,
  StreamModule,
  StreamModuleParams,
  StreamModuleProcessor,
  MediaStreamTrackAudioSourceNode,
  ProcessorModule,
  MixerModule,
  MixerModuleProcessor,
  MIDI,
  MML,
  Part,
  Sequence,
  MMLSyntaxError,
  Tree,
  TokenType,
  TokenMap,
  Token,
  MMLScheduleWorkerMessageEventType,
  MMLScheduleWorkerMessageEventData,
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
  SpectrumScale,
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
  Spectrogram,
  SpectrogramParams,
  Recorder,
  RecorderParams,
  RecordType,
  QuantizationBit,
  WaveExportType,
  Frame,
  Channel,
  RecorderProcessor,
  RecorderProcessorMessageEventData,
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
  NoiseGateProcessor,
  NoiseSuppressor,
  NoiseSuppressorParams,
  NoiseSuppressorProcessor,
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
  PitchShifterProcessor,
  Preamp,
  PreampParams,
  PreampType,
  PreampCurve,
  Marshall,
  MarshallParams,
  MarshallPreEqualizerParams,
  MarshallPostEqualizerParams,
  MesaBoogie,
  MesaBoogieParams,
  MesaBoogiePreEqualizerParams,
  MesaBoogiePostEqualizerParams,
  Fender,
  FenderParams,
  FenderPreEqualizerParams,
  FenderPostFilterParams,
  FenderSpeakerInches,
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
  VocalCancelerAlgorithm,
  VocalCancelerProcessor,
  Wah,
  WahParams,
  PitchChar,
  ConvertedTime,
  FileEvent,
  FileReaderType,
  FileReaderErrorText,
  FrozenArray,
  Inputs,
  Outputs,
  Parameters
};

export { XSound, XSound as X };
