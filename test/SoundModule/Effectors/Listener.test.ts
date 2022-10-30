import { AudioContextMock } from '../../../mock/AudioContextMock';
import { Listener, ListenerParams } from '../../../src/SoundModule/Effectors/Listener';

describe(Listener.name, () => {
  const context = new AudioContextMock();

  // @ts-ignore
  const listener = new Listener(context);

  describe(listener.param.name, () => {
    const defaultParams: ListenerParams = {
      x : 0,
      y : 0,
      z : 0,
      fx: 0,
      fy: 0,
      fz: -1,
      ux: 0,
      uy: 1,
      uz: 0
    };

    const params: ListenerParams = {
      x : 1,
      y : 1,
      z : 1,
      fx: 1,
      fy: 1,
      fz: 1,
      ux: 1,
      uy: 0,
      uz: 1
    };

    beforeEach(() => {
      listener.param(params);
    });

    afterAll(() => {
      listener.param(defaultParams);
    });

    test('should return `positionX`', () => {
      expect(listener.param('x')).toBeCloseTo(1, 1);
    });

    test('should return `positionY`', () => {
      expect(listener.param('y')).toBeCloseTo(1, 1);
    });

    test('should return `positionZ`', () => {
      expect(listener.param('z')).toBeCloseTo(1, 1);
    });

    test('should return `forwardX`', () => {
      expect(listener.param('fx')).toBeCloseTo(1, 1);
    });

    test('should return `forwardY`', () => {
      expect(listener.param('fy')).toBeCloseTo(1, 1);
    });

    test('should return `forwardZ`', () => {
      expect(listener.param('fz')).toBeCloseTo(1, 1);
    });

    test('should return `upX`', () => {
      expect(listener.param('ux')).toBeCloseTo(1, 1);
    });

    test('should return `upY`', () => {
      expect(listener.param('uy')).toBeCloseTo(0, 1);
    });

    test('should return `upZ`', () => {
      expect(listener.param('uz')).toBeCloseTo(1, 1);
    });
  });

  describe(listener.params.name, () => {
    test('should return parameters for audio listener as associative array', () => {
      expect(listener.params()).toStrictEqual({
        x : 0,
        y : 0,
        z : 0,
        fx: 0,
        fy: 0,
        fz: -1,
        ux: 0,
        uy: 1,
        uz: 0
      });
    });
  });

  describe(listener.activate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = listener.connect;

      const connectMock = jest.fn();

      listener.connect = connectMock;

      listener.activate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      listener.connect = originalConnect;
    });
  });

  describe(listener.deactivate.name, () => {
    test('should call `connect` method', () => {
      const originalConnect = listener.connect;

      const connectMock = jest.fn();

      listener.connect = connectMock;

      listener.deactivate();

      expect(connectMock).toHaveBeenCalledTimes(1);

      listener.connect = originalConnect;
    });
  });
});
