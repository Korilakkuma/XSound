import { AudioContextMock } from '../../../mock/AudioContextMock';
import { Analyser } from '../../../src/SoundModule/Analyser';
import { Room } from '../../../src/SoundModule/Session/Room';
import { Session, SessionParams } from '../../../src/SoundModule/Session';

describe(Session.name, () => {
  const context = new AudioContextMock();

  // @ts-ignore
  const analyser = new Analyser(context);

  // @ts-ignore
  const session = new Session(context);

  session.setup('test-room', 2048, 2, 2, analyser);

  const openCallbackMock  = jest.fn();
  const closeCallbackMock = jest.fn();
  const errorCallbackMock = jest.fn();

  const params: SessionParams = {
    tls          : true,
    host         : 'test.com',
    port         : 8080,
    path         : '/',
    openCallback : openCallbackMock,
    closeCallback: closeCallbackMock,
    errorCallback: errorCallbackMock
  };

  describe(session.ready.name, () => {
    test('should join room', () => {
      const originalJoin = Room.prototype.join;
      const joinMock     = jest.fn();

      Room.prototype.join = joinMock;

      session.ready('test-room', params);

      expect(joinMock).toHaveBeenCalledTimes(1);

      Room.prototype.join = originalJoin;
    });
  });

  describe(session.start.name, () => {
    test('should start session', () => {
      const originalSend = Room.prototype.send;
      const sendMock     = jest.fn();

      Room.prototype.send = sendMock;

      session.ready('test-room', params);
      session.start('test-room');

      expect(sendMock).toHaveBeenCalledTimes(1);

      Room.prototype.send = originalSend;
    });
  });

  describe(session.stop.name, () => {
    test('should stop session', () => {
      const originalLeave = Room.prototype.leave;
      const leaveMock     = jest.fn();

      Room.prototype.leave = leaveMock;

      session.ready('test-room', params);
      session.stop('test-room');

      expect(leaveMock).toHaveBeenCalledTimes(1);

      Room.prototype.leave = originalLeave;
    });
  });

  describe(session.clear.name, () => {
    test('should clear session', () => {
      const originalclear = Room.prototype.clear;
      const clearMock     = jest.fn();

      Room.prototype.clear = clearMock;

      session.ready('test-room', params);
      session.clear('test-room');

      expect(clearMock).toHaveBeenCalledTimes(1);

      Room.prototype.clear = originalclear;
    });
  });

  describe(session.connect.name, () => {
    test('should connect `AudioNode`', () => {
      const originalOutput = Room.prototype.OUTPUT;
      const outputMock     = jest.fn();

      Object.defineProperty(Room.prototype, 'OUTPUT', {
        configurable: true,
        writable    : true,
        value       : {
          connect: outputMock
        }
      });

      session.ready('test-room', params);
      session.connect('test-room');

      expect(outputMock).toHaveBeenCalledTimes(1);

      Object.defineProperty(Room.prototype, 'OUTPUT', {
        configurable: true,
        writable    : true,
        value       : {
          connect: originalOutput
        }
      });
    });
  });

  describe(session.connected.name, () => {
    test('should return boolean', () => {
      const originalConnected = Room.prototype.connected;
      const connectedMock     = jest.fn(() => true);

      Room.prototype.connected = connectedMock;

      session.ready('test-room', params);

      expect(session.connected('test-room')).toBe(true);
      expect(connectedMock).toHaveBeenCalledTimes(1);

      Room.prototype.connected = originalConnected;
    });
  });

  describe(session.get.name, () => {
    session.ready('test-room', params);

    test('should return `true`', () => {
      expect(session.get('test-room')).toBeInstanceOf(Room);
    });

    test('should return `null`', () => {
      expect(session.get('test-room-false')).toBe(null);
    });
  });
});
