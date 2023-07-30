import { AudioNodeMock } from '/mock/AudioNodeMock';
import { AudioParamMock } from '/mock/AudioParamMock';

// HACK: Error occurs if Jest uses `Map` or `MessagePort`

export class AudioParamMapMock {
  constructor(_map: [string, AudioParamMock][]) {
  }

  get(_key: string) {
    return new AudioParamMock(0);
  }
}

export class AudioWorkletNodeMock extends AudioNodeMock {
  parameters: AudioParamMapMock;
  port = {
    postMessage: () => {},
    onmessage: () => {},
    onmessageerror: () => {}
  };
  onprocessorerror: (event: MessageEvent) => void;

  constructor() {
    super();

    this.parameters = new AudioParamMapMock([['param', new AudioParamMock(0)]]);
    this.onprocessorerror = () => {};
  }
}

Object.defineProperty(window, 'AudioWorkletNode', {
  configurable: true,
  writable    : false,
  value       : AudioWorkletNodeMock
});
