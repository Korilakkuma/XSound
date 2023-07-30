import { AudioNodeMock } from '/mock/AudioNodeMock';
import { AudioParamMock } from '/mock/AudioParamMock';

export class PannerNodeMock extends AudioNodeMock {
  positionX: AudioParamMock;
  positionY: AudioParamMock;
  positionZ: AudioParamMock;

  orientationX: AudioParamMock;
  orientationY: AudioParamMock;
  orientationZ: AudioParamMock;

  refDistance: number;
  maxDistance: number;
  rolloffFactor: number;

  coneInnerAngle: number;
  coneOuterAngle: number;
  coneOuterGain: number;

  panningModel: 'HRTF' | 'equalpower';
  distanceModel: 'linear' | 'inverse' | 'exponential';

  constructor() {
    super();

    this.positionX = new AudioParamMock(0);
    this.positionY = new AudioParamMock(0);
    this.positionZ = new AudioParamMock(0);

    this.orientationX = new AudioParamMock(1);
    this.orientationY = new AudioParamMock(0);
    this.orientationZ = new AudioParamMock(0);

    this.refDistance   = 1;
    this.maxDistance   = 10000;
    this.rolloffFactor = 1;

    this.coneInnerAngle = 360;
    this.coneOuterAngle = 360;
    this.coneOuterGain  = 0;

    this.panningModel  = 'HRTF';
    this.distanceModel = 'inverse';
  }
}

Object.defineProperty(window, 'PannerNode', {
  configurable: true,
  writable    : false,
  value       : PannerNodeMock
});
