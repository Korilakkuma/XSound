import { AudioNodeMock } from '/mock/AudioNodeMock';

export class ChannelSplitterNodeMock extends AudioNodeMock {
}

Object.defineProperty(window, 'ChannelSplitterNode', {
  configurable: true,
  writable    : false,
  value       : ChannelSplitterNodeMock
});
