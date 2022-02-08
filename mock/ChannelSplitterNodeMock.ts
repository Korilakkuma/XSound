import { AudioNodeMock } from './AudioNodeMock';

export class ChannelSplitterNodeMock extends AudioNodeMock {
}

Object.defineProperty(window, 'ChannelSplitterNode', {
  configurable: true,
  writable    : false,
  value       : ChannelSplitterNodeMock
});
