import type { PhaserParams } from '/src/SoundModule/Effectors/Phaser';

import { AudioContextMock } from '/mock/AudioContextMock';
import { Phaser } from '/src/SoundModule/Effectors/Phaser';

describe(Phaser.name, () => {
  const context = new AudioContextMock();

  // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
  const phaser = new Phaser(context);

  describe(phaser.stop.name, () => {
    /* eslint-disable dot-notation */
    const originalLFO0   = phaser['lfos'][0];
    const originalLFO1   = phaser['lfos'][1];
    const originalDepth0 = phaser['depths'][0];
    const originalDepth1 = phaser['depths'][1];
    /* eslint-enable dot-notation */

    afterAll(() => {
      /* eslint-disable dot-notation */
      phaser['lfos'][0]   = originalLFO0;
      phaser['lfos'][1]   = originalLFO1;
      phaser['depths'][0] = originalDepth0;
      phaser['depths'][1] = originalDepth1;
      /* eslint-enable dot-notation */

      phaser.param({ type: 'standard' });

      phaser.deactivate();
    });

    test('should call `connect` method', () => {
      const lfo0StartMock     = jest.fn();
      const lfo0StopMock      = jest.fn();
      const lfo0ConnectMock   = jest.fn();
      const lfo1StartMock     = jest.fn();
      const lfo1StopMock      = jest.fn();
      const lfo1ConnectMock   = jest.fn();
      const depth0ConnectMock = jest.fn();
      const depth1ConnectMock = jest.fn();

      /* eslint-disable dot-notation */
      phaser['lfos'][0].start           = lfo0StartMock;
      phaser['lfos'][0].stop            = lfo0StopMock;
      phaser['lfos'][0].connect         = lfo0ConnectMock;
      phaser['lfos'][0].type            = 'sine';
      phaser['lfos'][0].frequency.value = 10;
      phaser['lfos'][1].start           = lfo1StartMock;
      phaser['lfos'][1].stop            = lfo1StopMock;
      phaser['lfos'][1].connect         = lfo1ConnectMock;
      phaser['lfos'][1].type            = 'sine';
      phaser['lfos'][1].frequency.value = 10;
      phaser['depths'][0].connect       = depth0ConnectMock;
      phaser['depths'][1].connect       = depth1ConnectMock;
      /* eslint-enable dot-notation */

      phaser.stop(0, 0);

      expect(lfo0StartMock).toHaveBeenCalledTimes(0);
      expect(lfo0StopMock).toHaveBeenCalledTimes(0);
      expect(lfo0ConnectMock).toHaveBeenCalledTimes(0);
      expect(lfo1StartMock).toHaveBeenCalledTimes(0);
      expect(lfo1StopMock).toHaveBeenCalledTimes(0);
      expect(lfo1ConnectMock).toHaveBeenCalledTimes(0);
      expect(depth0ConnectMock).toHaveBeenCalledTimes(0);
      expect(depth1ConnectMock).toHaveBeenCalledTimes(0);

      phaser.activate();
      phaser.stop(0, 0);

      expect(lfo0StartMock).toHaveBeenCalledTimes(1);
      expect(lfo0StopMock).toHaveBeenCalledTimes(1);
      expect(lfo0ConnectMock).toHaveBeenCalledTimes(0);  // Because of new instance of `OscillatorNode`
      expect(lfo1StartMock).toHaveBeenCalledTimes(1);
      expect(lfo1StopMock).toHaveBeenCalledTimes(1);
      expect(lfo1ConnectMock).toHaveBeenCalledTimes(0);  // Because of new instance of `OscillatorNode`
      expect(depth0ConnectMock).toHaveBeenCalledTimes(24);
      expect(depth1ConnectMock).toHaveBeenCalledTimes(24);
    });
  });

  describe(phaser.connect.name, () => {
    /* eslint-disable dot-notation */
    const originalInput      = phaser['input'];
    const originalDry        = phaser['dry'];
    const originalWet0       = phaser['wets'][0];
    const originalWet1       = phaser['wets'][1];
    const originalSplitter   = phaser['splitter'];
    const originalMerger     = phaser['merger'];
    const originalConnect    = BiquadFilterNode.prototype.connect;
    const originalDisconnect = BiquadFilterNode.prototype.disconnect;
    /* eslint-enable dot-notation */

    describe('`type` is `standard`', () => {
      beforeEach(() => {
        phaser.param({ type: 'standard', stage: 12 });
      });

      afterEach(() => {
        /* eslint-disable dot-notation */
        phaser['input']                       = originalInput;
        phaser['dry']                         = originalDry;
        phaser['wets'][0]                     = originalWet0;
        phaser['wets'][1]                     = originalWet1;
        phaser['splitter']                    = originalSplitter;
        phaser['merger']                      = originalMerger;
        BiquadFilterNode.prototype.connect    = originalConnect;
        BiquadFilterNode.prototype.disconnect = originalDisconnect;
        /* eslint-enable dot-notation */

        phaser.param({ connectionType: 'serial' });

        phaser.deactivate();
      });

      test('should call `connect` method (if connection type is `serial`)', () => {
        phaser.param({ connectionType: 'serial' });

        const inputConnectMock     = jest.fn();
        const inputDisconnectMock  = jest.fn();
        const filterConnectMock    = jest.fn();
        const filterDisconnectMock = jest.fn();
        const dryConnectMock       = jest.fn();
        const dryDisconnectMock    = jest.fn();
        const wetConnectMock       = jest.fn();
        const wetDisconnectMock    = jest.fn();

        /* eslint-disable dot-notation */
        phaser['input'].connect               = inputConnectMock;
        phaser['input'].disconnect            = inputDisconnectMock;
        phaser['dry'].connect                 = dryConnectMock;
        phaser['dry'].disconnect              = dryDisconnectMock;
        phaser['wets'][0].connect             = wetConnectMock;
        phaser['wets'][0].disconnect          = wetDisconnectMock;
        BiquadFilterNode.prototype.connect    = filterConnectMock;
        BiquadFilterNode.prototype.disconnect = filterDisconnectMock;
        /* eslint-enable dot-notation */

        phaser.connect();

        expect(inputConnectMock).toHaveBeenCalledTimes(1);
        expect(filterConnectMock).toHaveBeenCalledTimes(0);
        expect(dryConnectMock).toHaveBeenCalledTimes(0);
        expect(wetConnectMock).toHaveBeenCalledTimes(0);
        expect(inputDisconnectMock).toHaveBeenCalledTimes(1);
        expect(filterDisconnectMock).toHaveBeenCalledTimes(48);
        expect(dryDisconnectMock).toHaveBeenCalledTimes(1);
        expect(wetDisconnectMock).toHaveBeenCalledTimes(1);

        phaser.activate();

        expect(inputConnectMock).toHaveBeenCalledTimes(3);
        expect(filterConnectMock).toHaveBeenCalledTimes(12);
        expect(dryConnectMock).toHaveBeenCalledTimes(1);
        expect(wetConnectMock).toHaveBeenCalledTimes(1);
        expect(filterDisconnectMock).toHaveBeenCalledTimes(96);
        expect(wetDisconnectMock).toHaveBeenCalledTimes(2);
      });

      test('should call `connect` method (if connection type is `parallel`)', () => {
        phaser.param({ connectionType: 'parallel' });

        const inputConnectMock     = jest.fn();
        const inputDisconnectMock  = jest.fn();
        const filterConnectMock    = jest.fn();
        const filterDisconnectMock = jest.fn();
        const dryConnectMock       = jest.fn();
        const dryDisconnectMock    = jest.fn();
        const wetConnectMock       = jest.fn();
        const wetDisconnectMock    = jest.fn();

        /* eslint-disable dot-notation */
        phaser['input'].connect               = inputConnectMock;
        phaser['input'].disconnect            = inputDisconnectMock;
        phaser['dry'].connect                 = dryConnectMock;
        phaser['dry'].disconnect              = dryDisconnectMock;
        phaser['wets'][0].connect             = wetConnectMock;
        phaser['wets'][0].disconnect          = wetDisconnectMock;
        BiquadFilterNode.prototype.connect    = filterConnectMock;
        BiquadFilterNode.prototype.disconnect = filterDisconnectMock;
        /* eslint-enable dot-notation */

        phaser.connect();

        expect(inputConnectMock).toHaveBeenCalledTimes(1);
        expect(filterConnectMock).toHaveBeenCalledTimes(0);
        expect(dryConnectMock).toHaveBeenCalledTimes(0);
        expect(wetConnectMock).toHaveBeenCalledTimes(0);
        expect(inputDisconnectMock).toHaveBeenCalledTimes(1);
        expect(filterDisconnectMock).toHaveBeenCalledTimes(48);
        expect(dryDisconnectMock).toHaveBeenCalledTimes(1);
        expect(wetDisconnectMock).toHaveBeenCalledTimes(1);

        phaser.activate();

        expect(inputConnectMock).toHaveBeenCalledTimes(14);
        expect(filterConnectMock).toHaveBeenCalledTimes(12);
        expect(dryConnectMock).toHaveBeenCalledTimes(1);
        expect(wetConnectMock).toHaveBeenCalledTimes(1);
        expect(filterDisconnectMock).toHaveBeenCalledTimes(96);
        expect(wetDisconnectMock).toHaveBeenCalledTimes(2);
      });
    });

    describe('`type` is `stereo`', () => {
      beforeEach(() => {
        phaser.param({ type: 'stereo', stage: 12 });
      });

      afterEach(() => {
        /* eslint-disable dot-notation */
        phaser['input']                       = originalInput;
        phaser['dry']                         = originalDry;
        phaser['wets'][0]                     = originalWet0;
        phaser['wets'][1]                     = originalWet1;
        phaser['splitter']                    = originalSplitter;
        phaser['merger']                      = originalMerger;
        BiquadFilterNode.prototype.connect    = originalConnect;
        BiquadFilterNode.prototype.disconnect = originalDisconnect;
        /* eslint-enable dot-notation */

        phaser.param({ connectionType: 'serial' });

        phaser.deactivate();
      });

      test('should call `connect` method (if connection type is `serial`)', () => {
        const inputConnectMock       = jest.fn();
        const inputDisconnectMock    = jest.fn();
        const filterConnectMock      = jest.fn();
        const filterDisconnectMock   = jest.fn();
        const dryConnectMock         = jest.fn();
        const dryDisconnectMock      = jest.fn();
        const wet0ConnectMock        = jest.fn();
        const wet0DisconnectMock     = jest.fn();
        const wet1ConnectMock        = jest.fn();
        const wet1DisconnectMock     = jest.fn();
        const splitterConnectMock    = jest.fn();
        const splitterDisconnectMock = jest.fn();
        const mergerConnectMock      = jest.fn();
        const mergerDisconnectMock   = jest.fn();

        /* eslint-disable dot-notation */
        phaser['input'].connect               = inputConnectMock;
        phaser['input'].disconnect            = inputDisconnectMock;
        phaser['dry'].connect                 = dryConnectMock;
        phaser['dry'].disconnect              = dryDisconnectMock;
        phaser['wets'][0].connect             = wet0ConnectMock;
        phaser['wets'][0].disconnect          = wet0DisconnectMock;
        phaser['wets'][1].connect             = wet1ConnectMock;
        phaser['wets'][1].disconnect          = wet1DisconnectMock;
        phaser['splitter'].connect            = splitterConnectMock;
        phaser['splitter'].disconnect         = splitterDisconnectMock;
        phaser['merger'].connect              = mergerConnectMock;
        phaser['merger'].disconnect           = mergerDisconnectMock;
        BiquadFilterNode.prototype.connect    = filterConnectMock;
        BiquadFilterNode.prototype.disconnect = filterDisconnectMock;
        /* eslint-enable dot-notation */

        phaser.param({ connectionType: 'serial' });

        expect(inputConnectMock).toHaveBeenCalledTimes(1);
        expect(filterConnectMock).toHaveBeenCalledTimes(0);
        expect(dryConnectMock).toHaveBeenCalledTimes(0);
        expect(wet0ConnectMock).toHaveBeenCalledTimes(0);
        expect(wet1ConnectMock).toHaveBeenCalledTimes(0);
        expect(splitterConnectMock).toHaveBeenCalledTimes(0);
        expect(mergerConnectMock).toHaveBeenCalledTimes(0);
        expect(inputDisconnectMock).toHaveBeenCalledTimes(1);
        expect(filterDisconnectMock).toHaveBeenCalledTimes(48);
        expect(dryDisconnectMock).toHaveBeenCalledTimes(1);
        expect(wet0DisconnectMock).toHaveBeenCalledTimes(1);
        expect(wet1DisconnectMock).toHaveBeenCalledTimes(1);
        expect(splitterDisconnectMock).toHaveBeenCalledTimes(2);
        expect(mergerDisconnectMock).toHaveBeenCalledTimes(1);

        phaser.activate();

        expect(inputConnectMock).toHaveBeenCalledTimes(3);
        expect(filterConnectMock).toHaveBeenCalledTimes(24);
        expect(dryConnectMock).toHaveBeenCalledTimes(1);
        expect(wet0ConnectMock).toHaveBeenCalledTimes(1);
        expect(wet1ConnectMock).toHaveBeenCalledTimes(1);
        expect(splitterConnectMock).toHaveBeenCalledTimes(2);
        expect(mergerConnectMock).toHaveBeenCalledTimes(1);
        expect(filterDisconnectMock).toHaveBeenCalledTimes(96);
        expect(wet0DisconnectMock).toHaveBeenCalledTimes(2);
        expect(wet1DisconnectMock).toHaveBeenCalledTimes(2);
        expect(splitterDisconnectMock).toHaveBeenCalledTimes(4);
        expect(mergerDisconnectMock).toHaveBeenCalledTimes(2);
      });

      test('should call `connect` method (if connection type is `parallel`)', () => {
        const inputConnectMock       = jest.fn();
        const inputDisconnectMock    = jest.fn();
        const filterConnectMock      = jest.fn();
        const filterDisconnectMock   = jest.fn();
        const dryConnectMock         = jest.fn();
        const dryDisconnectMock      = jest.fn();
        const wet0ConnectMock        = jest.fn();
        const wet0DisconnectMock     = jest.fn();
        const wet1ConnectMock        = jest.fn();
        const wet1DisconnectMock     = jest.fn();
        const splitterConnectMock    = jest.fn();
        const splitterDisconnectMock = jest.fn();
        const mergerConnectMock      = jest.fn();
        const mergerDisconnectMock   = jest.fn();

        /* eslint-disable dot-notation */
        phaser['input'].connect               = inputConnectMock;
        phaser['input'].disconnect            = inputDisconnectMock;
        phaser['dry'].connect                 = dryConnectMock;
        phaser['dry'].disconnect              = dryDisconnectMock;
        phaser['wets'][0].connect             = wet0ConnectMock;
        phaser['wets'][0].disconnect          = wet0DisconnectMock;
        phaser['wets'][1].connect             = wet1ConnectMock;
        phaser['wets'][1].disconnect          = wet1DisconnectMock;
        phaser['splitter'].connect            = splitterConnectMock;
        phaser['splitter'].disconnect         = splitterDisconnectMock;
        phaser['merger'].connect              = mergerConnectMock;
        phaser['merger'].disconnect           = mergerDisconnectMock;
        BiquadFilterNode.prototype.connect    = filterConnectMock;
        BiquadFilterNode.prototype.disconnect = filterDisconnectMock;
        /* eslint-enable dot-notation */

        phaser.param({ connectionType: 'parallel' });

        expect(inputConnectMock).toHaveBeenCalledTimes(1);
        expect(filterConnectMock).toHaveBeenCalledTimes(0);
        expect(dryConnectMock).toHaveBeenCalledTimes(0);
        expect(wet0ConnectMock).toHaveBeenCalledTimes(0);
        expect(wet1ConnectMock).toHaveBeenCalledTimes(0);
        expect(splitterConnectMock).toHaveBeenCalledTimes(0);
        expect(mergerConnectMock).toHaveBeenCalledTimes(0);
        expect(inputDisconnectMock).toHaveBeenCalledTimes(1);
        expect(filterDisconnectMock).toHaveBeenCalledTimes(48);
        expect(dryDisconnectMock).toHaveBeenCalledTimes(1);
        expect(wet0DisconnectMock).toHaveBeenCalledTimes(1);
        expect(wet1DisconnectMock).toHaveBeenCalledTimes(1);
        expect(splitterDisconnectMock).toHaveBeenCalledTimes(2);
        expect(mergerDisconnectMock).toHaveBeenCalledTimes(1);

        phaser.activate();

        expect(inputConnectMock).toHaveBeenCalledTimes(3);
        expect(filterConnectMock).toHaveBeenCalledTimes(24);
        expect(dryConnectMock).toHaveBeenCalledTimes(1);
        expect(wet0ConnectMock).toHaveBeenCalledTimes(1);
        expect(wet1ConnectMock).toHaveBeenCalledTimes(1);
        expect(splitterConnectMock).toHaveBeenCalledTimes(24);
        expect(mergerConnectMock).toHaveBeenCalledTimes(1);
        expect(filterDisconnectMock).toHaveBeenCalledTimes(96);
        expect(wet0DisconnectMock).toHaveBeenCalledTimes(2);
        expect(wet1DisconnectMock).toHaveBeenCalledTimes(2);
        expect(splitterDisconnectMock).toHaveBeenCalledTimes(4);
        expect(mergerDisconnectMock).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe(phaser.param.name, () => {
    const defaultParams: PhaserParams = {
      type          : 'standard',
      stage         : 12,
      connectionType: 'serial',
      frequency     : [350, 350],
      resonance     : [1, 1],
      depth         : [0, 0],
      rate          : [0, 0],
      mix           : [0, 0],
      dry           : 1,
      wet           : [0, 0],
    };

    describe('`type` is `standard`', () => {
      const params: PhaserParams = {
        type          : 'standard',
        stage         : 8,
        connectionType: 'parallel',
        frequency     : 1000,
        resonance     : 10,
        depth         : 0.5,
        rate          : 0.5,
        mix           : 0.5,
        dry           : 0.5,
        wet           : 0.5
      };

      phaser.param(params);

      afterAll(() => {
        phaser.param(defaultParams);
      });

      // Setter
      test('should return instance of `Phaser`', () => {
        expect(phaser.param(params)).toBeInstanceOf(Phaser);
      });

      // Getter
      test('should return `type`', () => {
        expect(phaser.param('type')).toBe('standard');
      });

      test('should return `stage`', () => {
        expect(phaser.param('stage')).toBe(8);
      });

      test('should return `connectionType`', () => {
        expect(phaser.param('connectionType')).toBe('parallel');
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

    describe('`type` is `stereo`', () => {
      const params: PhaserParams = {
        type          : 'stereo',
        stage         : 8,
        connectionType: 'parallel',
        frequency     : [1000, 2000],
        resonance     : [10, 20],
        depth         : [0.50, 0.75],
        rate          : [0.25, 0.50],
        mix           : [0.25, 0.50],
        dry           : 0.5,
        wet           : [0.25, 0.50],
      };

      phaser.param(params);

      afterAll(() => {
        phaser.param(defaultParams);
      });

      // Setter
      test('should return instance of `Phaser`', () => {
        expect(phaser.param(params)).toBeInstanceOf(Phaser);
      });

      // Getter
      test('should return `type`', () => {
        expect(phaser.param('type')).toBe('stereo');
      });

      test('should return `stage`', () => {
        expect(phaser.param('stage')).toBe(8);
      });

      test('should return `connectionType`', () => {
        expect(phaser.param('connectionType')).toBe('parallel');
      });

      test('should return `frequency`', () => {
        expect(phaser.param('frequency')).toStrictEqual([1000, 2000]);
      });

      test('should return `resonance`', () => {
        expect(phaser.param('resonance')).toStrictEqual([10, 20]);
      });

      test('should return `depth`', () => {
        expect(phaser.param('depth')).toStrictEqual([0.50, 0.75]);
      });

      test('should return `rate`', () => {
        expect(phaser.param('rate')).toStrictEqual([0.25, 0.50]);
      });

      test('should return `mix`', () => {
        expect(phaser.param('mix')).toStrictEqual([0.25, 0.50]);
      });

      test('should return `dry`', () => {
        expect(phaser.param('dry')).toBeCloseTo(0.5, 1);
      });

      test('should return `wet`', () => {
        expect(phaser.param('wet')).toStrictEqual([0.25, 0.50]);
      });
    });
  });

  describe(phaser.params.name, () => {
    test('should return parameters for phaser effector as associative array (if `type` is `standard`)', () => {
      expect(phaser.params()).toStrictEqual({
        state         : false,
        type          : 'standard',
        stage         : 12,
        connectionType: 'serial',
        frequency     : 350,
        resonance     : 1,
        depth         : 0,
        rate          : 0,
        mix           : 0,
        dry           : 1,
        wet           : 0
      });
    });

    test('should return parameters for phaser effector as associative array (if `type` is `stereo`)', () => {
      phaser.param({ type: 'stereo' });

      expect(phaser.params()).toStrictEqual({
        state         : false,
        type          : 'stereo',
        stage         : 12,
        connectionType: 'serial',
        frequency     : [350, 350],
        resonance     : [1, 1],
        depth         : [0, 0],
        rate          : [0, 0],
        mix           : [0, 0],
        dry           : 1,
        wet           : [0, 0]
      });
    });
  });

  describe(phaser.activate.name, () => {
    test('should call `connect` method and start LFO', () => {
      const originalConnect = phaser.connect;

      /* eslint-disable dot-notation */
      const originalLFO0 = phaser['lfos'][0];
      const originalLFO1 = phaser['lfos'][1];
      /* eslint-enable dot-notation */

      const connectMock   = jest.fn();
      const lfo0StartMock = jest.fn();
      const lfo1StartMock = jest.fn();

      phaser.connect = connectMock;

      /* eslint-disable dot-notation */
      phaser['lfos'][0].start = lfo0StartMock;
      phaser['lfos'][1].start = lfo1StartMock;
      /* eslint-enable dot-notation */

      phaser.activate();

      expect(connectMock).toHaveBeenCalledTimes(1);
      expect(lfo0StartMock).toHaveBeenCalledTimes(1);
      expect(lfo1StartMock).toHaveBeenCalledTimes(1);

      phaser.connect = originalConnect;

      /* eslint-disable dot-notation */
      phaser['lfos'][0] = originalLFO0;
      phaser['lfos'][1] = originalLFO1;
      /* eslint-enabel dot-notation */
    });
  });

  describe(phaser.deactivate.name, () => {
    test('should call `connect` method and stop LFO', () => {
      const originalConnect = phaser.connect;

      /* eslint-disable dot-notation */
      const originalLFO0 = phaser['lfos'][0];
      const originalLFO1 = phaser['lfos'][1];
      /* eslint-enable dot-notation */

      const connectMock  = jest.fn();
      const lfo0StopMock = jest.fn();
      const lfo1StopMock = jest.fn();

      phaser.connect = connectMock;

      /* eslint-disable dot-notation */
      phaser['lfos'][0].stop = lfo0StopMock;
      phaser['lfos'][1].stop = lfo1StopMock;
      /* eslint-enabel dot-notation */

      phaser.deactivate();

      expect(connectMock).toHaveBeenCalledTimes(1);
      expect(lfo0StopMock).toHaveBeenCalledTimes(1);
      expect(lfo1StopMock).toHaveBeenCalledTimes(1);

      phaser.connect = originalConnect;

      /* eslint-disable dot-notation */
      phaser['lfos'][0] = originalLFO0;
      phaser['lfos'][1] = originalLFO1;
      /* eslint-enabel dot-notation */
    });
  });
});
