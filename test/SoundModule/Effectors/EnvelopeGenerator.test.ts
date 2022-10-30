import { AudioContextMock } from '../../../mock/AudioContextMock';
import { GainNodeMock } from '../../../mock/GainNodeMock';
import { EnvelopeGenerator, EnvelopeGeneratorParams } from '../../../src/SoundModule/Effectors/EnvelopeGenerator';

describe(EnvelopeGenerator.name, () => {
  const context = new AudioContextMock();

  // @ts-ignore
  const envelopegenerator = new EnvelopeGenerator(context);

  describe(envelopegenerator.ready.name, () => {
    test('should call connect method', () => {
      const input  = new GainNodeMock();
      const output = new GainNodeMock();

      envelopegenerator.setGenerator(0);

      // eslint-disable-next-line dot-notation
      const generator = envelopegenerator['generators'][0];

      const originalInputConnect     = input.connect;
      const originalGeneratorConnect = generator.connect;

      const inputConnectMock     = jest.fn();
      const generatorConnectMock = jest.fn();

      input.connect     = inputConnectMock;
      generator.connect = generatorConnectMock;

      // @ts-ignore
      envelopegenerator.ready(0, input, output);

      expect(inputConnectMock).toHaveBeenCalledTimes(1);
      expect(generatorConnectMock).toHaveBeenCalledTimes(1);

      input.connect     = originalInputConnect;
      generator.connect = originalGeneratorConnect;
    });

    test('should call `connect` method (only input)', () => {
      const input = new GainNodeMock();

      envelopegenerator.setGenerator(0);

      const originalInputConnect = input.connect;
      const inputConnectMock     = jest.fn();

      input.connect = inputConnectMock;

      // @ts-ignore
      envelopegenerator.ready(0, input, null);

      expect(inputConnectMock).toHaveBeenCalledTimes(1);

      input.connect = originalInputConnect;
    });

    test('should call connect method (only generator)', () => {
      const output = new GainNodeMock();

      envelopegenerator.setGenerator(0);

      // eslint-disable-next-line dot-notation
      const generator = envelopegenerator['generators'][0];

      const originalGeneratorConnect = generator.connect;
      const generatorConnectMock     = jest.fn();

      generator.connect = generatorConnectMock;

      // @ts-ignore
      envelopegenerator.ready(0, null, output);

      expect(generatorConnectMock).toHaveBeenCalledTimes(1);

      generator.connect = originalGeneratorConnect;
    });
  });

  describe(`${envelopegenerator.start.name} and ${envelopegenerator.stop.name}`, () => {
    const input  = new GainNodeMock();
    const output = new GainNodeMock();

    envelopegenerator.setGenerator(0);

    // eslint-disable-next-line dot-notation
    const generator = envelopegenerator['generators'][0];

    // @ts-ignore
    envelopegenerator.ready(0, input, output);

    const cancelScheduledValuesMock   = jest.fn();
    const setValueAtTimeMock          = jest.fn();
    const linearRampToValueAtTimeMock = jest.fn();
    const setTargetAtTimeMock         = jest.fn();
    const setValueCurveAtTimeMock     = jest.fn();

    /* eslint-disable dot-notation */
    generator.gain.cancelScheduledValues   = cancelScheduledValuesMock;
    generator.gain.setValueAtTime          = setValueAtTimeMock;
    generator.gain.linearRampToValueAtTime = linearRampToValueAtTimeMock;
    generator.gain.setTargetAtTime         = setTargetAtTimeMock;
    generator.gain.setValueCurveAtTime     = setValueCurveAtTimeMock;
    generator.gain.cancelScheduledValues   = cancelScheduledValuesMock;
    /* eslint-enable dot-notation */

    envelopegenerator.start(0);

    afterAll(() => {
      envelopegenerator.setGenerator(0);
    });

    test('should call automation methods in instance of `AudioParam`', () => {
      envelopegenerator.stop(5);

      expect(cancelScheduledValuesMock).toHaveBeenCalledTimes(1);
      expect(setValueAtTimeMock).toHaveBeenCalledTimes(1);
      expect(linearRampToValueAtTimeMock).toHaveBeenCalledTimes(1);
      expect(setTargetAtTimeMock).toHaveBeenCalledTimes(1);
      expect(setValueCurveAtTimeMock).toHaveBeenCalledTimes(0);
    });

    xtest('should call automation methods in instance of `AudioParam` (in case of using curve)', () => {
      envelopegenerator.stop(5, true);

      expect(setValueCurveAtTimeMock).toHaveBeenCalledTimes(1);
    });
  });

  describe(envelopegenerator.param.name, () => {
    const defaultParams: EnvelopeGeneratorParams = {
      attack : 0.01,
      decay  : 0.3,
      sustain: 0.5,
      release: 1.0
    };

    const params: EnvelopeGeneratorParams = {
      attack : 0.5,
      decay  : 0.25,
      sustain: 0.25,
      release: 0.25
    };

    beforeAll(() => {
      envelopegenerator.param(params);
    });

    afterAll(() => {
      envelopegenerator.param(defaultParams);
    });

    test('should return `attack`', () => {
      expect(envelopegenerator.param('attack')).toBeCloseTo(0.5, 2);
    });

    test('should return `decay`', () => {
      expect(envelopegenerator.param('decay')).toBeCloseTo(0.25, 2);
    });

    test('should return `sustain`', () => {
      expect(envelopegenerator.param('sustain')).toBeCloseTo(0.25, 2);
    });

    test('should return `release`', () => {
      expect(envelopegenerator.param('release')).toBeCloseTo(0.25, 2);
    });
  });

  describe(`${envelopegenerator.setGenerator.name} and ${envelopegenerator.getGenerator.name}`, () => {
    test('should set generator (`GainNode`)', () => {
      envelopegenerator.setGenerator(0);
      envelopegenerator.setGenerator(1);

      expect(envelopegenerator.getGenerator(0)).toBeInstanceOf(GainNode);
      expect(envelopegenerator.getGenerator(1)).toBeInstanceOf(GainNode);
      expect(envelopegenerator.getGenerator(-1)).toBe(null);
      expect(envelopegenerator.getGenerator(2)).toBe(null);
    });
  });

  describe(envelopegenerator.paused.name, () => {
    // TODO:
  });

  describe(envelopegenerator.clear.name, () => {
    // TODO:
  });

  describe(envelopegenerator.params.name, () => {
    test('should return parameters for envelope generator as associative array', () => {
      expect(envelopegenerator.params()).toStrictEqual({
        state  : true,
        attack : 0.01,
        decay  : 0.3,
        sustain: 0.5,
        release: 1.0
      });
    });
  });

  describe(envelopegenerator.activate.name, () => {
    test('should be active', () => {
      envelopegenerator.activate();

      expect(envelopegenerator.state()).toBe(true);
    });
  });

  describe(envelopegenerator.deactivate.name, () => {
    test('should be inactive', () => {
      envelopegenerator.deactivate();

      expect(envelopegenerator.state()).toBe(false);

      // envelope generator is active by default
      envelopegenerator.activate();
    });
  });
});
