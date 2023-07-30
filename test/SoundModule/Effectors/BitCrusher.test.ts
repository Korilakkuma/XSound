import { AudioContextMock } from '/mock/AudioContextMock';
import { BitCrusher, BitCrusherParams } from '/src/SoundModule/Effectors/BitCrusher';

describe(BitCrusher.name, () => {
  const context = new AudioContextMock();

  // @ts-ignore
  const bitcrusher = new BitCrusher(context);

  describe(bitcrusher.start.name, () => {
    test('should call `ConstantSourceNode` start', () => {
      // eslint-disable-next-line dot-notation
      const originalBitsInput = bitcrusher['bitsInput'];

      const bitsInputStartMock = jest.fn();

      // eslint-disable-next-line dot-notation
      bitcrusher['bitsInput'].start = bitsInputStartMock;

      bitcrusher.start();

      expect(bitsInputStartMock).toHaveBeenCalledTimes(0);

      bitcrusher.activate();
      bitcrusher.start();

      expect(bitsInputStartMock).toHaveBeenCalledTimes(1);

      // eslint-disable-next-line dot-notation
      bitcrusher['bitsInput'] = originalBitsInput;

      bitcrusher.deactivate();
    });
  });

  describe(bitcrusher.stop.name, () => {
    test('should call `ConstantSourceNode` stop', () => {
      // eslint-disable-next-line dot-notation
      const originalBitsInput = bitcrusher['bitsInput'];

      const bitsInputStopMock = jest.fn();

      // eslint-disable-next-line dot-notation
      bitcrusher['bitsInput'].stop = bitsInputStopMock;

      bitcrusher.stop();

      expect(bitsInputStopMock).toHaveBeenCalledTimes(0);

      bitcrusher.activate();
      bitcrusher.stop();

      expect(bitsInputStopMock).toHaveBeenCalledTimes(1);

      // eslint-disable-next-line dot-notation
      bitcrusher['bitsInput'] = originalBitsInput;

      bitcrusher.deactivate();
    });
  });

  describe(bitcrusher.connect.name, () => {
    /* eslint-disable dot-notation */
    const originalInput        = bitcrusher['input'];
    const originalShaper       = bitcrusher['shaper'];
    const originalInputShaper  = bitcrusher['inputShaper'];
    const originalOutputShaper = bitcrusher['outputShaper'];
    const originalInputLevel   = bitcrusher['inputLevel'];
    const originalOutputLevel  = bitcrusher['outputLevel'];
    const originalBitsInput    = bitcrusher['bitsInput'];
    const originalBitsGain     = bitcrusher['bitsGain'];
    /* eslint-enable dot-notation */

    afterAll(() => {
      /* eslint-disable dot-notation */
      bitcrusher['input']        = originalInput;
      bitcrusher['shaper']       = originalShaper;
      bitcrusher['inputShaper']  = originalInputShaper;
      bitcrusher['outputShaper'] = originalOutputShaper;
      bitcrusher['inputLevel']   = originalInputLevel;
      bitcrusher['outputLevel']  = originalOutputLevel;
      bitcrusher['bitsInput']    = originalBitsInput;
      bitcrusher['bitsGain']     = originalBitsGain;
      /* eslint-enable dot-notation */

      bitcrusher.deactivate();
    });

    test('should call `connect` method', () => {
      const inputConnectMock           = jest.fn();
      const inputDisconnectMock        = jest.fn();
      const shaperConnectMock          = jest.fn();
      const shaperDisconnectMock       = jest.fn();
      const inputShaperConnectMock     = jest.fn();
      const inputShaperDisconnectMock  = jest.fn();
      const outputShaperConnectMock    = jest.fn();
      const outputShaperDisconnectMock = jest.fn();
      const inputLevelConnectMock      = jest.fn();
      const inputLevelDisconnectMock   = jest.fn();
      const outputLevelConnectMock     = jest.fn();
      const outputLevelDisconnectMock  = jest.fn();
      const bitsInputConnectMock       = jest.fn();
      const bitsInputDisconnectMock    = jest.fn();
      const bitsGainConnectMock        = jest.fn();
      const bitsGainDisconnectMock     = jest.fn();

      /* eslint-disable dot-notation */
      bitcrusher['input'].connect           = inputConnectMock;
      bitcrusher['input'].disconnect        = inputDisconnectMock;
      bitcrusher['shaper'].connect          = shaperConnectMock;
      bitcrusher['shaper'].disconnect       = shaperDisconnectMock;
      bitcrusher['inputShaper'].connect     = inputShaperConnectMock;
      bitcrusher['inputShaper'].disconnect  = inputShaperDisconnectMock;
      bitcrusher['outputShaper'].connect    = outputShaperConnectMock;
      bitcrusher['outputShaper'].disconnect = outputShaperDisconnectMock;
      bitcrusher['inputLevel'].connect      = inputLevelConnectMock;
      bitcrusher['inputLevel'].disconnect   = inputLevelDisconnectMock;
      bitcrusher['outputLevel'].connect     = outputLevelConnectMock;
      bitcrusher['outputLevel'].disconnect  = outputLevelDisconnectMock;
      bitcrusher['bitsInput'].connect       = bitsInputConnectMock;
      bitcrusher['bitsInput'].disconnect    = bitsInputDisconnectMock;
      bitcrusher['bitsGain'].connect        = bitsGainConnectMock;
      bitcrusher['bitsGain'].disconnect     = bitsGainDisconnectMock;
      /* eslint-enable dot-notation */

      bitcrusher.connect();

      expect(inputConnectMock).toHaveBeenCalledTimes(1);
      expect(shaperConnectMock).toHaveBeenCalledTimes(0);
      expect(inputShaperConnectMock).toHaveBeenCalledTimes(0);
      expect(outputShaperConnectMock).toHaveBeenCalledTimes(0);
      expect(inputLevelConnectMock).toHaveBeenCalledTimes(0);
      expect(outputLevelConnectMock).toHaveBeenCalledTimes(0);
      expect(bitsInputConnectMock).toHaveBeenCalledTimes(0);
      expect(bitsGainConnectMock).toHaveBeenCalledTimes(0);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(1);
      expect(shaperDisconnectMock).toHaveBeenCalledTimes(1);
      expect(inputShaperDisconnectMock).toHaveBeenCalledTimes(1);
      expect(outputShaperDisconnectMock).toHaveBeenCalledTimes(1);
      expect(inputLevelDisconnectMock).toHaveBeenCalledTimes(1);
      expect(outputLevelDisconnectMock).toHaveBeenCalledTimes(1);
      expect(bitsInputDisconnectMock).toHaveBeenCalledTimes(1);
      expect(bitsGainDisconnectMock).toHaveBeenCalledTimes(1);

      bitcrusher.activate();

      expect(inputConnectMock).toHaveBeenCalledTimes(2);
      expect(shaperConnectMock).toHaveBeenCalledTimes(1);
      expect(inputShaperConnectMock).toHaveBeenCalledTimes(1);
      expect(outputShaperConnectMock).toHaveBeenCalledTimes(1);
      expect(inputLevelConnectMock).toHaveBeenCalledTimes(1);
      expect(outputLevelConnectMock).toHaveBeenCalledTimes(1);
      expect(bitsInputConnectMock).toHaveBeenCalledTimes(1);
      expect(bitsGainConnectMock).toHaveBeenCalledTimes(2);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(2);
      expect(shaperDisconnectMock).toHaveBeenCalledTimes(2);
      expect(inputShaperDisconnectMock).toHaveBeenCalledTimes(2);
      expect(outputShaperDisconnectMock).toHaveBeenCalledTimes(2);
      expect(inputLevelDisconnectMock).toHaveBeenCalledTimes(2);
      expect(outputLevelDisconnectMock).toHaveBeenCalledTimes(2);
      expect(bitsInputDisconnectMock).toHaveBeenCalledTimes(2);
      expect(bitsGainDisconnectMock).toHaveBeenCalledTimes(2);
    });
  });

  describe(bitcrusher.param.name, () => {
    const defaultParams: BitCrusherParams = {
      bits: 0
    };

    const params: BitCrusherParams = {
      bits: 256
    };

    afterAll(() => {
      bitcrusher.param(defaultParams);
    });

    // Setter
    test('should return instance of `BitCrusher`', () => {
      expect(bitcrusher.param(params)).toBeInstanceOf(BitCrusher);
    });

    // Getter
    test('should return `bits`', () => {
      expect(bitcrusher.param('bits')).toBeCloseTo(256, 0);
    });
  });

  describe(bitcrusher.params.name, () => {
    test('should return parameters for bit crusher effector as associative array', () => {
      expect(bitcrusher.params()).toStrictEqual({
        state: false,
        bits : 0
      });
    });
  });

  describe(bitcrusher.activate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = bitcrusher.connect;

      const connectMock = jest.fn();

      bitcrusher.connect = connectMock;

      bitcrusher.activate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      bitcrusher.connect = originalConnect;
    });
  });

  describe(bitcrusher.deactivate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = bitcrusher.connect;

      const connectMock = jest.fn();

      bitcrusher.connect = connectMock;

      bitcrusher.deactivate();

      expect(connectMock).toHaveBeenCalledTimes(2);

      bitcrusher.connect = originalConnect;
    });
  });
});
