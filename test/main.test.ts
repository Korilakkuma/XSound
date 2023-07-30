import '/mock/AudioContextMock';
import { OscillatorModule } from '/src/OscillatorModule';
import { OneshotModule } from '/src/OneshotModule';
import { NoiseModule } from '/src/NoiseModule';
import { AudioModule } from '/src/AudioModule';
import { MediaModule } from '/src/MediaModule';
import { StreamModule } from '/src/StreamModule';
import { MixerModule } from '/src/MixerModule';
import { ProcessorModule } from '/src/ProcessorModule';
import { MIDI } from '/src/MIDI';
import { MML } from '/src/MML';
import { XSound } from '/src/main';

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

describe(XSound.setup.name, () => {
  test('should be `running` after success', () => {
    return XSound.setup()
      .then(() => {
        const context = XSound.get();

        expect(context.state).toBe('running');
      })
      .catch(() => {
      });
  });
});

describe(XSound.clone.name, () => {
  test('should return cloned instance of `Source`', () => {
    const clonedXSound = XSound.clone();

    expect(clonedXSound('oscillator')).toBeInstanceOf(OscillatorModule);
    expect(clonedXSound('oneshot')).toBeInstanceOf(OneshotModule);
    expect(clonedXSound('noise')).toBeInstanceOf(NoiseModule);
    expect(clonedXSound('audio')).toBeInstanceOf(AudioModule);
    expect(clonedXSound('media')).toBeInstanceOf(MediaModule);
    expect(clonedXSound('stream')).toBeInstanceOf(StreamModule);
    expect(clonedXSound('processor')).toBeInstanceOf(ProcessorModule);
    expect(clonedXSound('mixer')).toBeInstanceOf(MixerModule);
    expect(clonedXSound('midi')).toBeInstanceOf(MIDI);
    expect(clonedXSound('mml')).toBeInstanceOf(MML);

    expect(clonedXSound('oscillator') === XSound('oscillator')).toBe(false);
    expect(clonedXSound('oneshot') === XSound('oneshot')).toBe(false);
    expect(clonedXSound('noise') === XSound('noise')).toBe(false);
    expect(clonedXSound('audio') === XSound('audio')).toBe(false);
    expect(clonedXSound('media') === XSound('media')).toBe(false);
    expect(clonedXSound('stream') === XSound('stream')).toBe(false);
    expect(clonedXSound('processor') === XSound('processor')).toBe(false);
    expect(clonedXSound('mixer') === XSound('mixer')).toBe(false);
    expect(clonedXSound('midi') === XSound('midi')).toBe(false);
    expect(clonedXSound('mml') === XSound('mml')).toBe(false);
  });

  test('should return instance of `Source` except unused', () => {
    const clonedXSound = XSound.clone();

    clonedXSound.free([clonedXSound('oscillator'), clonedXSound('midi')]);

    expect(clonedXSound('oscillator')).toBe(null);
    expect(clonedXSound('oneshot')).toBeInstanceOf(OneshotModule);
    expect(clonedXSound('noise')).toBeInstanceOf(NoiseModule);
    expect(clonedXSound('audio')).toBeInstanceOf(AudioModule);
    expect(clonedXSound('media')).toBeInstanceOf(MediaModule);
    expect(clonedXSound('stream')).toBeInstanceOf(StreamModule);
    expect(clonedXSound('processor')).toBeInstanceOf(ProcessorModule);
    expect(clonedXSound('mixer')).toBeInstanceOf(MixerModule);
    expect(clonedXSound('midi')).toBe(null);
    expect(clonedXSound('mml')).toBeInstanceOf(MML);
  });
});

describe(XSound.free.name, () => {
  test('should return instance of `Source` except unused', () => {
    XSound.free([XSound('oscillator'), XSound('midi')]);

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

describe(XSound.noConflict.name, () => {
  test('should return `XSound`', () => {
    const Y = XSound;

    expect(XSound.noConflict(false)).toBe(XSound);
    expect(XSound.noConflict(true)).toBe(Y);

    window.XSound = Y;
    window.X      = Y;
  });
});

describe(XSound.get.name, () => {
  test('should return instance of `AudioContext`', () => {
    expect(XSound.get()).toBeInstanceOf(AudioContext);
  });
});

describe(XSound.getCurrentTime.name, () => {
  test('should return elapsed time from creating instance of `AudioContext`', () => {
    expect(XSound.getCurrentTime()).toBeGreaterThanOrEqual(0);
  });
});
