import type { MarshallParams } from './Preamps/Marshall';
import type { MesaBoogieParams } from './Preamps/MesaBoogie';
import type { FenderParams } from './Preamps/Fender';

import { Effector } from './Effector';
import { Marshall } from './Preamps/Marshall';
import { MesaBoogie } from './Preamps/MesaBoogie';
import { Fender } from './Preamps/Fender';

export type PreampType = 'marshall' | 'mesa/boogie' | 'fender';

export type PreampCurve = Float32Array | null;

export type PreampParams = {
  state?: boolean,
  type?: PreampType,
  preamp?: MarshallParams | MesaBoogieParams | FenderParams
};

/**
 * This function creates instance of `Float32Array` for `WaveShaperNode`.
 * @param {number} level This argument is preamp effect level.
 * @param {number} numberOfSamples This argument is curve size.
 * @return {Float32Array|null} Return value is `WaveShaperNode`'s 'curve'.
 */
export function createCurve(level: number, numberOfSamples: number): PreampCurve {
  const index = Math.trunc((numberOfSamples - 1) / 2);

  const curves = new Float32Array(numberOfSamples);

  const d = (10 ** ((level / 5.0) - 1.0)) - 0.1;
  const c = (d / 5.0) + 1.0;

  let peak = 0.4;

  if (c === 1) {
    peak = 1.0;
  } else if ((c > 1) && (c < 1.04)) {
    peak = (-15.5 * c) + 16.52;
  }

  for (let i = 0; i < index; i++) {
    curves[index + i] = peak * (+1 - (c ** -i) + (i * (c ** -index)) / index);
    curves[index - i] = peak * (-1 + (c ** -i) - (i * (c ** -index)) / index);
  }

  curves[index] = 0;

  return curves;
}

/**
 * Effector's subclass for Preamplifier.
 */
export class Preamp extends Effector {
  private type: PreampType = 'marshall';
  private preamp: Marshall | MesaBoogie | Fender;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context);

    this.preamp = new Marshall(context);

    // `Preamp` is not connected by default
    this.deactivate();
  }

  /** @override */
  public override connect(): GainNode {
    this.input.disconnect(0);

    if (this.isActive) {
      // Effect ON

      // Create preamp connections
      this.preamp.connect();

      // GainNode (INPUT) -> Preamplifier -> GainNode (Output)
      this.input.connect(this.preamp.INPUT);
      this.preamp.OUTPUT.connect(this.output);
    } else {
      // Effect OFF

      // GainNode (Input) -> GainNode (Output)
      this.input.connect(this.output);
    }

    return this.output;
  }

  /**
   * This method gets or sets parameters for preamp effector.
   * This method is overloaded for type interface and type check.
   * @param {keyof PreampParams|PreampParams} params This argument is string if getter. Otherwise, setter.
   * @return {PreampParams[keyof PreampParams]|Marshall|MesaBoogie|Fender} Return value is parameter for preamp effector if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: 'state'): boolean;
  public param(params: 'type'): PreampType;
  public param(params: 'preamp'): PreampParams['preamp'];
  public param(params: PreampParams): Marshall | MesaBoogie | Fender;
  public param(params: keyof PreampParams | PreampParams): PreampParams[keyof PreampParams] | Marshall | MesaBoogie | Fender {
    if (typeof params === 'string') {
      switch (params) {
        case 'state': {
          return this.isActive;
        }

        case 'type': {
          return this.type;
        }

        case 'preamp': {
          return this.preamp.params();
        }
      }
    }

    for (const [key, value] of Object.entries(params)) {
      switch (key) {
        case 'state': {
          if (typeof value === 'boolean') {
            if (value) {
              this.activate();
              this.preamp.activate();
            } else {
              this.deactivate();
              this.preamp.deactivate();
            }
          }

          break;
        }

        case 'type': {
          if (typeof value === 'string') {
            switch (value) {
              case 'marshall': {
                this.type   = 'marshall';
                this.preamp = new Marshall(this.context);
                break;
              }

              case 'mesa/boogie': {
                this.type   = 'mesa/boogie';
                this.preamp = new MesaBoogie(this.context);
                break;
              }

              case 'fender': {
                this.type   = 'fender';
                this.preamp = new Fender(this.context);
                break;
              }
            }

            this.connect();
          }

          break;
        }

        case 'preamp': {
          if (typeof value === 'object') {
            if (this.preamp instanceof Marshall) {
              const v: MarshallParams = value;

              this.preamp.param(v);
            }

            if (this.preamp instanceof MesaBoogie) {
              const v: MesaBoogieParams = value;

              this.preamp.param(v);
            }

            if (this.preamp instanceof Fender) {
              const v: FenderParams = value;

              this.preamp.param(v);
            }
          }

          break;
        }
      }
    }

    return this.preamp;
  }

  /** @override */
  public override params(): Required<PreampParams> {
    return {
      state : this.isActive,
      type  : this.type,
      preamp: this.preamp.params()
    };
  }
}
