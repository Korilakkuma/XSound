import { AudioContextMock } from '/mock/AudioContextMock';
import { Compressor, CompressorParams } from '/src/SoundModule/Effectors/Compressor';

describe(Compressor.name, () => {
  const context = new AudioContextMock();

  // @ts-ignore
  const compressor = new Compressor(context);

  describe(compressor.connect.name, () => {
    /* eslint-disable dot-notation */
    const originalInput      = compressor['input'];
    const originalCompressor = compressor['compressor'];
    /* eslint-enable dot-notation */

    afterAll(() => {
      /* eslint-disable dot-notation */
      compressor['input']      = originalInput;
      compressor['compressor'] = originalCompressor;
      /* eslint-enable dot-notation */

      compressor.activate();
    });

    test('should call `connect` method', () => {
      const inputConnectMock         = jest.fn();
      const inputDisconnectMock      = jest.fn();
      const compressorConnectMock    = jest.fn();
      const compressorDisconnectMock = jest.fn();

      /* eslint-disable dot-notation */
      compressor['input'].connect         = inputConnectMock;
      compressor['input'].disconnect      = inputDisconnectMock;
      compressor['compressor'].connect    = compressorConnectMock;
      compressor['compressor'].disconnect = compressorDisconnectMock;
      /* eslint-enable dot-notation */

      compressor.connect();

      expect(inputConnectMock).toHaveBeenCalledTimes(1);
      expect(compressorConnectMock).toHaveBeenCalledTimes(1);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(1);
      expect(compressorDisconnectMock).toHaveBeenCalledTimes(1);

      compressor.deactivate();

      expect(inputConnectMock).toHaveBeenCalledTimes(2);
      expect(compressorConnectMock).toHaveBeenCalledTimes(1);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(2);
      expect(compressorDisconnectMock).toHaveBeenCalledTimes(2);
    });
  });

  describe(compressor.param.name, () => {
    const defaultParams: CompressorParams = {
      threshold: -24,
      knee     : 30,
      ratio    : 12,
      attack   : 0.003,
      release  : 0.25
    };

    const params: CompressorParams = {
      threshold: -100,
      knee     : 50,
      ratio    : 4,
      attack   : 0.05,
      release  : 0.5
    };

    beforeAll(() => {
      compressor.param(params);
    });

    afterAll(() => {
      compressor.param(defaultParams);
    });

    // Setter
    test('should return instance of `Compressor`', () => {
      expect(compressor.param(params)).toBeInstanceOf(Compressor);
    });

    // Getter
    test('should return `threshold`', () => {
      expect(compressor.param('threshold')).toBeCloseTo(-100, 1);
    });

    test('should return `knee`', () => {
      expect(compressor.param('knee')).toBeCloseTo(50, 1);
    });

    test('should return `ratio`', () => {
      expect(compressor.param('ratio')).toBeCloseTo(4, 1);
    });

    test('should return `attack`', () => {
      expect(compressor.param('attack')).toBeCloseTo(0.05, 2);
    });

    test('should return `release`', () => {
      expect(compressor.param('release')).toBeCloseTo(0.5, 1);
    });
  });

  describe(compressor.params.name, () => {
    test('should return parameters for compressor as associative array', () => {
      expect(compressor.params()).toStrictEqual({
        state    : true,
        threshold: -24,
        knee     : 30,
        ratio    : 12,
        attack   : 0.003,
        release  : 0.25
      });
    });
  });

  describe(compressor.activate.name, () => {
    test('should call `connect` method', () => {
      // compressor is active by default
      compressor.deactivate();

      const originalConnect = compressor.connect;

      const connectMock = jest.fn();

      compressor.connect = connectMock;

      compressor.activate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      compressor.connect = originalConnect;
    });
  });

  describe(compressor.deactivate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = compressor.connect;

      const connectMock = jest.fn();

      compressor.connect = connectMock;

      compressor.deactivate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      compressor.connect = originalConnect;

      // compressor is active by default
      compressor.activate();
    });
  });
});
