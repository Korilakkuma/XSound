import { AudioContextMock } from '../../mock/AudioContextMock';
import { OscillatorNodeMock } from '../../mock/OscillatorNodeMock';
import { Glide, GlideParams } from '../../src/OscillatorModule/Glide';

describe(Glide.name, () => {
  const context = new AudioContextMock();

  // @ts-ignore
  const glide = new Glide(context);

  describe(glide.ready.name, () => {
    glide.param({ time: 1 });

    glide.ready(440);

    // eslint-disable-next-line dot-notation
    expect(glide['prevFrequency'] === glide['nextFrequency']).toBeTruthy();

    glide.ready(440);

    // eslint-disable-next-line dot-notation
    expect(glide['prevFrequency'] === glide['nextFrequency']).toBeTruthy();

    glide.ready(880);

    /* eslint-disable dot-notation */
    expect(glide['prevFrequency']).toBeCloseTo(440, 1);
    expect(glide['nextFrequency']).toBeCloseTo(880, 1);
    /* eslint-enable dot-notation */
  });

  describe(glide.start.name, () => {
    const oscillator = new OscillatorNodeMock();

    const cancelScheduledValuesMock        = jest.fn();
    const setValueAtTimeMock               = jest.fn();
    const linearRampToValueAtTimeMock      = jest.fn();
    const exponentialRampToValueAtTimeMock = jest.fn();

    oscillator.frequency.cancelScheduledValues        = cancelScheduledValuesMock;
    oscillator.frequency.setValueAtTime               = setValueAtTimeMock;
    oscillator.frequency.linearRampToValueAtTime      = linearRampToValueAtTimeMock;
    oscillator.frequency.exponentialRampToValueAtTime = exponentialRampToValueAtTimeMock;

    // @ts-ignore
    glide.start(oscillator, 5);

    expect(cancelScheduledValuesMock).toHaveBeenCalledTimes(1);
    expect(setValueAtTimeMock).toHaveBeenCalledTimes(1);
    expect(linearRampToValueAtTimeMock).toHaveBeenCalledTimes(1);
    expect(exponentialRampToValueAtTimeMock).toHaveBeenCalledTimes(0);

    glide.param({ type: 'exponential' });

    // @ts-ignore
    glide.start(oscillator, 5);

    expect(cancelScheduledValuesMock).toHaveBeenCalledTimes(2);
    expect(setValueAtTimeMock).toHaveBeenCalledTimes(2);
    expect(linearRampToValueAtTimeMock).toHaveBeenCalledTimes(1);
    expect(exponentialRampToValueAtTimeMock).toHaveBeenCalledTimes(1);
  });

  describe(glide.stop.name, () => {
    glide.stop();

    // eslint-disable-next-line dot-notation
    expect(glide['prevFrequency'] === glide['nextFrequency']).toBeTruthy();
  });

  describe(glide.param.name, () => {
    const defaultParams: GlideParams = {
      type: 'linear',
      time: 0
    };

    const params: GlideParams = {
      type: 'exponential',
      time: 5
    };

    beforeAll(() => {
      glide.param(params);
    });

    afterAll(() => {
      glide.param(defaultParams);
    });

    test('should return `type`', () => {
      expect(glide.param('type')).toBe('exponential');
    });

    test('should return `time`', () => {
      expect(glide.param('time')).toBeCloseTo(5, 1);
    });
  });

  describe(glide.params.name, () => {
    test('should return parameters for glide as associative array', () => {
      expect(glide.params()).toStrictEqual({
        type: 'linear',
        time: 0
      });
    });
  });
});
