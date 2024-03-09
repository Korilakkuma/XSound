import type { Position3D } from './Panner';

import { Effector } from './Effector';

export type ListenerParams = {
  x?: number,
  y?: number,
  z?: number,
  fx?: number,
  fy?: number,
  fz?: number,
  ux?: number,
  uy?: number,
  uz?: number
};

/**
 * Effector's subclass for Listener.
 * @constructor
 * @extends {Effector}
 */
export class Listener extends Effector {
  private listener: AudioListener;

  private positions: Position3D;
  private forwards: Position3D;
  private ups: Position3D;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context);

    // instance of `AudioListener`
    this.listener = context.listener;

    // Set default value
    this.positions = { x: 0, y: 0, z: 0 };
    this.forwards  = { x: 0, y: 0, z: -1 };
    this.ups       = { x: 0, y: 1, z: 0 };

    // Initialize parameters
    this.listener.setPosition(this.positions.x, this.positions.y, this.positions.z);
    this.listener.setOrientation(this.forwards.x, this.forwards.y, this.forwards.z, this.ups.x, this.ups.y, this.ups.z);

    // Firefox does not support parameters as `AudioParam`
    // this.listener.positionX.value = this.positions.x;
    // this.listener.positionY.value = this.positions.y;
    // this.listener.positionZ.value = this.positions.z;

    // this.listener.forwardX.value = this.forwards.x;
    // this.listener.forwardY.value = this.forwards.y;
    // this.listener.forwardZ.value = this.forwards.z;

    // this.listener.upX.value = this.ups.x;
    // this.listener.upY.value = this.ups.y;
    // this.listener.upZ.value = this.ups.z;
  }

  /** @override */
  public override connect(): GainNode {
    return this.output;
  }

  /**
   * This method gets or sets parameters for audio listener.
   * This method is overloaded for type interface and type check.
   * @param {keyof ListenerParams|ListenerParams} params This argument is string if getter. Otherwise, setter.
   * @return {ListenerParams[keyof ListenerParams]|Listener} Return value is parameter for audio listener if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: 'x'): number;
  public param(params: 'y'): number;
  public param(params: 'z'): number;
  public param(params: 'fx'): number;
  public param(params: 'fy'): number;
  public param(params: 'fz'): number;
  public param(params: 'ux'): number;
  public param(params: 'uy'): number;
  public param(params: 'uz'): number;
  public param(params: ListenerParams): Listener;
  public param(params: keyof ListenerParams | ListenerParams): ListenerParams[keyof ListenerParams] | Listener {
    if (typeof params === 'string') {
      switch (params) {
        case 'x': {
          return this.positions.x;
        }

        case 'y': {
          return this.positions.y;
        }

        case 'z': {
          return this.positions.z;
        }

        case 'fx': {
          return this.forwards.x;
        }

        case 'fy': {
          return this.forwards.y;
        }

        case 'fz': {
          return this.forwards.z;
        }

        case 'ux': {
          return this.ups.x;
        }

        case 'uy': {
          return this.ups.y;
        }

        case 'uz': {
          return this.ups.z;
        }
      }
    }

    for (const [key, value] of Object.entries(params)) {
      switch (key) {
        case 'x': {
          if (typeof value === 'number') {
            this.positions.x = value;
            this.listener.setPosition(this.positions.x, this.positions.y, this.positions.z);
          }

          break;
        }

        case 'y': {
          if (typeof value === 'number') {
            this.positions.y = value;
            this.listener.setPosition(this.positions.x, this.positions.y, this.positions.z);
          }

          break;
        }

        case 'z': {
          if (typeof value === 'number') {
            this.positions.z = value;
            this.listener.setPosition(this.positions.x, this.positions.y, this.positions.z);
          }

          break;
        }

        case 'fx': {
          if (typeof value === 'number') {
            this.forwards.x = value;
            this.listener.setOrientation(this.forwards.x, this.forwards.y, this.forwards.z, this.ups.x, this.ups.y, this.ups.z);
          }

          break;
        }

        case 'fy': {
          if (typeof value === 'number') {
            this.forwards.y = value;
            this.listener.setOrientation(this.forwards.x, this.forwards.y, this.forwards.z, this.ups.x, this.ups.y, this.ups.z);
          }

          break;
        }

        case 'fz': {
          if (typeof value === 'number') {
            this.forwards.z = value;
            this.listener.setOrientation(this.forwards.x, this.forwards.y, this.forwards.z, this.ups.x, this.ups.y, this.ups.z);
          }

          break;
        }

        case 'ux': {
          if (typeof value === 'number') {
            this.ups.x = value;
            this.listener.setOrientation(this.forwards.x, this.forwards.y, this.forwards.z, this.ups.x, this.ups.y, this.ups.z);
          }

          break;
        }

        case 'uy': {
          if (typeof value === 'number') {
            this.ups.y = value;
            this.listener.setOrientation(this.forwards.x, this.forwards.y, this.forwards.z, this.ups.x, this.ups.y, this.ups.z);
          }

          break;
        }

        case 'uz': {
          if (typeof value === 'number') {
            this.ups.z = value;
            this.listener.setOrientation(this.forwards.x, this.forwards.y, this.forwards.z, this.ups.x, this.ups.y, this.ups.z);
          }

          break;
        }
      }
    }

    return this;
  }

  /** @override */
  public override params(): Required<ListenerParams> {
    return {
      x : this.positions.x,
      y : this.positions.y,
      z : this.positions.z,
      fx: this.forwards.x,
      fy: this.forwards.y,
      fz: this.forwards.z,
      ux: this.ups.x,
      uy: this.ups.y,
      uz: this.ups.z
    };
  }
}
