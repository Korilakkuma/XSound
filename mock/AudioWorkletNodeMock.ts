import { AudioNodeMock } from './AudioNodeMock';
import { AudioParamMock } from './AudioParamMock';

export class AudioParamMapMock extends Map<string, AudioParamMock> {
}

export class AudioWorkletNodeMock extends AudioNodeMock {
  parameters: AudioParamMapMock = new AudioParamMapMock();
  port = new MessagePort();
  onprocessorerror: (event: MessageEvent) => void;

  constructor() {
    super();

    this.onprocessorerror = () => {};
  }
}

Object.defineProperty(window, 'AudioWorkletNode', {
  configurable: true,
  writable    : false,
  value       : AudioWorkletNodeMock
});
