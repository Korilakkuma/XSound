import type { DistortionParams } from '/src/SoundModule/Effectors/Distortion';

import { AudioContextMock } from '/mock/AudioContextMock';
import { Distortion } from '/src/SoundModule/Effectors/Distortion';

describe(Distortion.name, () => {
  const context = new AudioContextMock();

  // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
  const distortion = new Distortion(context);

  describe(distortion.connect.name, () => {
    /* eslint-disable dot-notation */
    const originalInput       = distortion['input'];
    const originalDrive       = distortion['drive'];
    const originalShaper      = distortion['shaper'];
    const originalLevel       = distortion['level'];
    const originalPreLowCut   = distortion['preLowCut'];
    const originalPreMiddle   = distortion['preMiddle'];
    const originalPostBass    = distortion['postBass'];
    const originalPostMiddle  = distortion['postMiddle'];
    const originalPostTreble  = distortion['postTreble'];
    const originalPostHighCut = distortion['postHighCut'];
    /* eslint-enable dot-notation */

    afterEach(() => {
      /* eslint-disable dot-notation */
      distortion['input']       = originalInput;
      distortion['drive']       = originalDrive;
      distortion['shaper']      = originalShaper;
      distortion['level']       = originalLevel;
      distortion['preLowCut']   = originalPreLowCut;
      distortion['preMiddle']   = originalPreMiddle;
      distortion['postBass']    = originalPostBass;
      distortion['postMiddle']  = originalPostMiddle;
      distortion['postTreble']  = originalPostTreble;
      distortion['postHighCut'] = originalPostHighCut;
      /* eslint-enable dot-notation */

      distortion.param({ drive: 0 });

      distortion.deactivate();
    });

    test('should call `connect` method (if `type` is `distortion`)', () => {
      const inputConnectMock          = jest.fn();
      const inputDisconnectMock       = jest.fn();
      const driveConnectMock          = jest.fn();
      const driveDisconnectMock       = jest.fn();
      const shaperConnectMock         = jest.fn();
      const shaperDisconnectMock      = jest.fn();
      const levelConnectMock          = jest.fn();
      const levelDisconnectMock       = jest.fn();
      const preLowCutConnectMock      = jest.fn();
      const preLowCutDisconnectMock   = jest.fn();
      const postMiddleConnectMock     = jest.fn();
      const postMiddleDisconnectMock  = jest.fn();
      const postHighCutConnectMock    = jest.fn();
      const postHighCutDisconnectMock = jest.fn();

      /* eslint-disable dot-notation */
      distortion['input'].connect          = inputConnectMock;
      distortion['input'].disconnect       = inputDisconnectMock;
      distortion['drive'].connect          = driveConnectMock;
      distortion['drive'].disconnect       = driveDisconnectMock;
      distortion['shaper'].connect         = shaperConnectMock;
      distortion['shaper'].disconnect      = shaperDisconnectMock;
      distortion['level'].connect          = levelConnectMock;
      distortion['level'].disconnect       = levelDisconnectMock;
      distortion['preLowCut'].connect      = preLowCutConnectMock;
      distortion['preLowCut'].disconnect   = preLowCutDisconnectMock;;
      distortion['postMiddle'].connect     = postMiddleConnectMock;
      distortion['postMiddle'].disconnect  = postMiddleDisconnectMock;;
      distortion['postHighCut'].connect    = postHighCutConnectMock;
      distortion['postHighCut'].disconnect = postHighCutDisconnectMock;
      /* eslint-enable dot-notation */

      distortion.param({ type: 'distortion' });

      expect(inputConnectMock).toHaveBeenCalledTimes(1);
      expect(driveConnectMock).toHaveBeenCalledTimes(0);
      expect(shaperConnectMock).toHaveBeenCalledTimes(0);
      expect(levelConnectMock).toHaveBeenCalledTimes(0);
      expect(preLowCutConnectMock).toHaveBeenCalledTimes(0);
      expect(postMiddleConnectMock).toHaveBeenCalledTimes(0);
      expect(postHighCutConnectMock).toHaveBeenCalledTimes(0);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(1);
      expect(driveDisconnectMock).toHaveBeenCalledTimes(1);
      expect(shaperDisconnectMock).toHaveBeenCalledTimes(1);
      expect(levelDisconnectMock).toHaveBeenCalledTimes(1);
      expect(preLowCutDisconnectMock).toHaveBeenCalledTimes(1);
      expect(postMiddleDisconnectMock).toHaveBeenCalledTimes(1);
      expect(postHighCutDisconnectMock).toHaveBeenCalledTimes(1);

      distortion.activate();

      expect(inputConnectMock).toHaveBeenCalledTimes(2);
      expect(driveConnectMock).toHaveBeenCalledTimes(0);
      expect(shaperConnectMock).toHaveBeenCalledTimes(0);
      expect(levelConnectMock).toHaveBeenCalledTimes(0);
      expect(preLowCutConnectMock).toHaveBeenCalledTimes(0);
      expect(postMiddleConnectMock).toHaveBeenCalledTimes(0);
      expect(postHighCutConnectMock).toHaveBeenCalledTimes(0);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(2);
      expect(driveDisconnectMock).toHaveBeenCalledTimes(2);
      expect(shaperDisconnectMock).toHaveBeenCalledTimes(2);
      expect(levelDisconnectMock).toHaveBeenCalledTimes(2);
      expect(preLowCutDisconnectMock).toHaveBeenCalledTimes(2);
      expect(postMiddleDisconnectMock).toHaveBeenCalledTimes(2);
      expect(postHighCutDisconnectMock).toHaveBeenCalledTimes(2);

      distortion.param({ drive: 1 });

      expect(inputConnectMock).toHaveBeenCalledTimes(3);
      expect(driveConnectMock).toHaveBeenCalledTimes(1);
      expect(shaperConnectMock).toHaveBeenCalledTimes(1);
      expect(levelConnectMock).toHaveBeenCalledTimes(1);
      expect(preLowCutConnectMock).toHaveBeenCalledTimes(1);
      expect(postMiddleConnectMock).toHaveBeenCalledTimes(1);
      expect(postHighCutConnectMock).toHaveBeenCalledTimes(1);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(3);
      expect(driveDisconnectMock).toHaveBeenCalledTimes(3);
      expect(shaperDisconnectMock).toHaveBeenCalledTimes(3);
      expect(levelDisconnectMock).toHaveBeenCalledTimes(3);
      expect(preLowCutDisconnectMock).toHaveBeenCalledTimes(3);
      expect(postMiddleDisconnectMock).toHaveBeenCalledTimes(3);
      expect(postHighCutDisconnectMock).toHaveBeenCalledTimes(3);
    });

    test('should call `connect` method (if `type` is `metal`)', () => {
      const inputConnectMock          = jest.fn();
      const inputDisconnectMock       = jest.fn();
      const driveConnectMock          = jest.fn();
      const driveDisconnectMock       = jest.fn();
      const shaperConnectMock         = jest.fn();
      const shaperDisconnectMock      = jest.fn();
      const levelConnectMock          = jest.fn();
      const levelDisconnectMock       = jest.fn();
      const preLowCutConnectMock      = jest.fn();
      const preLowCutDisconnectMock   = jest.fn();
      const preMiddleConnectMock      = jest.fn();
      const preMiddleDisconnectMock   = jest.fn();
      const postBassConnectMock       = jest.fn();
      const postBassDisconnectMock    = jest.fn();
      const postMiddleConnectMock     = jest.fn();
      const postMiddleDisconnectMock  = jest.fn();
      const postTrebleConnectMock     = jest.fn();
      const postTrebleDisconnectMock  = jest.fn();
      const postHighCutConnectMock    = jest.fn();
      const postHighCutDisconnectMock = jest.fn();

      /* eslint-disable dot-notation */
      distortion['input'].connect          = inputConnectMock;
      distortion['input'].disconnect       = inputDisconnectMock;
      distortion['drive'].connect          = driveConnectMock;
      distortion['drive'].disconnect       = driveDisconnectMock;
      distortion['shaper'].connect         = shaperConnectMock;
      distortion['shaper'].disconnect      = shaperDisconnectMock;
      distortion['level'].connect          = levelConnectMock;
      distortion['level'].disconnect       = levelDisconnectMock;
      distortion['preLowCut'].connect      = preLowCutConnectMock;
      distortion['preLowCut'].disconnect   = preLowCutDisconnectMock;;
      distortion['preMiddle'].connect      = preMiddleConnectMock;
      distortion['preMiddle'].disconnect   = preMiddleDisconnectMock;;
      distortion['postBass'].connect       = postBassConnectMock;
      distortion['postBass'].disconnect    = postBassDisconnectMock;;
      distortion['postMiddle'].connect     = postMiddleConnectMock;
      distortion['postMiddle'].disconnect  = postMiddleDisconnectMock;;
      distortion['postTreble'].connect     = postTrebleConnectMock;
      distortion['postTreble'].disconnect  = postTrebleDisconnectMock;;
      distortion['postHighCut'].connect    = postHighCutConnectMock;
      distortion['postHighCut'].disconnect = postHighCutDisconnectMock;
      /* eslint-enable dot-notation */

      distortion.param({ type: 'metal' });

      expect(inputConnectMock).toHaveBeenCalledTimes(1);
      expect(driveConnectMock).toHaveBeenCalledTimes(0);
      expect(shaperConnectMock).toHaveBeenCalledTimes(0);
      expect(levelConnectMock).toHaveBeenCalledTimes(0);
      expect(preLowCutConnectMock).toHaveBeenCalledTimes(0);
      expect(preMiddleConnectMock).toHaveBeenCalledTimes(0);
      expect(postBassConnectMock).toHaveBeenCalledTimes(0);
      expect(postMiddleConnectMock).toHaveBeenCalledTimes(0);
      expect(postTrebleConnectMock).toHaveBeenCalledTimes(0);
      expect(postHighCutConnectMock).toHaveBeenCalledTimes(0);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(1);
      expect(driveDisconnectMock).toHaveBeenCalledTimes(1);
      expect(shaperDisconnectMock).toHaveBeenCalledTimes(1);
      expect(levelDisconnectMock).toHaveBeenCalledTimes(1);
      expect(preLowCutDisconnectMock).toHaveBeenCalledTimes(1);
      expect(preMiddleDisconnectMock).toHaveBeenCalledTimes(1);
      expect(postBassDisconnectMock).toHaveBeenCalledTimes(1);
      expect(postMiddleDisconnectMock).toHaveBeenCalledTimes(1);
      expect(postTrebleDisconnectMock).toHaveBeenCalledTimes(1);
      expect(postHighCutDisconnectMock).toHaveBeenCalledTimes(1);

      distortion.activate();

      expect(inputConnectMock).toHaveBeenCalledTimes(2);
      expect(driveConnectMock).toHaveBeenCalledTimes(0);
      expect(shaperConnectMock).toHaveBeenCalledTimes(0);
      expect(levelConnectMock).toHaveBeenCalledTimes(0);
      expect(preLowCutConnectMock).toHaveBeenCalledTimes(0);
      expect(preMiddleConnectMock).toHaveBeenCalledTimes(0);
      expect(postBassConnectMock).toHaveBeenCalledTimes(0);
      expect(postMiddleConnectMock).toHaveBeenCalledTimes(0);
      expect(postTrebleConnectMock).toHaveBeenCalledTimes(0);
      expect(postHighCutConnectMock).toHaveBeenCalledTimes(0);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(2);
      expect(driveDisconnectMock).toHaveBeenCalledTimes(2);
      expect(shaperDisconnectMock).toHaveBeenCalledTimes(2);
      expect(levelDisconnectMock).toHaveBeenCalledTimes(2);
      expect(preLowCutDisconnectMock).toHaveBeenCalledTimes(2);
      expect(preMiddleDisconnectMock).toHaveBeenCalledTimes(2);
      expect(postBassDisconnectMock).toHaveBeenCalledTimes(2);
      expect(postMiddleDisconnectMock).toHaveBeenCalledTimes(2);
      expect(postTrebleDisconnectMock).toHaveBeenCalledTimes(2);
      expect(postHighCutDisconnectMock).toHaveBeenCalledTimes(2);

      distortion.param({ drive: 1 });

      expect(inputConnectMock).toHaveBeenCalledTimes(3);
      expect(driveConnectMock).toHaveBeenCalledTimes(1);
      expect(shaperConnectMock).toHaveBeenCalledTimes(1);
      expect(levelConnectMock).toHaveBeenCalledTimes(1);
      expect(preLowCutConnectMock).toHaveBeenCalledTimes(1);
      expect(preMiddleConnectMock).toHaveBeenCalledTimes(1);
      expect(postBassConnectMock).toHaveBeenCalledTimes(1);
      expect(postMiddleConnectMock).toHaveBeenCalledTimes(1);
      expect(postTrebleConnectMock).toHaveBeenCalledTimes(1);
      expect(postHighCutConnectMock).toHaveBeenCalledTimes(1);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(3);
      expect(driveDisconnectMock).toHaveBeenCalledTimes(3);
      expect(shaperDisconnectMock).toHaveBeenCalledTimes(3);
      expect(levelDisconnectMock).toHaveBeenCalledTimes(3);
      expect(preLowCutDisconnectMock).toHaveBeenCalledTimes(3);
      expect(preMiddleDisconnectMock).toHaveBeenCalledTimes(3);
      expect(postBassDisconnectMock).toHaveBeenCalledTimes(3);
      expect(postMiddleDisconnectMock).toHaveBeenCalledTimes(3);
      expect(postTrebleDisconnectMock).toHaveBeenCalledTimes(3);
      expect(postHighCutDisconnectMock).toHaveBeenCalledTimes(3);
    });

    test('should call `connect` method (if `type` is `core`)', () => {
      const inputConnectMock          = jest.fn();
      const inputDisconnectMock       = jest.fn();
      const driveConnectMock          = jest.fn();
      const driveDisconnectMock       = jest.fn();
      const shaperConnectMock         = jest.fn();
      const shaperDisconnectMock      = jest.fn();
      const levelConnectMock          = jest.fn();
      const levelDisconnectMock       = jest.fn();
      const preLowCutConnectMock      = jest.fn();
      const preLowCutDisconnectMock   = jest.fn();
      const preMiddleConnectMock      = jest.fn();
      const preMiddleDisconnectMock   = jest.fn();
      const postBassConnectMock       = jest.fn();
      const postBassDisconnectMock    = jest.fn();
      const postMiddleConnectMock     = jest.fn();
      const postMiddleDisconnectMock  = jest.fn();
      const postTrebleConnectMock     = jest.fn();
      const postTrebleDisconnectMock  = jest.fn();
      const postHighCutConnectMock    = jest.fn();
      const postHighCutDisconnectMock = jest.fn();

      /* eslint-disable dot-notation */
      distortion['input'].connect          = inputConnectMock;
      distortion['input'].disconnect       = inputDisconnectMock;
      distortion['drive'].connect          = driveConnectMock;
      distortion['drive'].disconnect       = driveDisconnectMock;
      distortion['shaper'].connect         = shaperConnectMock;
      distortion['shaper'].disconnect      = shaperDisconnectMock;
      distortion['level'].connect          = levelConnectMock;
      distortion['level'].disconnect       = levelDisconnectMock;
      distortion['preLowCut'].connect      = preLowCutConnectMock;
      distortion['preLowCut'].disconnect   = preLowCutDisconnectMock;;
      distortion['preMiddle'].connect      = preMiddleConnectMock;
      distortion['preMiddle'].disconnect   = preMiddleDisconnectMock;;
      distortion['postBass'].connect       = postBassConnectMock;
      distortion['postBass'].disconnect    = postBassDisconnectMock;;
      distortion['postMiddle'].connect     = postMiddleConnectMock;
      distortion['postMiddle'].disconnect  = postMiddleDisconnectMock;;
      distortion['postTreble'].connect     = postTrebleConnectMock;
      distortion['postTreble'].disconnect  = postTrebleDisconnectMock;;
      distortion['postHighCut'].connect    = postHighCutConnectMock;
      distortion['postHighCut'].disconnect = postHighCutDisconnectMock;
      /* eslint-enable dot-notation */

      distortion.param({ type: 'core' });

      expect(inputConnectMock).toHaveBeenCalledTimes(1);
      expect(driveConnectMock).toHaveBeenCalledTimes(0);
      expect(shaperConnectMock).toHaveBeenCalledTimes(0);
      expect(levelConnectMock).toHaveBeenCalledTimes(0);
      expect(preLowCutConnectMock).toHaveBeenCalledTimes(0);
      expect(preMiddleConnectMock).toHaveBeenCalledTimes(0);
      expect(postBassConnectMock).toHaveBeenCalledTimes(0);
      expect(postMiddleConnectMock).toHaveBeenCalledTimes(0);
      expect(postTrebleConnectMock).toHaveBeenCalledTimes(0);
      expect(postHighCutConnectMock).toHaveBeenCalledTimes(0);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(1);
      expect(driveDisconnectMock).toHaveBeenCalledTimes(1);
      expect(shaperDisconnectMock).toHaveBeenCalledTimes(1);
      expect(levelDisconnectMock).toHaveBeenCalledTimes(1);
      expect(preLowCutDisconnectMock).toHaveBeenCalledTimes(1);
      expect(preMiddleDisconnectMock).toHaveBeenCalledTimes(1);
      expect(postBassDisconnectMock).toHaveBeenCalledTimes(1);
      expect(postMiddleDisconnectMock).toHaveBeenCalledTimes(1);
      expect(postTrebleDisconnectMock).toHaveBeenCalledTimes(1);
      expect(postHighCutDisconnectMock).toHaveBeenCalledTimes(1);

      distortion.activate();

      expect(inputConnectMock).toHaveBeenCalledTimes(2);
      expect(driveConnectMock).toHaveBeenCalledTimes(0);
      expect(shaperConnectMock).toHaveBeenCalledTimes(0);
      expect(levelConnectMock).toHaveBeenCalledTimes(0);
      expect(preLowCutConnectMock).toHaveBeenCalledTimes(0);
      expect(preMiddleConnectMock).toHaveBeenCalledTimes(0);
      expect(postBassConnectMock).toHaveBeenCalledTimes(0);
      expect(postMiddleConnectMock).toHaveBeenCalledTimes(0);
      expect(postTrebleConnectMock).toHaveBeenCalledTimes(0);
      expect(postHighCutConnectMock).toHaveBeenCalledTimes(0);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(2);
      expect(driveDisconnectMock).toHaveBeenCalledTimes(2);
      expect(shaperDisconnectMock).toHaveBeenCalledTimes(2);
      expect(levelDisconnectMock).toHaveBeenCalledTimes(2);
      expect(preLowCutDisconnectMock).toHaveBeenCalledTimes(2);
      expect(preMiddleDisconnectMock).toHaveBeenCalledTimes(2);
      expect(postBassDisconnectMock).toHaveBeenCalledTimes(2);
      expect(postMiddleDisconnectMock).toHaveBeenCalledTimes(2);
      expect(postTrebleDisconnectMock).toHaveBeenCalledTimes(2);
      expect(postHighCutDisconnectMock).toHaveBeenCalledTimes(2);

      distortion.param({ drive: 1 });

      expect(inputConnectMock).toHaveBeenCalledTimes(3);
      expect(driveConnectMock).toHaveBeenCalledTimes(1);
      expect(shaperConnectMock).toHaveBeenCalledTimes(1);
      expect(levelConnectMock).toHaveBeenCalledTimes(1);
      expect(preLowCutConnectMock).toHaveBeenCalledTimes(1);
      expect(preMiddleConnectMock).toHaveBeenCalledTimes(1);
      expect(postBassConnectMock).toHaveBeenCalledTimes(1);
      expect(postMiddleConnectMock).toHaveBeenCalledTimes(1);
      expect(postTrebleConnectMock).toHaveBeenCalledTimes(1);
      expect(postHighCutConnectMock).toHaveBeenCalledTimes(1);
      expect(inputDisconnectMock).toHaveBeenCalledTimes(3);
      expect(driveDisconnectMock).toHaveBeenCalledTimes(3);
      expect(shaperDisconnectMock).toHaveBeenCalledTimes(3);
      expect(levelDisconnectMock).toHaveBeenCalledTimes(3);
      expect(preLowCutDisconnectMock).toHaveBeenCalledTimes(3);
      expect(preMiddleDisconnectMock).toHaveBeenCalledTimes(3);
      expect(postBassDisconnectMock).toHaveBeenCalledTimes(3);
      expect(postMiddleDisconnectMock).toHaveBeenCalledTimes(3);
      expect(postTrebleDisconnectMock).toHaveBeenCalledTimes(3);
      expect(postHighCutDisconnectMock).toHaveBeenCalledTimes(3);
    });
  });

  describe(distortion.param.name, () => {
    const defaultParams: DistortionParams = {
      type      : 'distortion',
      drive     : 0,
      level     : 1,
      oversample: '4x',
      bass      : 0,
      middle    : 0,
      treble    : 0,
    };

    const params: DistortionParams = {
      type      : 'metal',
      drive     : 0.5,
      level     : 0.5,
      oversample: 'none',
      bass      : 8,
      middle    : -12,
      treble    : 4,
    };

    afterAll(() => {
      distortion.param(defaultParams);
    });

    // Setter
    test('should return instance of `Distortion`', () => {
      expect(distortion.param(params)).toBeInstanceOf(Distortion);
    });

    // Getter
    test('should return `type`', () => {
      expect(distortion.param('type')).toBe('metal');
    });

    test('should return `drive`', () => {
      expect(distortion.param('drive')).toBeCloseTo(0.5, 1);
    });

    test('should return `level`', () => {
      expect(distortion.param('level')).toBeCloseTo(0.5, 1);
    });

    test('should return `oversample`', () => {
      expect(distortion.param('oversample')).toBe('none');
    });

    test('should return `bass`', () => {
      expect(distortion.param('bass')).toBe(8);
    });

    test('should return `middle`', () => {
      expect(distortion.param('middle')).toBe(-12);
    });

    test('should return `treble`', () => {
      expect(distortion.param('treble')).toBe(4);
    });
  });

  describe(distortion.params.name, () => {
    test('should return parameters for distortion effector as associative array', () => {
      expect(distortion.params()).toStrictEqual({
        state     : false,
        type      : 'distortion',
        drive     : 0,
        level     : 1,
        oversample: '4x',
        bass      : 0,
        middle    : 0,
        treble    : 0,
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
