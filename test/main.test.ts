import '../mocks/AudioContextMock';
import { XSound } from '../src/main';

describe(XSound.name, () => {
  test('should return undefined', () => {
    expect(XSound()).toBeUndefined();
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
