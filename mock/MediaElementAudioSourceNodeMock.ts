import { AudioNodeMock } from '/mock/AudioNodeMock';

export class MediaElementAudioSourceNodeMock extends AudioNodeMock {
  media: HTMLAudioElement | HTMLVideoElement;

  constructor(media: HTMLAudioElement | HTMLMediaElement) {
    super();

    this.media = media;
  }
}

Object.defineProperty(window, 'MediaElementAudioSourceNode', {
  configurable: true,
  writable    : false,
  value       : MediaElementAudioSourceNodeMock
});
