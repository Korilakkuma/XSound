import '../mock/AudioContextMock';
import { OscillatorModule } from '../src/OscillatorModule';
import { OneshotModule } from '../src/OneshotModule';
import { NoiseModule } from '../src/NoiseModule';
import { AudioModule } from '../src/AudioModule';
import { MediaModule } from '../src/MediaModule';
import { StreamModule } from '../src/StreamModule';
import { MixerModule } from '../src/MixerModule';
import { ProcessorModule } from '../src/ProcessorModule';
import { MIDI } from '../src/MIDI';
import { MML } from '../src/MML';
import {
  XSound,
  setup,
  clone,
  free,
  noConflict,
  get,
  getCurrentTime
} from '../src/main';

describe(XSound.name, () => {
  test('should return instance of `Source`', () => {
    expect(XSound('oscillator')).toBeInstanceOf(OscillatorModule);
    expect(XSound('oneshot')).toBeInstanceOf(OneshotModule);
    expect(XSound('noise')).toBeInstanceOf(NoiseModule);
    expect(XSound('audio')).toBeInstanceOf(AudioModule);
    expect(XSound('media')).toBeInstanceOf(MediaModule);
    expect(XSound('stream')).toBeInstanceOf(StreamModule);
    expect(XSound('processor')).toBeInstanceOf(ProcessorModule);
    expect(XSound('mixer')).toBeInstanceOf(MixerModule);
    expect(XSound('midi')).toBeInstanceOf(MIDI);
    expect(XSound('mml')).toBeInstanceOf(MML);
  });
});

describe(setup.name, () => {
  test('should be `running` after success', () => {
    return setup()
      .then(() => {
        const context = get();

        expect(context.state).toBe('running');
      })
      .catch(() => {
      });
  });
});

describe(clone.name, () => {
  const ClonedXSound = clone();

  test('should return cloned instance of `Source`', () => {
    expect(ClonedXSound('oscillator')).toBeInstanceOf(OscillatorModule);
    expect(ClonedXSound('oneshot')).toBeInstanceOf(OneshotModule);
    expect(ClonedXSound('noise')).toBeInstanceOf(NoiseModule);
    expect(ClonedXSound('audio')).toBeInstanceOf(AudioModule);
    expect(ClonedXSound('media')).toBeInstanceOf(MediaModule);
    expect(ClonedXSound('stream')).toBeInstanceOf(StreamModule);
    expect(ClonedXSound('processor')).toBeInstanceOf(ProcessorModule);
    expect(ClonedXSound('mixer')).toBeInstanceOf(MixerModule);
    expect(ClonedXSound('midi')).toBeInstanceOf(MIDI);
    expect(ClonedXSound('mml')).toBeInstanceOf(MML);

    expect(ClonedXSound('oscillator') === XSound('oscillator')).toBe(false);
    expect(ClonedXSound('oneshot') === XSound('oneshot')).toBe(false);
    expect(ClonedXSound('noise') === XSound('noise')).toBe(false);
    expect(ClonedXSound('audio') === XSound('audio')).toBe(false);
    expect(ClonedXSound('media') === XSound('media')).toBe(false);
    expect(ClonedXSound('stream') === XSound('stream')).toBe(false);
    expect(ClonedXSound('processor') === XSound('processor')).toBe(false);
    expect(ClonedXSound('mixer') === XSound('mixer')).toBe(false);
    expect(ClonedXSound('midi') === XSound('midi')).toBe(false);
    expect(ClonedXSound('mml') === XSound('mml')).toBe(false);
  });

  test('should return instance of `Source` except unused', () => {
    ClonedXSound.free([ClonedXSound('oscillator'), ClonedXSound('midi')]);

    expect(ClonedXSound('oscillator')).toBe(null);
    expect(ClonedXSound('oneshot')).toBeInstanceOf(OneshotModule);
    expect(ClonedXSound('noise')).toBeInstanceOf(NoiseModule);
    expect(ClonedXSound('audio')).toBeInstanceOf(AudioModule);
    expect(ClonedXSound('media')).toBeInstanceOf(MediaModule);
    expect(ClonedXSound('stream')).toBeInstanceOf(StreamModule);
    expect(ClonedXSound('processor')).toBeInstanceOf(ProcessorModule);
    expect(ClonedXSound('mixer')).toBeInstanceOf(MixerModule);
    expect(ClonedXSound('midi')).toBe(null);
    expect(ClonedXSound('mml')).toBeInstanceOf(MML);
  });
});

describe(free.name, () => {
  test('should return instance of `Source` except unused', () => {
    free([XSound('oscillator'), XSound('midi')]);

    expect(XSound('oscillator')).toBe(null);
    expect(XSound('oneshot')).toBeInstanceOf(OneshotModule);
    expect(XSound('noise')).toBeInstanceOf(NoiseModule);
    expect(XSound('audio')).toBeInstanceOf(AudioModule);
    expect(XSound('media')).toBeInstanceOf(MediaModule);
    expect(XSound('stream')).toBeInstanceOf(StreamModule);
    expect(XSound('processor')).toBeInstanceOf(ProcessorModule);
    expect(XSound('mixer')).toBeInstanceOf(MixerModule);
    expect(XSound('midi')).toBe(null);
    expect(XSound('mml')).toBeInstanceOf(MML);
  });
});

describe(noConflict.name, () => {
  test('should return `XSound`', () => {
    const Y = XSound;

    expect(noConflict(false)).toBe(XSound);
    expect(noConflict(true)).toBe(Y);

    window.XSound = Y;
    window.X      = Y;
  });
});

describe(get.name, () => {
  test('should return instance of `AudioContext`', () => {
    expect(get()).toBeInstanceOf(AudioContext);
  });
});

describe(getCurrentTime.name, () => {
  test('should return elapsed time from creating instance of `AudioContext`', () => {
    expect(getCurrentTime()).toBeGreaterThanOrEqual(0);
  });
});
