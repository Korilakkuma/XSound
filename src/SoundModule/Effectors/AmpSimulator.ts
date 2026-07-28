import type { MarshallParams } from './Preamps/Marshall';
import type { MesaBoogieParams } from './Preamps/MesaBoogie';
import type { FenderParams } from './Preamps/Fender';
import type { SimpleCabinetParams } from './Cabinets/SimpleCabinet';
import type { FilterBankCabinetParams } from './Cabinets/FilterBankCabinet';

import { Effector } from './Effector';
import { Marshall } from './Preamps/Marshall';
import { MesaBoogie } from './Preamps/MesaBoogie';
import { Fender } from './Preamps/Fender';
import { SimpleCabinet } from './Cabinets/SimpleCabinet';
import { FilterBankCabinet } from './Cabinets/FilterBankCabinet';

export type PreampType = 'marshall' | 'mesa/boogie' | 'fender';

export type CabinetType = 'simple' | 'filterbank';

export type PreampCurve = Float32Array<ArrayBuffer> | null;

export type AmpSimulatorParams = {
  state?: boolean,
  type?: PreampType,  // for compatible
  preampType?: PreampType,
  cabinetType?: CabinetType,
  preamp?: MarshallParams | MesaBoogieParams | FenderParams,
  cabinet?: SimpleCabinetParams | FilterBankCabinetParams
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
 * Effector's subclass for Amp Simulator.
 */
export class AmpSimulator extends Effector {
  private preampType: PreampType   = 'marshall';
  private cabinetType: CabinetType = 'simple';

  private preamp: Marshall | MesaBoogie | Fender;
  private cabinet: SimpleCabinet | FilterBankCabinet;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context);

    this.preamp  = new Marshall(context);
    this.cabinet = new SimpleCabinet(context);

    // `AmpSimulator` is not connected by default
    this.deactivate();
  }

  /** @override */
  public override connect(): GainNode {
    this.input.disconnect(0);

    if (this.isActive) {
      // Effect ON

      // Create connections
      this.preamp.connect();
      this.cabinet.connect();

      // GainNode (INPUT) -> Preamplifier -> Cabinet -> GainNode (Output)
      this.input.connect(this.preamp.INPUT);
      this.preamp.OUTPUT.connect(this.cabinet.INPUT);
      this.cabinet.OUTPUT.connect(this.output);
    } else {
      // Effect OFF

      // GainNode (Input) -> GainNode (Output)
      this.input.connect(this.output);
    }

    return this.output;
  }

  /**
   * This method gets or sets parameters for Amp Simulator
   * This method is overloaded for type interface and type check.
   * @param {keyof AmpSimulatorParams|AmpSimulatorParams} params This argument is string if getter. Otherwise, setter.
   * @return {AmpSimulatorParams[keyof AmpSimulatorParams]|AmpSimulator} Return value is parameter for Amp Simulator if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: 'state'): boolean;
  public param(params: 'type'): PreampType;  // for compatible
  public param(params: 'preampType'): PreampType;
  public param(params: 'cabinetType'): CabinetType;
  public param(params: 'preamp'): AmpSimulatorParams['preamp'];
  public param(params: 'cabinet'): AmpSimulatorParams['cabinet'];
  public param(params: AmpSimulatorParams): AmpSimulator;
  public param(params: keyof AmpSimulatorParams | AmpSimulatorParams): AmpSimulatorParams[keyof AmpSimulatorParams] | AmpSimulator {
    if (typeof params === 'string') {
      switch (params) {
        case 'state': {
          return this.isActive;
        }

        // for compatible
        case 'type': {
          return this.preampType;
        }

        case 'preampType': {
          return this.preampType;
        }

        case 'cabinetType': {
          return this.cabinetType;
        }

        case 'preamp': {
          return this.preamp.params();
        }

        case 'cabinet': {
          return this.cabinet.params();
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
              this.cabinet.activate();
            } else {
              this.deactivate();
              this.preamp.deactivate();
              this.cabinet.deactivate();
            }
          }

          break;
        }

        // for compatible
        case 'type': {
          if (typeof value === 'string') {
            switch (value) {
              case 'marshall': {
                this.preampType = 'marshall';
                this.preamp     = new Marshall(this.context);

                break;
              }

              case 'mesa/boogie': {
                this.preampType = 'mesa/boogie';
                this.preamp     = new MesaBoogie(this.context);

                break;
              }

              case 'fender': {
                this.preampType = 'fender';
                this.preamp     = new Fender(this.context);

                break;
              }
            }

            this.connect();
          }

          break;
        }

        case 'preampType': {
          if (typeof value === 'string') {
            switch (value) {
              case 'marshall': {
                this.preampType = 'marshall';
                this.preamp     = new Marshall(this.context);

                break;
              }

              case 'mesa/boogie': {
                this.preampType = 'mesa/boogie';
                this.preamp     = new MesaBoogie(this.context);

                break;
              }

              case 'fender': {
                this.preampType = 'fender';
                this.preamp     = new Fender(this.context);

                break;
              }
            }

            this.connect();
          }

          break;
        }

        case 'cabinetType': {
          if (typeof value === 'string') {
            switch (value) {
              case 'simple': {
                this.cabinetType = 'simple';
                this.cabinet     = new SimpleCabinet(this.context);

                break;
              }

              case 'filterbank': {
                this.cabinetType = 'filterbank';
                this.cabinet     = new FilterBankCabinet(this.context);

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

        case 'cabinet': {
          if (typeof value === 'object') {
            if (this.cabinet instanceof SimpleCabinet) {
              const v: SimpleCabinetParams = value;

              this.cabinet.param(v);
            }

            if (this.cabinet instanceof FilterBankCabinet) {
              const v: FilterBankCabinetParams = value;

              this.cabinet.param(v);
            }
          }
        }
      }
    }

    return this;
  }

  /** @override */
  public override params(): Required<AmpSimulatorParams> {
    return {
      state      : this.isActive,
      type       : this.preampType,  // for compatible
      preampType : this.preampType,
      cabinetType: this.cabinetType,
      preamp     : this.preamp.params(),
      cabinet    : this.cabinet.params()
    };
  }
}
