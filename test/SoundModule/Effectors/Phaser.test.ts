import type { PhaserParams } from '/src/SoundModule/Effectors/Phaser';

import { AudioContextMock } from '/mock/AudioContextMock';
import { Phaser } from '/src/SoundModule/Effectors/Phaser';

describe(Phaser.name, () => {
  const context = new AudioContextMock();

  // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
  const phaser = new Phaser(context);

  describe(phaser.stop.name, () => {
    /* eslint-disable dot-notation */
    const originalLFO   = phaser['lfo'];
    const originalDepth = phaser['depth'];
    /* eslint-enable dot-notation */

    afterAll(() => {
      /* eslint-disable dot-notation */
      phaser['lfo']   = originalLFO;
      phaser['depth'] = originalDepth;
      /* eslint-enable dot-notation */

      phaser.deactivate();
    });

    test('should call `connect` method', () => {
      const lfoStartMock     = jest.fn();
      const lfoStopMock      = jest.fn();
      const lfoConnectMock   = jest.fn();
      const depthConnectMock = jest.fn();

      /* eslint-disable dot-notation */
      phaser['lfo'].start           = lfoStartMock;
      phaser['lfo'].stop            = lfoStopMock;
      phaser['lfo'].connect         = lfoConnectMock;
      phaser['lfo'].type            = 'sine';
      phaser['lfo'].frequency.value = 10;
      phaser['depth'].connect       = depthConnectMock;
      /* eslint-enable dot-notation */

      phaser.stop(0, 0);

      expect(lfoStartMock).toHaveBeenCalledTimes(0);
      expect(lfoStopMock).toHaveBeenCalledTimes(0);
      expect(lfoConnectMock).toHaveBeenCalledTimes(0);
      expect(depthConnectMock).toHaveBeenCalledTimes(0);

      phaser.activate();
      phaser.stop(0, 0);

      expect(lfoStartMock).toHaveBeenCalledTimes(1);
      expect(lfoStopMock).toHaveBeenCalledTimes(1);
      expect(lfoConnectMock).toHaveBeenCalledTimes(0);  // Because of new instance of `OscillatorNode`
      expect(depthConnectMock).toHaveBeenCalledTimes(24);
    });
  });

  describe(phaser.connect.name, () => {
    /* eslint-disable dot-notation */
    const originalInput      = phaser['input'];
    const originalDry        = phaser['dry'];
    const originalWet        = phaser['wet'];
    const originalConnect    = BiquadFilterNode.prototype.connect;
    const originalDisconnect = BiquadFilterNode.prototype.disconnect;
    /* eslint-enable dot-notation */

    afterAll(() => {
      /* eslint-disable dot-notation */
      phaser['input']                       = originalInput;
      phaser['dry']                         = originalDry;
      phaser['wet']                         = originalWet;
      BiquadFilterNode.prototype.connect    = originalConnect;
      BiquadFilterNode.prototype.disconnect = originalDisconnect;
      /* eslint-enable dot-notation */

      phaser.deactivate();
    });

    test('should call `connect` method', () => {
      const inputConnectMock       = jest.fn();
      const inputDisconnectMock    = jest.fn();
      const filterConnectMock      = jest.fn();
      const filterDisconnectMock   = jest.fn();
      const dryConnectMock         = jest.fn();
      const dryDisconnectMock      = jest.fn();
      const wetConnectMock         = jest.fn();
      const wetDisconnectMock      = jest.fn();

      /* eslint-disable dot-notation */
      phaser['input'].connect               = inputConnectMock;
      phaser['input'].disconnect            = inputDisconnectMock;
      phaser['dry'].connect                 = dryConnectMock;
      phaser['dry'].disconnect              = dryDisconnectMock;
      phaser['wet'].connect                 = wetConnectMock;
      phaser['wet'].disconnect              = wetDisconnectMock;
      BiquadFilterNode.prototype.connect    = filterConnectMock;
      BiquadFilterNode.prototype.disconnect = filterDisconnectMock;
      /* eslint-enable dot-notation */

      phaser.connect();

      expect(inputConnectMock).toHaveBeenCalledTimes(1);
      expect(filterConnectMock).toHaveBeenCalledTimes(0);
      expect(dryConnectMock).toHaveBeenCalledTimes(1);
      expect(wetConnectMock).toHaveBeenCalledTimes(0);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(1);
      expect(filterDisconnectMock).toHaveBeenCalledTimes(24);
      expect(dryDisconnectMock).toHaveBeenCalledTimes(1);
      expect(wetDisconnectMock).toHaveBeenCalledTimes(1);

      phaser.activate();

      expect(inputConnectMock).toHaveBeenCalledTimes(3);
      expect(filterConnectMock).toHaveBeenCalledTimes(12);
      expect(dryConnectMock).toHaveBeenCalledTimes(2);
      expect(filterDisconnectMock).toHaveBeenCalledTimes(48);
      expect(wetDisconnectMock).toHaveBeenCalledTimes(2);
    });
  });

  describe(phaser.param.name, () => {
    const defaultParams: PhaserParams = {
      stage    : 12,
      frequency: 350,
      resonance: 1,
      depth    : 0,
      rate     : 0,
      mix      : 0,
      dry      : 1,
      wet      : 0,
    };

    const params: PhaserParams = {
      stage    : 8,
      frequency: 1000,
      resonance: 10,
      depth    : 0.5,
      rate     : 0.5,
      mix      : 0.5,
      dry      : 0.5,
      wet      : 0.5
    };

    beforeAll(() => {
      phaser.param(params);
    });

    afterAll(() => {
      phaser.param(defaultParams);
    });

    // Setter
    test('should return instance of `Phaser`', () => {
      expect(phaser.param(params)).toBeInstanceOf(Phaser);
    });

    // Getter
    test('should return `stage`', () => {
      expect(phaser.param('stage')).toBe(8);
    });

    test('should return `frequency`', () => {
      expect(phaser.param('frequency')).toBeCloseTo(1000, 1);
    });

    test('should return `resonance`', () => {
      expect(phaser.param('resonance')).toBeCloseTo(10, 1);
    });

    test('should return `depth`', () => {
      expect(phaser.param('depth')).toBeCloseTo(0.5, 1);
    });

    test('should return `rate`', () => {
      expect(phaser.param('rate')).toBeCloseTo(0.5, 1);
    });

    test('should return `mix`', () => {
      expect(phaser.param('mix')).toBeCloseTo(0.5, 1);
    });

    test('should return `dry`', () => {
      expect(phaser.param('dry')).toBeCloseTo(0.5, 1);
    });

    test('should return `wet`', () => {
      expect(phaser.param('wet')).toBeCloseTo(0.5, 1);
    });
  });

  describe(phaser.params.name, () => {
    test('should return parameters for phaser effector as associative array', () => {
      expect(phaser.params()).toStrictEqual({
        state    : false,
        stage    : 12,
        frequency: 350,
        resonance: 1,
        depth    : 0,
        rate     : 0,
        mix      : 0,
        dry      : 1,
        wet      : 0
      });
    });
  });

  describe(phaser.activate.name, () => {
    test('should call `connect` method and start LFO', () => {
      const originalConnect = phaser.connect;

      // eslint-disable-next-line dot-notation
      const originalLFO = phaser['lfo'];

      const connectMock  = jest.fn();
      const lfoStartMock = jest.fn();

      phaser.connect = connectMock;

      // eslint-disable-next-line dot-notation
      phaser['lfo'].start = lfoStartMock;

      phaser.activate();

      expect(connectMock).toHaveBeenCalledTimes(1);
      expect(lfoStartMock).toHaveBeenCalledTimes(1);

      phaser.connect = originalConnect;

      // eslint-disable-next-line dot-notation
      phaser['lfo'] = originalLFO;
    });
  });

  describe(phaser.deactivate.name, () => {
    test('should call `connect` method and stop LFO', () => {
      const originalConnect = phaser.connect;

      // eslint-disable-next-line dot-notation
      const originalLFO = phaser['lfo'];

      const connectMock = jest.fn();
      const lfoStopMock = jest.fn();

      phaser.connect = connectMock;

      // eslint-disable-next-line dot-notation
      phaser['lfo'].stop = lfoStopMock;

      phaser.deactivate();

      expect(connectMock).toHaveBeenCalledTimes(1);
      expect(lfoStopMock).toHaveBeenCalledTimes(1);

      phaser.connect = originalConnect;

      // eslint-disable-next-line dot-notation
      phaser['lfo'] = originalLFO;
    });
  });
});
