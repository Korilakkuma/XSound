import '/mock/AudioWorkletNodeMock';
import { AnalyserNodeMock } from '/mock/AnalyserNodeMock';
import { AudioBufferMock } from '/mock/AudioBufferMock';
import { AudioBufferSourceNodeMock } from '/mock/AudioBufferSourceNodeMock';
import { AudioListenerMock } from '/mock/AudioListenerMock';
import { BiquadFilterNodeMock } from '/mock/BiquadFilterNodeMock';
import { ChannelMergerNodeMock } from '/mock/ChannelMergerNodeMock';
import { ChannelSplitterNodeMock } from '/mock/ChannelSplitterNodeMock';
import { ConstantSourceNodeMock } from '/mock/ConstantSourceNodeMock';
import { ConvolverNodeMock } from '/mock/ConvolverNodeMock';
import { DelayNodeMock } from '/mock/DelayNodeMock';
import { DynamicsCompressorNodeMock } from '/mock/DynamicsCompressorNodeMock';
import { GainNodeMock } from '/mock/GainNodeMock';
import { MediaElementAudioSourceNodeMock } from '/mock/MediaElementAudioSourceNodeMock';
import { MediaStreamAudioSourceNodeMock } from '/mock/MediaStreamAudioSourceNodeMock';
import { OscillatorNodeMock } from '/mock/OscillatorNodeMock';
import { PannerNodeMock } from '/mock/PannerNodeMock';
import { StereoPannerNodeMock } from '/mock/StereoPannerNodeMock';
import { WaveShaperNodeMock } from '/mock/WaveShaperNodeMock';

export class AudioContextMock {
  audioWorklet = {
    addModule: () => new Promise((resolve) => {
      resolve();
    })
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
      case 1: {
        return new AudioBufferMock(data);
      }

      case 2:  {
        return new AudioBufferMock(data, data);
      }
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
    return new ConstantSourceNodeMock();
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
    return new MediaStreamAudioSourceNodeMock();
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
