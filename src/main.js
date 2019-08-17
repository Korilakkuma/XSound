'use strict';

import { SoundModule } from './SoundModule';
import { OscillatorModule } from './OscillatorModule';
import { OneshotModule } from './OneshotModule';
import { NoiseModule } from './NoiseModule';
import { AudioModule } from './AudioModule';
import { MediaModule } from './MediaModule';
import { StreamModule } from './StreamModule';
import { MixerModule } from './MixerModule';
import { ProcessorModule} from './ProcessorModule';
import { MIDI } from './MIDI';
import { MML } from './MML';
import { Effector } from './SoundModule/Effectors/Effector';
import {
    ajax,
    convertTime,
    decode,
    exitFullscreen,
    file,
    requestFullscreen,
    read,
    toFrequencies,
    toTextFile
} from './XSound';

const global = (typeof window !== 'undefined') ? window : {};

// for legacy browsers
global.AudioContext = global.AudioContext || global.webkitAudioContext;
global.MediaSource  = global.MediaSource  || global.WebkitMediaSource;
global.URL          = global.URL          || global.webkitURL || global.mozURL;

global.requestAnimationFrame = global.requestAnimationFrame       ||
                               global.webkitRequestAnimationFrame ||
                               global.mozRequestAnimationFrame    ||
                               (callback => global.setTimeout(callback, (1000 / 60)));

global.cancelAnimationFrame = global.cancelAnimationFrame       ||
                              global.webkitCancelAnimationFrame ||
                              global.mozCancelAnimationFrame    ||
                              global.clearTimeout;

let XSound;

const IS_XSOUND = Boolean(global.AudioContext);

