'use strict';

import './types';
import { OscillatorModule } from './OscillatorModule';
import { OneshotModule } from './OneshotModule';
import { NoiseModule } from './NoiseModule';
import { AudioModule } from './AudioModule';
import { MediaModule } from './MediaModule';
import { StreamModule } from './StreamModule';
import { ProcessorModule } from './ProcessorModule';
import { MixerModule } from './MixerModule';
import { MIDI } from './MIDI';
import { MML } from './MML';
import { Analyser } from './SoundModule/Analyser';
import { Recorder } from './SoundModule/Recorder';
import { Session } from './SoundModule/Session';
import { Effector } from './SoundModule/Effectors/Effector';
import { Autopanner } from './SoundModule/Effectors/Autopanner';
import { Chorus } from './SoundModule/Effectors/Chorus';
import { Compressor } from './SoundModule/Effectors/Compressor';
import { Delay } from './SoundModule/Effectors/Delay';
import { Distortion } from './SoundModule/Effectors/Distortion';
import { Equalizer } from './SoundModule/Effectors/Equalizer';
import { Filter } from './SoundModule/Effectors/Filter';
import { Flanger } from './SoundModule/Effectors/Flanger';
import { Listener } from './SoundModule/Effectors/Listener';
import { Panner } from './SoundModule/Effectors/Panner';
import { Phaser } from './SoundModule/Effectors/Phaser';
import { PitchShifter } from './SoundModule/Effectors/PitchShifter';
import { Reverb } from './SoundModule/Effectors/Reverb';
import { Ringmodulator } from './SoundModule/Effectors/Ringmodulator';
import { Stereo } from './SoundModule/Effectors/Stereo';
import { Tremolo } from './SoundModule/Effectors/Tremolo';
import { Wah } from './SoundModule/Effectors/Wah';
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
  FFT,
  IFFT,
  ajax,
  convertTime,
  decode,
  requestFullscreen,
  exitFullscreen,
  read,
  drop,
  file,
  toFrequencies,
  toTextFile
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
XSound.FFT               = FFT;
XSound.IFFT              = IFFT;
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

XSound.Effector      = Effector;
XSound.Autopanner    = Autopanner;
XSound.Chorus        = Chorus;
XSound.Compressor    = Compressor;
XSound.Delay         = Delay;
XSound.Distortion    = Distortion;
XSound.Equalizer     = Equalizer;
XSound.Filter        = Filter;
XSound.Flanger       = Flanger;
XSound.Listener      = Listener;
XSound.Panner        = Panner;
XSound.Phaser        = Phaser;
XSound.PitchShifter  = PitchShifter;
XSound.Reverb        = Reverb;
XSound.Ringmodulator = Ringmodulator;
XSound.Stereo        = Stereo;
XSound.Tremolo       = Tremolo;
XSound.Wah           = Wah;

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
 * This class (static) method deletes one of global objects or both of global objects.
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

/** @override */
XSound.toString = (): string => {
  return '[XSound]';
};

// for Autoplay Policy
const setup = (): void => {
  XSound.setup().then(() => {}).catch(() => {});

  document.removeEventListener('click',      setup, true);
  document.removeEventListener('mousedown',  setup, true);
  document.removeEventListener('mouseup',    setup, true);
  document.removeEventListener('touchstart', setup, true);
  document.removeEventListener('touchend',   setup, true);
};

document.addEventListener('click',      setup, true);
document.addEventListener('mousedown',  setup, true);
document.addEventListener('mouseup',    setup, true);
document.addEventListener('touchstart', setup, true);
document.addEventListener('touchend',   setup, true);

// for `<script>`
window.XSound = XSound;
window.X      = XSound;  // Alias

// for ES Modules (If SSR (Server Side Rendering) ... etc)
export { XSound, XSound as X };
