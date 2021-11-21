'use strict';

import './types';

// for legacy browsers
window.AudioContext = window.AudioContext || window.webkitAudioContext;
window.URL          = window.URL          || window.webkitURL;

const audiocontext = new AudioContext();

const XSound = () => {
};

/**
 * Class (Static) properties
 */
XSound.SAMPLE_RATE = audiocontext.sampleRate;

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
