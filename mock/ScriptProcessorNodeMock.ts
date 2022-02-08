import { BufferSize } from '../src/types';
import { AudioNodeMock } from './AudioNodeMock';

export class ScriptProcessorNodeMock extends AudioNodeMock {
  bufferSize      = 0;
  numberOfInputs  = 0;
  numberOfOutputs = 0;

  onaudioprocess = () => {};

  constructor(bufferSize: BufferSize, numberOfInputs: 1 | 2, numberOfOutputs: 1 | 2) {
    super();

    this.bufferSize      = bufferSize;
    this.numberOfInputs  = numberOfInputs;
    this.numberOfOutputs = numberOfOutputs;
  }
}

Object.defineProperty(window, 'ScriptProcessorNode', {
  configurable: true,
  writable    : false,
  value       : ScriptProcessorNodeMock
});
