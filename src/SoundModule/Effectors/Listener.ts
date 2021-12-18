import { Position3D } from '../../types';
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
    super(context, 0);

    // instance of `AudioListener`
    this.listener = context.listener;

    // Set default value
    this.positions = { 'x' : 0, 'y' : 0, 'z' : 0 };
    this.forwards  = { 'x' : 0, 'y' : 0, 'z' : -1 };
    this.ups       = { 'x' : 0, 'y' : 1, 'z' : 0 };

    // Initialize parameters
    this.listener.positionX.value = this.positions.x;
    this.listener.positionY.value = this.positions.y;
    this.listener.positionZ.value = this.positions.z;

    this.listener.forwardX.value = this.forwards.x;
    this.listener.forwardY.value = this.forwards.y;
    this.listener.forwardZ.value = this.forwards.z;

    this.listener.upX.value = this.ups.x;
    this.listener.upY.value = this.ups.y;
    this.listener.upZ.value = this.ups.z;
  }

  /**
   * This method gets or sets parameters for audio listener.
   * @param {keyof ListenerParams|ListenerParams} params This argument is string if getter. Otherwise, setter.
   * @return {ListenerParams[keyof ListenerParams]|Listener} Return value is parameter for audio listener if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: keyof ListenerParams | ListenerParams): ListenerParams[keyof ListenerParams] | Listener {
    if (typeof params === 'string') {
      switch (params) {
        case 'x':
          return this.listener.positionX.value;
        case 'y':
          return this.listener.positionY.value;
        case 'z':
          return this.listener.positionZ.value;
        case 'fx':
          return this.listener.forwardX.value;
        case 'fy':
          return this.listener.forwardY.value;
        case 'fz':
          return this.listener.forwardZ.value;
        case 'ux':
          return this.listener.upX.value;
        case 'uy':
          return this.listener.upY.value;
        case 'uz':
          return this.listener.upZ.value;
        default:
          return this;
      }
    }

    for (const [key, value] of Object.entries(params)) {
      switch (key) {
        case 'x':
          if (typeof value === 'number') {
            this.listener.positionX.value = value;
          }

          break;
        case 'y':
          if (typeof value === 'number') {
            this.listener.positionY.value = value;
          }

          break;
        case 'z':
          if (typeof value === 'number') {
            this.listener.positionZ.value = value;
          }

          break;
        case 'fx':
          if (typeof value === 'number') {
            this.listener.forwardX.value = value;
          }

          break;
        case 'fy':
          if (typeof value === 'number') {
            this.listener.forwardY.value = value;
          }

          break;
        case 'fz':
          if (typeof value === 'number') {
            this.listener.forwardZ.value = value;
          }

          break;
        case 'ux':
          if (typeof value === 'number') {
            this.listener.upX.value = value;
          }

          break;
        case 'uy':
          if (typeof value === 'number') {
            this.listener.upY.value = value;
          }

          break;
        case 'uz':
          if (typeof value === 'number') {
            this.listener.upZ.value = value;
          }

          break;
        default:
          break;
      }
    }

    return this;
  }

  /** @override */
  public params(): ListenerParams {
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

  /** @override */
  public toString(): string {
    return '[SoundModule Listener]';
  }
}
