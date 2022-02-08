import { AudioNodeMock } from './AudioNodeMock';
import { MediaStreamMock } from './MediaStreamMock';

export class MediaStreamAudioSourceNodeMock extends AudioNodeMock {
  stream: MediaStreamMock;

  constructor() {
    super();

    this.stream = new MediaStreamMock();
  }
}

Object.defineProperty(window, 'MediaStreamAudioSourceNode', {
  configurable: true,
  writable    : false,
  value       : MediaStreamAudioSourceNodeMock
});
