import type { FilterParams } from '/src/SoundModule/Effectors/Filter';

import { AudioContextMock } from '/mock/AudioContextMock';
import { Filter } from '/src/SoundModule/Effectors/Filter';

describe(Filter.name, () => {
  const context = new AudioContextMock();

  // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
  const filter = new Filter(context);

  describe(filter.start.name, () => {
    afterAll(() => {
      filter.deactivate();
    });

    test('should call automation methods in instance of `AudioParam`', () => {
      // eslint-disable-next-line dot-notation
      const frequency = filter['filter'].frequency;

      const originalCancelScheduledValuesMock   = frequency.cancelScheduledValues;
      const originalSetValueAtTimeMock          = frequency.setValueAtTime;
      const originalLinearRampToValueAtTimeMock = frequency.linearRampToValueAtTime;
      const originalSetTargetAtTimeMock         = frequency.setTargetAtTime;

      const cancelScheduledValuesMock   = jest.fn();
      const setValueAtTimeMock          = jest.fn();
      const linearRampToValueAtTimeMock = jest.fn();
      const setTargetAtTimeMock         = jest.fn();

      frequency.cancelScheduledValues   = cancelScheduledValuesMock;
      frequency.setValueAtTime          = setValueAtTimeMock;
      frequency.linearRampToValueAtTime = linearRampToValueAtTimeMock;
      frequency.setTargetAtTime         = setTargetAtTimeMock;

      filter.start(0);

      expect(cancelScheduledValuesMock).toHaveBeenCalledTimes(0);
      expect(setValueAtTimeMock).toHaveBeenCalledTimes(0);
      expect(linearRampToValueAtTimeMock).toHaveBeenCalledTimes(0);
      expect(setTargetAtTimeMock).toHaveBeenCalledTimes(0);

      filter.activate();

      filter.start(0);

      expect(cancelScheduledValuesMock).toHaveBeenCalledTimes(1);
      expect(setValueAtTimeMock).toHaveBeenCalledTimes(1);
      expect(linearRampToValueAtTimeMock).toHaveBeenCalledTimes(1);
      expect(setTargetAtTimeMock).toHaveBeenCalledTimes(1);

      frequency.cancelScheduledValues   = originalCancelScheduledValuesMock;
      frequency.setValueAtTime          = originalSetValueAtTimeMock;
      frequency.linearRampToValueAtTime = originalLinearRampToValueAtTimeMock;
      frequency.setTargetAtTime         = originalSetTargetAtTimeMock;
    });
  });

  describe(filter.stop.name, () => {
    afterAll(() => {
      filter.deactivate();
    });

    test('should call automation methods in instance of `AudioParam`', () => {
      // eslint-disable-next-line dot-notation
      const frequency = filter['filter'].frequency;

      const originalCancelAndHoldAtTimeMock = frequency.cancelAndHoldAtTime;
      const originalSetTargetAtTimeMock     = frequency.setTargetAtTime;

      const cancelAndHoldAtTimeMock = jest.fn();
      const setTargetAtTimeMock     = jest.fn();

      frequency.cancelAndHoldAtTime = cancelAndHoldAtTimeMock;
      frequency.setTargetAtTime     = setTargetAtTimeMock;

      filter.stop();

      expect(cancelAndHoldAtTimeMock).toHaveBeenCalledTimes(0);
      expect(setTargetAtTimeMock).toHaveBeenCalledTimes(0);

      filter.activate();

      filter.stop();

      expect(cancelAndHoldAtTimeMock).toHaveBeenCalledTimes(1);
      expect(setTargetAtTimeMock).toHaveBeenCalledTimes(1);

      frequency.cancelAndHoldAtTime = originalCancelAndHoldAtTimeMock;
      frequency.setTargetAtTime     = originalSetTargetAtTimeMock;
    });
  });

  describe(filter.connect.name, () => {
    /* eslint-disable dot-notation */
    const originalInput  = filter['input'];
    const originalFilter = filter['filter'];
    /* eslint-enable dot-notation */

    afterAll(() => {
      /* eslint-disable dot-notation */
      filter['input']  = originalInput;
      filter['filter'] = originalFilter;
      /* eslint-enable dot-notation */

      filter.deactivate();
    });

    test('should call `connect` method', () => {
      const inputConnectMock     = jest.fn();
      const inputDisconnectMock  = jest.fn();
      const filterConnectMock    = jest.fn();
      const filterDisconnectMock = jest.fn();

      /* eslint-disable dot-notation */
      filter['input'].connect     = inputConnectMock;
      filter['input'].disconnect  = inputDisconnectMock;
      filter['filter'].connect    = filterConnectMock;
      filter['filter'].disconnect = filterDisconnectMock;
      /* eslint-enable dot-notation */

      filter.connect();

      expect(inputConnectMock).toHaveBeenCalledTimes(1);
      expect(filterConnectMock).toHaveBeenCalledTimes(0);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(1);
      expect(filterDisconnectMock).toHaveBeenCalledTimes(1);

      filter.activate();

      expect(inputConnectMock).toHaveBeenCalledTimes(2);
      expect(filterConnectMock).toHaveBeenCalledTimes(1);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(2);
      expect(filterDisconnectMock).toHaveBeenCalledTimes(2);
    });
  });

  describe(filter.param.name, () => {
    const defaultParams : FilterParams = {
      type     : 'lowpass',
      frequency: 350,
      Q        : 1,
      gain     : 0,
      range    : 0.1,
      attack   : 0.01,
      decay    : 0.3,
      sustain  : 1.0,
      release  : 1.0
    };

    const params: FilterParams = {
      type     : 'peaking',
      frequency: 4000,
      Q        : 20,
      gain     : 18,
      range    : 0.5,
      attack   : 0.5,
      decay    : 0.5,
      sustain  : 0.5,
      release  : 0.5
    };

    beforeAll(() => {
      filter.param(params);
    });

    afterAll(() => {
      filter.param(defaultParams);
    });

    // Setter
    test('should return instance of `Filter`', () => {
      expect(filter.param(params)).toBeInstanceOf(Filter);
    });

    // Getter
    test('should return `frequency`', () => {
      expect(filter.param('frequency')).toBeCloseTo(4000, 1);
    });

    test('should return `Q` (Quality Factor)', () => {
      expect(filter.param('Q')).toBeCloseTo(20, 1);
    });

    test('should return `gain`', () => {
      expect(filter.param('gain')).toBeCloseTo(18, 1);
    });

    test('should return `range`', () => {
      expect(filter.param('range')).toBeCloseTo(0.5, 1);
    });

    test('should return `attack`', () => {
      expect(filter.param('attack')).toBeCloseTo(0.5, 1);
    });

    test('should return `decay`', () => {
      expect(filter.param('decay')).toBeCloseTo(0.5, 1);
    });

    test('should return `sustain`', () => {
      expect(filter.param('sustain')).toBeCloseTo(0.5, 1);
    });

    test('should return `release`', () => {
      expect(filter.param('release')).toBeCloseTo(0.5, 1);
    });
  });

  describe(filter.params.name, () => {
    test('should return parameters for filter effector as associative array', () => {
      expect(filter.params()).toStrictEqual({
        state    : false,
        type     : 'lowpass',
        frequency: 350,
        Q        : 1,
        gain     : 0,
        range    : 0.1,
        attack   : 0.01,
        decay    : 0.3,
        sustain  : 1.0,
        release  : 1.0
      });
    });
  });

  describe(filter.activate.name, () => {
    test('should be active and call `connect` method', () => {
      const originalConnect = filter.connect;

      const connectMock = jest.fn();

      filter.connect = connectMock;

      filter.activate();

      expect(filter.state()).toBe(true);
      expect(connectMock).toHaveBeenCalledTimes(1);

      filter.connect = originalConnect;
    });
  });

  describe(filter.deactivate.name, () => {
    test('should be inactive and call `connect` method', () => {
      const originalConnect = filter.connect;

      const connectMock = jest.fn();

      filter.connect = connectMock;

      filter.deactivate();

      expect(filter.state()).toBe(false);
      expect(connectMock).toHaveBeenCalledTimes(1);

      filter.connect = originalConnect;
    });
  });
});
