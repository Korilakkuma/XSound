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
import { MIDI }  from './MIDI';
import { MML }  from './MML';

export * from './SoundModule';
export * from './OscillatorModule';
export * from './OneshotModule';
export * from './NoiseModule';
export * from './AudioModule';
export * from './MediaModule';
export * from './StreamModule';
export * from './ProcessorModule';
export * from './MixerModule';
export * from './MIDI';
export * from './MML';
export * from './SoundModule/Analyser';
export * from './SoundModule/Recorder';
export * from './SoundModule/Session';
export * from './SoundModule/Effectors/Effector';
export * from './SoundModule/Effectors/Autopanner';
export * from './SoundModule/Effectors/Chorus';
export * from './SoundModule/Effectors/Compressor';
export * from './SoundModule/Effectors/Delay';
export * from './SoundModule/Effectors/Distortion';
export * from './SoundModule/Effectors/EnvelopeGenerator';
export * from './SoundModule/Effectors/Equalizer';
export * from './SoundModule/Effectors/Filter';
export * from './SoundModule/Effectors/Flanger';
export * from './SoundModule/Effectors/Listener';
export * from './SoundModule/Effectors/Panner';
export * from './SoundModule/Effectors/Phaser';
export * from './SoundModule/Effectors/PitchShifter';
export * from './SoundModule/Effectors/Reverb';
export * from './SoundModule/Effectors/Ringmodulator';
export * from './SoundModule/Effectors/Stereo';
export * from './SoundModule/Effectors/Tremolo';
export * from './SoundModule/Effectors/VocalCanceler';
export * from './SoundModule/Effectors/Wah';
export * from './XSound';

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
 * This class (static) method changes `AudioContextState` to 'running'.
 * Initial state is 'suspended' by Autoplay Policy.
 * Therefore, this method must be invoked by user gestures.
 * @return {Promise<void>} Return value is `Promise`.
 */
export const setup = (): Promise<void> => {
  if (audiocontext.state !== 'running') {
    return audiocontext.resume();
  }

  return Promise.reject();
};

/**
 * This class (static) method returns closure that gets cloned instance of `Source`.
 * @return {function}
 */
export const clone = (): typeof ClonedXSound => {
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
export const free = (unusedSources: Source[]): void => {
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
export const noConflict = (deep: boolean): typeof XSound => {
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
export const get = (): AudioContext => {
  return audiocontext;
};

/**
 * This class (static) method gets elapsed time from creating instance of `AudioContext`.
 * @return {number}
 */
export const getCurrentTime = (): number => {
  return audiocontext.currentTime;
};

// for Autoplay Policy
const setupListener = (): void => {
  setup().then(() => {}).catch(() => {});

  document.removeEventListener('click',      setupListener, false);
  document.removeEventListener('mousedown',  setupListener, false);
  document.removeEventListener('mouseup',    setupListener, false);
  document.removeEventListener('touchstart', setupListener, false);
  document.removeEventListener('touchend',   setupListener, false);
};

document.addEventListener('click',      setupListener, false);
document.addEventListener('mousedown',  setupListener, false);
document.addEventListener('mouseup',    setupListener, false);
document.addEventListener('touchstart', setupListener, false);
document.addEventListener('touchend',   setupListener, false);

export const SAMPLE_RATE = audiocontext.sampleRate;

export { XSound, XSound as X };
