import faker from 'faker';
import { ScriptProcessorNodeBufferSize } from '../src/types';
import { AnalyserNodeMock } from './AnalyserNodeMock';
import { GainNodeMock } from './GainNodeMock';
import { ScriptProcessorNodeMock } from './ScriptProcessorNodeMock';

export class AudioContextMock {
  activeSourceCount = faker.datatype.number({ min: 0 });
  audioWorklet = {} as AudioWorklet;
  currentTime = faker.datatype.number({ min: 0 });
  destination = {} as AudioDestinationNode;
  listenr = {} as AudioListener;
  sampleRate = 44100;
  state: AudioContextState = 'suspended';

  onstatechange = () => {};

  createAnalyser() {
    return new AnalyserNodeMock();
  }

  createBiquadFilter() {
    return {} as BiquadFilterNode;
  }

  createBuffer() {
    return {} as AudioBuffer;
  }

  createBufferSource() {
    return {} as AudioBufferSourceNode;
  }

  createChannelMerger() {
    return {} as ChannelMergerNode;
  }

  createChannelSplitter() {
    return {} as ChannelSplitterNode;
  }

  createConstantSource() {
    return {} as ConstantSourceNode;
  }

  createConvolver() {
    return {} as ConvolverNode;
  }

  createDelay() {
    return {} as DelayNode;
  }

  createDynamicsCompressor() {
    return {} as DynamicsCompressorNode;
  }

  createGain() {
    return new GainNodeMock();
  }

  createIIRFilter() {
    return {} as IIRFilterNode;
  }

  createMediaElementSource() {
    return {} as MediaElementAudioSourceNode;
  }

  createMediaStreamDestination() {
    return {} as MediaStreamAudioDestinationNode;
  }

  createMediaStreamSource() {
    return {} as MediaStreamAudioSourceNode;
  }

  createOscillator() {
    return {} as OscillatorNode;
  }

  createPanner() {
    return {} as PannerNode;
  }

  createPeriodicWave() {
    return {} as PeriodicWave;
  }

  createScriptProcessor(bufferSize: ScriptProcessorNodeBufferSize) {
    return new ScriptProcessorNodeMock(bufferSize, 2, 2);
  }

  createStereoPanner() {
    return {} as StereoPannerNode;
  }

  createWaveShaper() {
    return {} as WaveShaperNode;
  }

  decodeAudioData() {
    return {} as Promise<AudioBuffer>;
  }

  resume() {
    return new Promise<void>((resolve) => {
      this.state = 'running';
      resolve();
    });
  }
}

Object.defineProperty(window, 'AudioContext', {
  configurable: true,
  writable    : true,  // for fallback
  value       : AudioContextMock
});
