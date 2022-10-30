import { AudioContextMock } from '../../../mock/AudioContextMock';
import {
  Distortion,
  DistortionParams,
  PreEqualizerParams,
  PostEqualizerParams,
  CabinetParams
} from '../../../src/SoundModule/Effectors/Distortion';

describe(Distortion.name, () => {
  const context = new AudioContextMock();

  // @ts-ignore
  const distortion = new Distortion(context);

  describe(distortion.connect.name, () => {
    /* eslint-disable dot-notation */
    const originalInput  = distortion['input'];
    const originalPreEQ  = distortion['preEQ']['output'];
    const originalPostEQ = distortion['postEQ']['output'];
    const originalCabinet = distortion['cabinet']['output'];
    /* eslint-enable dot-notation */

    afterAll(() => {
      /* eslint-disable dot-notation */
      distortion['input']             = originalInput;
      distortion['preEQ']['output']   = originalPreEQ;
      distortion['postEQ']['output']  = originalPostEQ;
      distortion['cabinet']['output'] = originalCabinet;
      /* eslint-enable dot-notation */

      distortion.deactivate();
    });

    test('should call `connect` method', () => {
      const inputConnectMock      = jest.fn();
      const inputDisconnectMock   = jest.fn();
      const preEQConnectMock      = jest.fn();
      const preEQDisconnectMock   = jest.fn();
      const postEQConnectMock     = jest.fn();
      const postEQDisconnectMock  = jest.fn();
      const cabinetConnectMock    = jest.fn();
      const cabinetDisconnectMock = jest.fn();

      /* eslint-disable dot-notation */
      distortion['input'].connect                = inputConnectMock;
      distortion['input'].disconnect             = inputDisconnectMock;
      distortion['preEQ']['output'].connect      = preEQConnectMock;
      distortion['preEQ']['output'].disconnect   = preEQDisconnectMock;
      distortion['postEQ']['output'].connect     = postEQConnectMock;
      distortion['postEQ']['output'].disconnect  = postEQDisconnectMock;
      distortion['cabinet']['output'].connect    = cabinetConnectMock;
      distortion['cabinet']['output'].disconnect = cabinetDisconnectMock;
      /* eslint-enable dot-notation */

      distortion.connect();

      expect(inputConnectMock).toHaveBeenCalledTimes(1);
      expect(preEQConnectMock).toHaveBeenCalledTimes(0);
      expect(postEQConnectMock).toHaveBeenCalledTimes(0);
      expect(cabinetConnectMock).toHaveBeenCalledTimes(0);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(1);
      expect(preEQDisconnectMock).toHaveBeenCalledTimes(0);
      expect(postEQDisconnectMock).toHaveBeenCalledTimes(0);
      expect(cabinetDisconnectMock).toHaveBeenCalledTimes(0);

      distortion.activate();

      expect(inputConnectMock).toHaveBeenCalledTimes(2);
      expect(preEQConnectMock).toHaveBeenCalledTimes(1);
      expect(postEQConnectMock).toHaveBeenCalledTimes(1);
      expect(cabinetConnectMock).toHaveBeenCalledTimes(1);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(2);
      expect(preEQDisconnectMock).toHaveBeenCalledTimes(0);
      expect(postEQDisconnectMock).toHaveBeenCalledTimes(0);
      expect(cabinetDisconnectMock).toHaveBeenCalledTimes(0);
    });
  });

  describe(distortion.param.name, () => {
    const defaultPreEQParams: PreEqualizerParams = {
      state: false,
      curve: null,
      gain : 0.5,
      lead : 0.5
    };

    const defaultPostEQParams: PostEqualizerParams = {
      state    : false,
      curve    : null,
      bass     : 0,
      middle   : 0,
      treble   : 0,
      frequency: 500
    };

    const defaultCabinetParams: CabinetParams = {
      state: false
    };

    const defaultParams: DistortionParams = {
      curve  : 'clean',
      samples: 256,
      pre    : defaultPreEQParams,
      post   : defaultPostEQParams,
      cabinet: defaultCabinetParams
    };

    const preEQParams: PreEqualizerParams = {
      state: true,
      curve: new Float32Array([0, 0, 0, 0]),
      gain : 0.75,
      lead : 0.5
    };

    const postEQParams: PostEqualizerParams = {
      state    : true,
      curve    : new Float32Array([0, 0, 0, 0]),
      bass     : 10,
      middle   : -10,
      treble   : 10,
      frequency: 1000
    };

    const cabinetParams: CabinetParams = {
      state: true
    };

    const params: DistortionParams = {
      curve  : 'overdrive',
      samples: 4,
      pre    : preEQParams,
      post   : postEQParams,
      cabinet: cabinetParams
    };

    beforeAll(() => {
      distortion.param(params);
    });

    afterAll(() => {
      distortion.param(defaultParams);
    });

    test('should return curve', () => {
      expect(distortion.param('curve')).toBe('overdrive');
    });

    test('should return samples', () => {
      expect(distortion.param('samples')).toBe(4);
    });

    test('should return Pre-Equalizer parameters', () => {
      expect(distortion.param('pre')).toStrictEqual(preEQParams);
    });

    test('should return Post-Equalizer parameters', () => {
      expect(distortion.param('post')).toStrictEqual(postEQParams);
    });

    test('should return Cabinet parameters', () => {
      expect(distortion.param('cabinet')).toStrictEqual(cabinetParams);
    });
  });

  describe(distortion.params.name, () => {
    test('should return parameters for distortion effector as associative array', () => {
      expect(distortion.params()).toStrictEqual({
        state  : false,
        curve  : 'clean',
        samples: 256,
        pre    : distortion.param('pre'),
        post   : distortion.param('post'),
        cabinet: distortion.param('cabinet')
      });
    });
  });

  describe(distortion.activate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = distortion.connect;

      const connectMock = jest.fn();

      distortion.connect = connectMock;

      distortion.activate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      distortion.connect = originalConnect;
    });
  });

  describe(distortion.deactivate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = distortion.connect;

      const connectMock = jest.fn();

      distortion.connect = connectMock;

      distortion.deactivate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      distortion.connect = originalConnect;
    });
  });
});
