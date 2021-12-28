import { BufferSize } from '../src/types';
import { AnalyserNodeMock } from './AnalyserNodeMock';
import { AudioBufferMock } from './AudioBufferMock';
import { AudioBufferSourceNodeMock } from './AudioBufferSourceNodeMock';
import { AudioListenerMock } from './AudioListenerMock';
import { BiquadFilterNodeMock } from './BiquadFilterNodeMock';
import { ChannelMergerNodeMock } from './ChannelMergerNodeMock';
import { ChannelSplitterNodeMock } from './ChannelSplitterNodeMock';
import { ConvolverNodeMock } from './ConvolverNodeMock';
import { DelayNodeMock } from './DelayNodeMock';
import { DynamicsCompressorNodeMock } from './DynamicsCompressorNodeMock';
import { GainNodeMock } from './GainNodeMock';
import { MediaElementAudioSourceNodeMock } from './MediaElementAudioSourceNodeMock';
import { OscillatorNodeMock } from './OscillatorNodeMock';
import { PannerNodeMock } from './PannerNodeMock';
import { ScriptProcessorNodeMock } from './ScriptProcessorNodeMock';
import { StereoPannerNodeMock } from './StereoPannerNodeMock';
import { WaveShaperNodeMock } from './WaveShaperNodeMock';

export class AudioContextMock {
  audioWorklet = {
    addModule: () => new Promise(() => {})
  } as AudioWorklet;

  currentTime = performance.now();
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
    return new AudioBufferSourceNodeMock(this.createBuffer(2));
  }

  createChannelMerger() {
    return new ChannelMergerNodeMock();
  }

  createChannelSplitter() {
    return new ChannelSplitterNodeMock();
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
    return new MediaElementAudioSourceNodeMock(document.createElement('audio'));
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

  createScriptProcessor(bufferSize: BufferSize) {
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
