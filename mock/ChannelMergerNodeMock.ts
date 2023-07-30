import { AudioNodeMock } from '/mock/AudioNodeMock';

export class ChannelMergerNodeMock extends AudioNodeMock {
}

Object.defineProperty(window, 'ChannelMergerNode', {
  configurable: true,
  writable    : false,
  value       : ChannelMergerNodeMock
});
