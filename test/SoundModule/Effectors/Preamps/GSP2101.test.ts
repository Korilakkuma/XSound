import type { GSP2101Params } from '/src/SoundModule/Effectors/Preamps/GSP2101';

import { AudioContextMock } from '/mock/AudioContextMock';
import { GSP2101 } from '/src/SoundModule/Effectors/Preamps/GSP2101';

describe(GSP2101.name, () => {
  const context = new AudioContextMock();

  // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
  const gsp2101 = new GSP2101(context);

  describe(gsp2101.connect.name, () => {
    /* eslint-disable dot-notation */
    const originalInput   = gsp2101['input'];
    const originalLowCut  = gsp2101['lowCut'];
    const originalAir     = gsp2101['presence'];
    const originalHighCut = gsp2101['highCut'];
    const originalLevel   = gsp2101['level'];
    /* eslint-enable dot-notation */

    afterAll(() => {
      /* eslint-disable dot-notation */
      gsp2101['input']    = originalInput;
      gsp2101['lowCut']   = originalLowCut;
      gsp2101['presence'] = originalAir;
      gsp2101['highCut']  = originalHighCut;
      gsp2101['level']    = originalLevel;
      /* eslint-enable dot-notation */

      gsp2101.deactivate();
    });

    test('should call `connect` method', () => {
      const inputConnectMock      = jest.fn();
      const inputDisconnectMock   = jest.fn();
      const lowCutConnectMock     = jest.fn();
      const lowCutDisconnectMock  = jest.fn();
      const airConnectMock        = jest.fn();
      const airDisconnectMock     = jest.fn();
      const highCutConnectMock    = jest.fn();
      const highCutDisconnectMock = jest.fn();
      const levelConnectMock      = jest.fn();
      const levelDisconnectMock   = jest.fn();

      /* eslint-disable dot-notation */
      gsp2101['input'].connect       = inputConnectMock;
      gsp2101['input'].disconnect    = inputDisconnectMock;
      gsp2101['lowCut'].connect      = lowCutConnectMock;
      gsp2101['lowCut'].disconnect   = lowCutDisconnectMock;
      gsp2101['presence'].connect    = airConnectMock;
      gsp2101['presence'].disconnect = airDisconnectMock;
      gsp2101['highCut'].connect     = highCutConnectMock;
      gsp2101['highCut'].disconnect  = highCutDisconnectMock;
      gsp2101['level'].connect       = levelConnectMock;
      gsp2101['level'].disconnect    = levelDisconnectMock;
      /* eslint-enable dot-notation */

      gsp2101.connect();

      expect(inputConnectMock).toHaveBeenCalledTimes(1);
      expect(lowCutConnectMock).toHaveBeenCalledTimes(0);
      expect(airConnectMock).toHaveBeenCalledTimes(0);
      expect(highCutConnectMock).toHaveBeenCalledTimes(0);
      expect(levelConnectMock).toHaveBeenCalledTimes(0);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(1);
      expect(lowCutDisconnectMock).toHaveBeenCalledTimes(1);
      expect(airDisconnectMock).toHaveBeenCalledTimes(1);
      expect(highCutDisconnectMock).toHaveBeenCalledTimes(1);
      expect(levelDisconnectMock).toHaveBeenCalledTimes(1);

      gsp2101.activate();

      expect(inputConnectMock).toHaveBeenCalledTimes(2);
      expect(lowCutConnectMock).toHaveBeenCalledTimes(1);
      expect(airConnectMock).toHaveBeenCalledTimes(1);
      expect(highCutConnectMock).toHaveBeenCalledTimes(1);
      expect(levelConnectMock).toHaveBeenCalledTimes(1);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(2);
      expect(lowCutDisconnectMock).toHaveBeenCalledTimes(2);
      expect(airDisconnectMock).toHaveBeenCalledTimes(2);
      expect(highCutDisconnectMock).toHaveBeenCalledTimes(2);
      expect(levelDisconnectMock).toHaveBeenCalledTimes(2);
    });
  });

  describe(gsp2101.param.name, () => {
    const defaultParams: GSP2101Params = {
      air  : 4,
      tone : 9000,
      level: 1
    };

    const params: GSP2101Params = {
      air  : 7.5,
      tone : 3000,
      level: 0.5
    };

    beforeAll(() => {
      gsp2101.param(params);
    });

    afterAll(() => {
      gsp2101.param(defaultParams);
    });

    // Setter
    test('should return instance of `GSP2101`', () => {
      expect(gsp2101.param(params)).toBeInstanceOf(GSP2101);
    });

    // Getter
    test('should return `air`', () => {
      expect(gsp2101.param('air')).toBeCloseTo(7.5, 1);
    });

    test('should return `air`', () => {
      expect(gsp2101.param('tone')).toBe(3000);
    });

    test('should return `level`', () => {
      expect(gsp2101.param('level')).toBeCloseTo(0.5, 1);
    });
  });

  describe(gsp2101.params.name, () => {
    test('should return parameters for DigiTech GSP2101 Clean preamplifier as associative array', () => {
      expect(gsp2101.params()).toStrictEqual({
        state : false,
        air   : 4,
        tone  : 9000,
        level : 1
      });
    });
  });

  describe(gsp2101.activate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = gsp2101.connect;

      const connectMock = jest.fn();

      gsp2101.connect = connectMock;

      gsp2101.activate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      gsp2101.connect = originalConnect;
    });
  });

  describe(gsp2101.deactivate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = gsp2101.connect;

      const connectMock = jest.fn();

      gsp2101.connect = connectMock;

      gsp2101.deactivate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      gsp2101.connect = originalConnect;
    });
  });
});
