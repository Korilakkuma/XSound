import { AudioNodeMock } from '/mock/AudioNodeMock';
import { MediaStreamMock } from '/mock/MediaStreamMock';

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
