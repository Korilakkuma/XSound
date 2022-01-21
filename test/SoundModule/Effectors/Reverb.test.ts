import { AudioContextMock } from '../../../mocks/AudioContextMock';
import { AudioBufferMock } from '../../../mocks/AudioBufferMock';
import { Reverb, ReverbParams } from '../../../src/SoundModule/Effectors/Reverb';

describe(Reverb.name, () => {
  const context = new AudioContextMock();

  // @ts-ignore
  const reverb = new Reverb(context);

  describe(reverb.connect.name, () => {
    /* eslint-disable dot-notation */
    const originalInput     = reverb['input'];
    const originalConvolver = reverb['convolver'];
    const originalDry       = reverb['dry'];
    const originalWet       = reverb['wet'];
    const originalTone      = reverb['tone'];
    /* eslint-enable dot-notation */

    afterAll(() => {
      /* eslint-disable dot-notation */
      reverb['input']     = originalInput;
      reverb['convolver'] = originalConvolver;
      reverb['dry']       = originalDry;
      reverb['wet']       = originalWet;
      reverb['tone']      = originalTone;
      /* eslint-enable dot-notation */

      reverb.deactivate();
    });

    test('should call connect method', () => {
      const inputConnectMock        = jest.fn();
      const inputDisconnectMock     = jest.fn();
      const convolverConnectMock    = jest.fn();
      const convolverDisconnectMock = jest.fn();
      const dryConnectMock          = jest.fn();
      const dryDisconnectMock       = jest.fn();
      const wetConnectMock          = jest.fn();
      const wetDisconnectMock       = jest.fn();
      const toneConnectMock         = jest.fn();
      const toneDisconnectMock      = jest.fn();

      /* eslint-disable dot-notation */
      reverb['input'].connect        = inputConnectMock;
      reverb['input'].disconnect     = inputDisconnectMock;
      reverb['convolver'].connect    = convolverConnectMock;
      reverb['convolver'].disconnect = convolverDisconnectMock;
      reverb['dry'].connect          = dryConnectMock;
      reverb['dry'].disconnect       = dryDisconnectMock;
      reverb['wet'].connect          = wetConnectMock;
      reverb['wet'].disconnect       = wetDisconnectMock;
      reverb['tone'].connect         = toneConnectMock;
      reverb['tone'].disconnect      = toneDisconnectMock;
      /* eslint-enable dot-notation */

      reverb.connect();

      expect(inputConnectMock).toHaveBeenCalledTimes(1);
      expect(convolverConnectMock).toHaveBeenCalledTimes(0);
      expect(dryConnectMock).toHaveBeenCalledTimes(0);
      expect(wetConnectMock).toHaveBeenCalledTimes(0);
      expect(toneConnectMock).toHaveBeenCalledTimes(0);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(1);
      expect(convolverDisconnectMock).toHaveBeenCalledTimes(1);
      expect(dryDisconnectMock).toHaveBeenCalledTimes(1);
      expect(wetDisconnectMock).toHaveBeenCalledTimes(1);
      expect(toneDisconnectMock).toHaveBeenCalledTimes(1);

      reverb.activate();

      expect(inputConnectMock).toHaveBeenCalledTimes(3);
      expect(convolverConnectMock).toHaveBeenCalledTimes(1);
      expect(dryConnectMock).toHaveBeenCalledTimes(1);
      expect(wetConnectMock).toHaveBeenCalledTimes(1);
      expect(toneConnectMock).toHaveBeenCalledTimes(1);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(2);
      expect(convolverDisconnectMock).toHaveBeenCalledTimes(2);
      expect(dryDisconnectMock).toHaveBeenCalledTimes(2);
      expect(wetDisconnectMock).toHaveBeenCalledTimes(2);
      expect(toneDisconnectMock).toHaveBeenCalledTimes(2);
    });
  });

  describe(reverb.param.name, () => {
    const audioBuffer = new AudioBufferMock(new Float32Array([1, 0, -1, 0]));

    const defaultParams: ReverbParams = {
      buffer: null,
      dry   : 1,
      wet   : 0,
      tone  : 350
    };

    const params: ReverbParams = {
      // @ts-ignore
      buffer: audioBuffer,
      dry   : 0.5,
      wet   : 1,
      tone  : 4000
    };

    beforeAll(() => {
      reverb.param(params);
    });

    afterAll(() => {
      reverb.param(defaultParams);
    });

    test('should return `buffer`', () => {
      expect(reverb.param('buffer')).toBeInstanceOf(AudioBufferMock);
    });

    test('should return `dry`', () => {
      expect(reverb.param('dry')).toBeCloseTo(0.5, 1);
    });

    test('should return `wet`', () => {
      expect(reverb.param('wet')).toBeCloseTo(1, 1);
    });

    test('should return `tone`', () => {
      expect(reverb.param('tone')).toBeCloseTo(4000, 1);
    });
  });

  describe(reverb.add.name, () => {
    test('use `AudioBuffer`', () => {
      // @ts-ignore
      reverb.add(new AudioBufferMock(new Float32Array([1, 0, -1, 0])));

      // eslint-disable-next-line dot-notation
      expect(reverb['rirs'].length).toBe(1);

      // eslint-disable-next-line dot-notation
      reverb['rirs'].length = 0;
    });

    xtest('use `Arraybuffer`', () => {
      // TODO:
    });
  });

  describe(reverb.preset.name, () => {
    test('should call `load` method', () => {
      // eslint-disable-next-line dot-notation
      const originalLoad = reverb['load'];

      const loadMock = jest.fn();

      // eslint-disable-next-line dot-notation
      reverb['load'] = loadMock;

      reverb.preset({ rirs: ['/piano.mp3', '/guitar.mp3', '/strings.mp3'] });

      expect(loadMock).toHaveBeenCalledTimes(3);

      // eslint-disable-next-line dot-notation
      reverb['load'] = originalLoad;

      // eslint-disable-next-line dot-notation
      reverb['rirs'].length = 0;
    });

    test('should be `3`', () => {
      const buffer1 = new AudioBufferMock(new Float32Array([1, 0, -1, 0]));
      const buffer2 = new AudioBufferMock(new Float32Array([1, 0, -1, 0]));
      const buffer3 = new AudioBufferMock(new Float32Array([1, 0, -1, 0]));

      // @ts-ignore
      reverb.preset({ rirs: [buffer1, buffer2, buffer3] });

      // eslint-disable-next-line dot-notation
      expect(reverb['rirs'].length).toBe(3);

      // eslint-disable-next-line dot-notation
      reverb['rirs'].length = 0;
    });
  });

  describe(reverb.params.name, () => {
    test('should return parameters for reverb effector as associative array', () => {
      expect(reverb.params()).toStrictEqual({
        state: false,
        dry  : 1,
        wet  : 0,
        tone : 350
      });
    });
  });
});
