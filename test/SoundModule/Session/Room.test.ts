import { AudioContextMock } from '../../../mocks/AudioContextMock';
import { Analyser } from '../../../src/SoundModule/Analyser';
import { SessionParams } from '../../../src/SoundModule/Session';
import { Room } from '../../../src/SoundModule/Session/Room';

describe(Room.name, () => {
  const context = new AudioContextMock();

  // @ts-ignore
  const analyser = new Analyser(context);

  // @ts-ignore
  const room = new Room('test-room', context, 2048, 2, 2, analyser);

  beforeEach(() => {
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

    room.join(params);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe(room.leave.name, () => {
    test('should disconnect sender and receiver', () => {
      // eslint-disable-next-line dot-notation
      const originalSender = room['sender'];

      // eslint-disable-next-line dot-notation
      const originalReceiver = room['receiver'];

      const originalConnected = room.connected;
      const connectedMock     = jest.fn(() => true);

      room.connected = connectedMock;

      const senderDisconnectMock   = jest.fn();
      const receiverDisconnectMock = jest.fn();

      /* eslint-disable dot-notation */
      room['sender'].disconnect   = senderDisconnectMock;
      room['receiver'].disconnect = receiverDisconnectMock;
      /* eslint-enable dot-notation */

      room.leave();

      const roomMap   = room.get();
      const websocket = roomMap['test-room'];

      expect(senderDisconnectMock).toHaveBeenCalledTimes(1);
      expect(receiverDisconnectMock).toHaveBeenCalledTimes(1);
      expect(websocket).toBeInstanceOf(WebSocket);

      room.connected = originalConnected;

      /* eslint-disable dot-notation */
      room['sender']   = originalSender;
      room['receiver'] = originalReceiver;
      /* eslint-enable dot-notation */
    });
  });

  describe(room.destroy.name, () => {
    test('should destroy connection and instance of `WebSocket`', () => {
      const originalWebSocketSend = WebSocket.prototype.send;
      const webSocketSendMock     = jest.fn();

      WebSocket.prototype.send = webSocketSendMock;

      const originalConnected = room.connected;
      const connectedMock     = jest.fn(() => true);

      room.connected = connectedMock;

      room.destroy();

      const roomMap   = room.get();
      const websocket = roomMap['test-room'];

      expect(webSocketSendMock).toHaveBeenCalledTimes(1);
      expect(websocket).toBe(null);

      WebSocket.prototype.send = originalWebSocketSend;

      room.connected = originalConnected;
    });
  });

  describe(room.connect.name, () => {
    test('should connect from receiver', () => {
      // eslint-disable-next-line dot-notation
      const originalReceiver = room['receiver'];

      const connectMock = jest.fn();

      // eslint-disable-next-line dot-notation
      room['receiver'].connect = connectMock;

      room.connect();

      expect(connectMock).toHaveBeenCalledTimes(2);

      // eslint-disable-next-line dot-notation
      room['receiver'] = originalReceiver;
    });
  });

  describe(room.connected.name, () => {
    test('should return `true`', () => {
      const roomMap   = room.get();
      const websocket = roomMap['test-room'];
      const prevState = websocket?.readyState;

      Object.defineProperty(websocket, 'readyState', {
        configurable: true,
        writable    : true,
        value       : WebSocket.OPEN
      });

      expect(room.connected()).toBe(true);

      Object.defineProperty(websocket, 'readyState', {
        configurable: true,
        writable    : true,
        value       : prevState
      });
    });

    test('should return `false`', () => {
      const roomMap   = room.get();
      const websocket = roomMap['test-room'];
      const prevState = websocket?.readyState;

      Object.defineProperty(websocket, 'readyState', {
        configurable: true,
        writable    : true,
        value       : WebSocket.CLOSED
      });

      expect(room.connected()).toBe(false);

      Object.defineProperty(websocket, 'readyState', {
        configurable: true,
        writable    : true,
        value       : prevState
      });
    });
  });

  describe(room.get.name, () => {
    test('should return instance of `WebSocket`', () => {
      const roomMap = room.get();

      expect(roomMap['test-room']).toBeInstanceOf(WebSocket);
    });
  });
});
