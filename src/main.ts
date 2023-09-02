'use strict';

import '/src/types';
import { SoundModule, SoundModuleParams, SoundModuleProcessor, Module, ModuleName } from '/src/SoundModule';
import {
  OscillatorModule,
  OscillatorModuleParams,
  OscillatorModuleProcessor,
  Glide,
  GlideParams,
  GlideType,
  Oscillator,
  OscillatorParams,
  OscillatorCustomType
} from '/src/OscillatorModule';
import {
  OneshotModule,
  OneshotModuleParams,
  OneshotSetting,
  OneshotSettings,
  OneshotErrorText,
  OneshotModuleProcessor
} from '/src/OneshotModule';
import { NoiseModule, NoiseModuleParams, NoiseType, NoiseModuleProcessor } from '/src/NoiseModule';
import { AudioModule, AudioModuleParams, AudioBufferSprite, AudioModuleProcessor } from '/src/AudioModule';
import { MediaModule, MediaModuleParams, MediaModuleProcessor } from '/src/MediaModule';
import { StreamModule, StreamModuleParams, StreamModuleProcessor, MediaStreamTrackAudioSourceNode } from '/src/StreamModule';
import { ProcessorModule } from '/src/ProcessorModule';
import { MixerModule, MixerModuleProcessor } from '/src/MixerModule';
import { MIDI } from '/src/MIDI';
import {
  MML,
  Part,
  Sequence,
  MMLSyntaxError,
  Tree,
  TokenType,
  TokenMap,
  Token,
  MMLScheduleWorkerMessageEventType,
  MMLScheduleWorkerMessageEventData
} from '/src/MML';
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
} from '/src/SoundModule/Analyser';
import {
  Recorder,
  RecorderParams,
  RecordType,
  QuantizationBit,
  WaveExportType,
  Track,
  Channel,
  RecorderProcessor,
  RecorderProcessorMessageEventData
} from '/src/SoundModule/Recorder';
import { Effector } from '/src/SoundModule/Effectors/Effector';
import { Autopanner, AutopannerParams } from '/src/SoundModule/Effectors/Autopanner';
import { BitCrusher, BitCrusherParams } from '/src/SoundModule/Effectors/BitCrusher';
import { Chorus, ChorusParams } from '/src/SoundModule/Effectors/Chorus';
import { Compressor, CompressorParams } from '/src/SoundModule/Effectors/Compressor';
import { Delay, DelayParams } from '/src/SoundModule/Effectors/Delay';
import { EnvelopeGenerator, EnvelopeGeneratorParams } from '/src/SoundModule/Effectors/EnvelopeGenerator';
import { Equalizer, EqualizerParams } from '/src/SoundModule/Effectors/Equalizer';
import { Filter, FilterParams } from '/src/SoundModule/Effectors/Filter';
import { Flanger, FlangerParams } from '/src/SoundModule/Effectors/Flanger';
import { Fuzz, FuzzParams } from '/src/SoundModule/Effectors/Fuzz';
import { Listener, ListenerParams } from '/src/SoundModule/Effectors/Listener';
import { NoiseGate, NoiseGateParams } from '/src/SoundModule/Effectors/NoiseGate';
import { NoiseSuppressor, NoiseSuppressorParams } from '/src/SoundModule/Effectors/NoiseSuppressor';
import { OverDrive, OverDriveParams } from '/src/SoundModule/Effectors/OverDrive';
import { Panner, PannerParams, Position3D } from '/src/SoundModule/Effectors/Panner';
import { Phaser, PhaserParams, PhaserNumberOfStages } from '/src/SoundModule/Effectors/Phaser';
import { PitchShifter, PitchShifterParams } from '/src/SoundModule/Effectors/PitchShifter';
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
} from '/src/SoundModule/Effectors/Preamp';
import { Reverb, ReverbParams, ReverbErrorText } from '/src/SoundModule/Effectors/Reverb';
import { Ringmodulator, RingmodulatorParams } from '/src/SoundModule/Effectors/Ringmodulator';
import { Stereo, StereoParams } from '/src/SoundModule/Effectors/Stereo';
import { Tremolo, TremoloParams } from '/src/SoundModule/Effectors/Tremolo';
import { VocalCanceler, VocalCancelerParams } from '/src/SoundModule/Effectors/VocalCanceler';
import { Wah, WahParams } from '/src/SoundModule/Effectors/Wah';
import { NoiseGateProcessor } from '/src/SoundModule/Effectors/AudioWorkletProcessors/NoiseGateProcessor';
import { NoiseSuppressorProcessor } from '/src/SoundModule/Effectors/AudioWorkletProcessors/NoiseSuppressorProcessor';
import { PitchShifterProcessor } from '/src/SoundModule/Effectors/AudioWorkletProcessors/PitchShifterProcessor';
import { StereoProcessor } from '/src/SoundModule/Effectors/AudioWorkletProcessors/StereoProcessor';
import { VocalCancelerProcessor } from '/src/SoundModule/Effectors/AudioWorkletProcessors/VocalCancelerProcessor';
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
} from '/src/XSound';
import {
  addAudioWorklet,
  FrozenArray,
  Inputs,
  Outputs,
  Parameters
} from '/src/worklet';

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

Promise
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
    addAudioWorklet(audiocontext, StereoProcessor),
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
  })
  .catch((error: Error) => {
    throw error;
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
  StereoProcessor,
  Tremolo,
  TremoloParams,
  VocalCanceler,
  VocalCancelerParams,
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
