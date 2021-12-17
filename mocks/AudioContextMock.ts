import { ScriptProcessorNodeBufferSize } from '../src/types';
import { AnalyserNodeMock } from './AnalyserNodeMock';
import { AudioBufferMock } from './AudioBufferMock';
import { BiquadFilterNodeMock } from './BiquadFilterNodeMock';
import { DelayNodeMock } from './DelayNodeMock';
import { DynamicsCompressorNodeMock } from './DynamicsCompressorNodeMock';
import { GainNodeMock } from './GainNodeMock';
import { OscillatorNodeMock } from './OscillatorNodeMock';
import { ScriptProcessorNodeMock } from './ScriptProcessorNodeMock';
import { StereoPannerNodeMock } from './StereoPannerNodeMock';
import { WaveShaperNodeMock } from './WaveShaperNodeMock';

export class AudioContextMock {
  audioWorklet = {} as AudioWorklet;
  currentTime = performance.now();
  destination = {} as AudioDestinationNode;
  listenr = {} as AudioListener;
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
    return {} as ConvolverNode;
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
    return {} as PannerNode;
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