if (IS_XSOUND) {
    const audiocontext = new AudioContext();

    // for legacy browsers
    audiocontext.createScriptProcessor = audiocontext.createScriptProcessor || audiocontext.createJavaScriptNode;
    audiocontext.createGain            = audiocontext.createGain            || audiocontext.createGainNode;
    audiocontext.createDelay           = audiocontext.createDelay           || audiocontext.createDelayNode;
    audiocontext.createPeriodicWave    = audiocontext.createPeriodicWave    || audiocontext.createWaveTable;

    const sources = {
        'oscillator' : new OscillatorModule(audiocontext),
        'oneshot'    : new OneshotModule(audiocontext),
        'noise'      : new NoiseModule(audiocontext),
        'audio'      : new AudioModule(audiocontext),
        'media'      : new MediaModule(audiocontext),
        'stream'     : new StreamModule(audiocontext),
        'mixer'      : new MixerModule(audiocontext),
        'processor'  : new ProcessorModule(audiocontext),
        'midi'       : new MIDI(audiocontext),
        'mml'        : new MML(audiocontext)
    };

    /**
     * This function is global object for getting the instance of `OscillatorModule` or `OneshotModule` or `NoiseModule` or `AudioModule` or `MediaModule` or `StreamModule` or `MixerModule` or `ProcessorModule` or `MIDI` or `MML` or `Oscillator`.
     * @param {string} source This argument is one of 'oscillator', 'oneshot', 'noise', 'audio', 'media', 'stream', 'mixer', 'processor', 'midi', 'mml'.
     * @param {number} index This argument is in order to select one of some oscillators.
     * @return {OscillatorModule|OneshotModule|NoiseModule|AudioModule|MediaModule|StreamModule|MixerModule|ProcessorModule|MIDI|MML|Oscillator}
     */
    XSound = (source, index) => {
        const s = String(source).replace(/-/g, '').toLowerCase();

        switch (s) {
            case 'oscillator':
                if (index === undefined) {
                    return sources.oscillator;
                }

                const i = parseInt(index, 10);

                if ((i >= 0) && (i < sources.oscillator.length())) {
                    return sources.oscillator.get(i);
                }

                return null;
            case 'oneshot'  :
            case 'noise'    :
            case 'audio'    :
            case 'media'    :
            case 'stream'   :
            case 'mixer'    :
            case 'processor':
            case 'midi'     :
            case 'mml'      :
                return sources[s];
            default :
                return null;
        }
    };

    /**
     * Class (Static) properties
     */
    XSound.IS_XSOUND         = IS_XSOUND;
    XSound.SAMPLE_RATE       = audiocontext.sampleRate;
    XSound.NUMBER_OF_INPUTS  = SoundModule.NUMBER_OF_INPUTS;
    XSound.NUMBER_OF_OUTPUTS = SoundModule.NUMBER_OF_OUTPUTS;
    XSound.ajax              = ajax;
    XSound.convertTime       = convertTime;
    XSound.decode            = decode;
    XSound.exitFullscreen    = exitFullscreen;
    XSound.file              = file;
    XSound.requestFullscreen = requestFullscreen;
    XSound.read              = read;
    XSound.toFrequencies     = toFrequencies;
    XSound.toTextFile        = toTextFile;

    XSound.Effector = Effector;

    /**
     * This class (static) method changes state ('running') of `AudioContext`.
     * The initial state is 'suspended' by Autoplay Policy Change.
     * Therefore, this method must be invoked by user gestures.
     * @return {Promise} This is returned as `Promise`.
     */
    XSound.setup = () => {
        if (audiocontext.state !== 'running') {
            return audiocontext.resume();
        }

        return Promise.reject();
    };

    /**
     * This class (static) method returns function as closure that is getter of cloned module.
     * @return {function} This is returned as closure that is getter of cloned module.
     */
    XSound.clone = () => {
        const clones = {
            'oscillator' : new OscillatorModule(audiocontext),
            'oneshot'    : new OneshotModule(audiocontext),
            'noise'      : new NoiseModule(audiocontext),
            'audio'      : new AudioModule(audiocontext),
            'media'      : new MediaModule(audiocontext),
            'stream'     : new StreamModule(audiocontext),
            'mixer'      : new MixerModule(audiocontext),
            'processor'  : new ProcessorModule(audiocontext),
            'midi'       : new MIDI(audiocontext),
            'mml'        : new MML(audiocontext)
        };

        const C = (source, index) => {
            const s = String(source).replace(/-/g, '').toLowerCase();

            switch (s) {
                case 'oscillator':
                    if (index === undefined) {
                        return clones.oscillator;
                    }

                    const i = parseInt(index, 10);

                    if ((i >= 0) && (i < clones.oscillator.length())) {
                        return clones.oscillator.get(i);
                    }

                    return null;
                case 'oneshot'  :
                case 'noise'    :
                case 'audio'    :
                case 'media'    :
                case 'stream'   :
                case 'mixer'    :
                case 'processor':
                case 'midi'     :
                case 'mml'      :
                    return clones[s];
                default :
                    return null;
            }
        };

        C.free  = sourceList => {
            if (!Array.isArray(sourceList)) {
                sourceList = [sourceList];
            }

            for (const source of sourceList) {
                // Already deleted ?
                if (source === null) {
                    continue;
                }

                for (const key in clones) {
                    if (source === clones[key]) {
                        clones[key] = null;
                    }
                }
            }
        };

        // Closure
        return C;
    };

    /**
     * This class (static) method releases memory of unnecessary instances.
     * @param {Array.<SoundModule|MIDI|MML>} sourceList This argument is the array that contains the instances of `SoundModule` or `MIDI` or `MML`.
     */
    XSound.free = sourceList => {
        if (!Array.isArray(sourceList)) {
            sourceList = [sourceList];
        }

        for (const source of sourceList) {
            // Already deleted ?
            if (source === null) {
                continue;
            }

            for (const key in sources) {
                if (source === sources[key]) {
                    sources[key] = null;
                }
            }
        }
    };

    /**
     * This class (static) method removes one of the global objects or both of the global objects.
     * @param {boolean} deep This argument is in order to select whether removing both of global objects.
     *     If this value is `true`, both of global objects are removed.
     * @return {XSound}
     */
    XSound.noConflict = deep => {
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
     * This class (static) method gets the instance of `AudioContext`.
     * @return {AudioContext}
     */
    XSound.get = () => {
        return audiocontext;
    };

    /**
     * This class (static) method gets `currentTime` property in the instance of `AudioContext`.
     * @return {number}
     */
    XSound.getCurrentTime = () => {
        return audiocontext.currentTime;
    };

    /** @override */
    XSound.toString = () => {
        return '[XSound]';
    };

    // for Autoplay Policy
    const setup = () => {
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

} else {
    XSound = () => null;

    XSound.IS_XSOUND = IS_XSOUND;
}

// for `<script>`
global.XSound = XSound;
global.X      = XSound;  // Alias of `XSound`

// for ESModules and SSR (Server Side Rendering)
if (typeof exports !== 'undefined') {
    exports.XSound = XSound;
    exports.X      = XSound;  // Alias of `XSound`
}
