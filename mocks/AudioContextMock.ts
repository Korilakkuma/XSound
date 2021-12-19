import faker from 'faker';
import { ScriptProcessorNodeBufferSize } from '../src/types';
import { AnalyserNodeMock } from './AnalyserNodeMock';
import { AudioBufferMock } from './AudioBufferMock';
import { AudioListenerMock } from './AudioListenerMock';
import { BiquadFilterNodeMock } from './BiquadFilterNodeMock';
import { ConvolverNodeMock } from './ConvolverNodeMock';
import { DelayNodeMock } from './DelayNodeMock';
import { DynamicsCompressorNodeMock } from './DynamicsCompressorNodeMock';
import { GainNodeMock } from './GainNodeMock';
import { OscillatorNodeMock } from './OscillatorNodeMock';
import { PannerNodeMock } from './PannerNodeMock';
import { ScriptProcessorNodeMock } from './ScriptProcessorNodeMock';
import { StereoPannerNodeMock } from './StereoPannerNodeMock';
import { WaveShaperNodeMock } from './WaveShaperNodeMock';

export class AudioContextMock {
  activeSourceCount = faker.datatype.number({ min: 0 });
  audioWorklet = {} as AudioWorklet;
  currentTime = faker.datatype.number({ min: 0 });
  destination = {} as AudioDestinationNode;
  listener = new AudioListenerMock();
  sampleRate = 44100;
  state: AudioContextState = 'suspended';

  onstatechange = () => {};

  createAnalyser() {
    return new AnalyserNodeMock();
  }

  createBiquadFilter() {
    return new BiquadFilterNodeMock();
  }

  createBuffer(numberOfChannels: 1 | 2) {
    const data = new Float32Array([1, 0, 1]);

    switch (numberOfChannels) {
      case 1:
        return new AudioBufferMock(data);
      case 2 :
      default:
        return new AudioBufferMock(data, data);
    }
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
    const buffer = new AudioBufferMock(new Float32Array([1, 0, -1, 0]), new Float32Array([1, 0, -1, 0]));

    return new ConvolverNodeMock(buffer);
  }

  createDelay() {
    return new DelayNodeMock();
  }

  createDynamicsCompressor() {
    return new DynamicsCompressorNodeMock();
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
    return new OscillatorNodeMock();
  }

  createPanner() {
    return new PannerNodeMock();
  }

  createPeriodicWave() {
    return {} as PeriodicWave;
  }

  createScriptProcessor(bufferSize: ScriptProcessorNodeBufferSize) {
    return new ScriptProcessorNodeMock(bufferSize, 2, 2);
  }

  createStereoPanner() {
    return new StereoPannerNodeMock();
  }

  createWaveShaper() {
    return new WaveShaperNodeMock();
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
