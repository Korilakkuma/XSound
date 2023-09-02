import { Effector } from '/src/SoundModule/Effectors/Effector';

export type Position3D = {
  x: number,
  y: number,
  z: number
};

export type PannerParams = {
  state?: boolean,
  x?: number,
  y?: number,
  z?: number,
  ox?: number,
  oy?: number,
  oz?: number,
  refDistance?: number,
  maxDistance?: number,
  rolloffFactor?: number,
  coneInnerAngle?: number,
  coneOuterAngle?: number,
  coneOuterGain?: number,
  panningModel: PanningModelType,
  distanceModel: DistanceModelType
};

/**
 * Effector's subclass for Panner.
 * @constructor
 * @extends {Effector}
 */
export class Panner extends Effector {
  private panner: PannerNode;
  private positions: Position3D;
  private orientations: Position3D;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context);

    this.panner = context.createPanner();

    this.positions    = { x: 0, y: 0, z: 0 };
    this.orientations = { x: 1, y: 0, z: 0 };

    this.panner.refDistance   = 1;
    this.panner.maxDistance   = 10000;
    this.panner.rolloffFactor = 1;

    this.panner.coneInnerAngle = 360;
    this.panner.coneOuterAngle = 360;
    this.panner.coneOuterGain  = 0;

    this.panner.panningModel  = 'HRTF';
    this.panner.distanceModel = 'inverse';

    this.panner.positionX.value = this.positions.x;
    this.panner.positionY.value = this.positions.y;
    this.panner.positionZ.value = this.positions.z;

    this.panner.orientationX.value = this.orientations.x;
    this.panner.orientationY.value = this.orientations.y;
    this.panner.orientationZ.value = this.orientations.z;

    // `Panner` is not connected by default
    this.deactivate();
  }

  /** @override */
  public override connect(): GainNode {
    // Clear connection
    this.input.disconnect(0);
    this.panner.disconnect(0);

    if (this.isActive) {
      // Effect ON

      // GainNode (Input) -> PannerNode (Pan) -> GainNode (Output)
      this.input.connect(this.panner);
      this.panner.connect(this.output);
    } else {
      // Effect OFF

      // GainNode (Input) -> GainNode (Output)
      this.input.connect(this.output);
    }

    return this.output;
  }

  /**
   * This method gets or sets parameters for panner.
   * This method is overloaded for type interface and type check.
   * @param {keyof PannerParams|PannerParams} params This argument is string if getter. Otherwise, setter.
   * @return {PannerParams[keyof PannerParams]|PannerParams} Return value is parameter for panner if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: 'state'): boolean;
  public param(params: 'x'): number;
  public param(params: 'y'): number;
  public param(params: 'z'): number;
  public param(params: 'ox'): number;
  public param(params: 'oy'): number;
  public param(params: 'oz'): number;
  public param(params: 'refDistance'): number;
  public param(params: 'maxDistance'): number;
  public param(params: 'rolloffFactor'): number;
  public param(params: 'coneInnerAngle'): number;
  public param(params: 'coneOuterAngle'): number;
  public param(params: 'coneOuterGain'): number;
  public param(params: 'panningModel'): PanningModelType;
  public param(params: 'distanceModel'): DistanceModelType;
  public param(params: PannerParams): Panner;
  public param(params: keyof PannerParams | PannerParams): PannerParams[keyof PannerParams] | Panner {
    if (typeof params === 'string') {
      switch (params) {
        case 'state': {
          return this.isActive;
        }

        case 'x': {
          return this.panner.positionX.value;
        }

        case 'y': {
          return this.panner.positionY.value;
        }

        case 'z': {
          return this.panner.positionZ.value;
        }

        case 'ox': {
          return this.panner.orientationX.value;
        }

        case 'oy': {
          return this.panner.orientationY.value;
        }

        case 'oz': {
          return this.panner.orientationZ.value;
        }

        case 'refDistance': {
          return this.panner.refDistance;
        }

        case 'maxDistance': {
          return this.panner.maxDistance;
        }

        case 'rolloffFactor': {
          return this.panner.rolloffFactor;
        }

        case 'coneInnerAngle': {
          return this.panner.coneInnerAngle;
        }

        case 'coneOuterAngle': {
          return this.panner.coneOuterAngle;
        }

        case 'coneOuterGain': {
          return this.panner.coneOuterGain;
        }

        case 'panningModel': {
          return this.panner.panningModel;
        }

        case 'distanceModel': {
          return this.panner.distanceModel;
        }

        default: {
          return this;
        }
      }
    }

    for (const [key, value] of Object.entries(params)) {
      switch (key) {
        case 'state': {
          if (typeof value === 'boolean') {
            this.isActive = value;
          }

          break;
        }

        case 'x': {
          if (typeof value === 'number') {
            this.panner.positionX.value = value;
          }

          break;
        }

        case 'y': {
          if (typeof value === 'number') {
            this.panner.positionY.value = value;
          }

          break;
        }

        case 'z': {
          if (typeof value === 'number') {
            this.panner.positionZ.value = value;
          }

          break;
        }

        case 'ox': {
          if (typeof value === 'number') {
            this.panner.orientationX.value = value;
          }

          break;
        }

        case 'oy': {
          if (typeof value === 'number') {
            this.panner.orientationY.value = value;
          }

          break;
        }

        case 'oz': {
          if (typeof value === 'number') {
            this.panner.orientationZ.value = value;
          }

          break;
        }

        case 'refDistance': {
          if (typeof value === 'number') {
            this.panner.refDistance = value;
          }

          break;
        }

        case 'maxDistance': {
          if (typeof value === 'number') {
            this.panner.maxDistance = value;
          }

          break;
        }

        case 'rolloffFactor': {
          if (typeof value === 'number') {
            this.panner.rolloffFactor = value;
          }

          break;
        }

        case 'coneInnerAngle': {
          if (typeof value === 'number') {
            this.panner.coneInnerAngle = value;
          }

          break;
        }

        case 'coneOuterAngle': {
          if (typeof value === 'number') {
            this.panner.coneOuterAngle = value;
          }

          break;
        }

        case 'coneOuterGain': {
          if (typeof value === 'number') {
            this.panner.coneOuterGain = value;
          }

          break;
        }

        case 'panningModel': {
          if ((value === 'HRTF') || (value === 'equalpower')) {
            this.panner.panningModel = value;
          }

          break;
        }

        case 'distanceModel': {
          if ((value === 'linear') || (value === 'inverse') || (value === 'exponential')) {
            this.panner.distanceModel = value;
          }

          break;
        }

        default: {
          break;
        }
      }
    }

    return this;
  }

  /** @override */
  public override params(): Required<PannerParams> {
    return {
      state         : this.isActive,
      x             : this.positions.x,
      y             : this.positions.y,
      z             : this.positions.z,
      ox            : this.orientations.x,
      oy            : this.orientations.y,
      oz            : this.orientations.z,
      refDistance   : this.panner.refDistance,
      maxDistance   : this.panner.maxDistance,
      rolloffFactor : this.panner.rolloffFactor,
      coneInnerAngle: this.panner.coneInnerAngle,
      coneOuterAngle: this.panner.coneOuterAngle,
      coneOuterGain : this.panner.coneOuterGain,
      panningModel  : this.panner.panningModel,
      distanceModel : this.panner.distanceModel
    };
  }

  /** @override */
  public override activate(): Panner {
    super.activate();
    return this;
  }

  /** @override */
  public override deactivate(): Panner {
    super.deactivate();
    return this;
  }
}
