import type { JC120Params } from './Preamps/JC120';
import type { GSP2101Params } from './Preamps/GSP2101';
import type { TwinReverbParams } from './Preamps/Fender/TwinReverb';
import type { BassmanParams } from './Preamps/Fender/Bassman';
import type { JTM45Params } from './Preamps/Marshall/JTM45';
import type { JMPParams } from './Preamps/Marshall/JMP';
import type { JCM800Params } from './Preamps/Marshall/JCM800';
import type { MarkParams } from './Preamps/MesaBoogie/Mark';
import type { RectifierParams } from './Preamps/MesaBoogie/Rectifier';
import type { SimpleCabinetParams } from './Cabinets/SimpleCabinet';
import type { FilterBankCabinetParams } from './Cabinets/FilterBankCabinet';
import type { IRCabinetParams } from './Cabinets/IRCabinet';

import { Effector } from './Effector';
import { JC120 } from './Preamps/JC120';
import { GSP2101 } from './Preamps/GSP2101';
import { TwinReverb } from './Preamps/Fender/TwinReverb';
import { Bassman } from './Preamps/Fender/Bassman';
import { JTM45 } from './Preamps/Marshall/JTM45';
import { JMP } from './Preamps/Marshall/JMP';
import { JCM800 } from './Preamps/Marshall/JCM800';
import { Mark } from './Preamps/MesaBoogie/Mark';
import { Rectifier } from './Preamps/MesaBoogie/Rectifier';
import { SimpleCabinet } from './Cabinets/SimpleCabinet';
import { FilterBankCabinet } from './Cabinets/FilterBankCabinet';
import { IRCabinet } from './Cabinets/IRCabinet';

export type PreampType = 'jc-120' | 'gsp2101' | 'twin' | 'bassman' | 'jtm45' | 'jmp' | 'jcm800' | 'mark' | 'rectifier';

export type CabinetType = 'simple' | 'filterbank' | 'IR';

export type PreampCurve = Float32Array<ArrayBuffer> | null;

export type AmpSimulatorParams = {
  state?: boolean,
  type?: PreampType,  // for compatible
  preampType?: PreampType,
  cabinetType?: CabinetType,
  preamp?: JC120Params | GSP2101Params | TwinReverbParams | BassmanParams | JTM45Params | JMPParams | JCM800Params | MarkParams | RectifierParams;
  cabinet?: SimpleCabinetParams | FilterBankCabinetParams | IRCabinetParams
};

/**
 * Effector's subclass for Amp Simulator.
 */
export class AmpSimulator extends Effector {
  private preampType: PreampType   = 'jmp';
  private cabinetType: CabinetType = 'simple';

  private preamp: JC120 | GSP2101 | TwinReverb | Bassman | JTM45 | JMP | JCM800 | Mark | Rectifier;
  private cabinet: SimpleCabinet | FilterBankCabinet | IRCabinet;

  // for export
  public static readonly Preamps = {
    JC120,
    GSP2101,
    TwinReverb,
    Bassman,
    JTM45,
    JMP,
    JCM800,
    Mark,
    Rectifier
  } as const;

  // for export
  public static readonly Cabinets = {
    SimpleCabinet,
    FilterBankCabinet,
    IRCabinet
  } as const;

  /**
  * This static method creates instance of `Float32Array` for `WaveShaperNode`.
  * @param {number} level This argument is preamp effect level.
  * @param {number} numberOfSamples This argument is curve size.
  * @return {Float32Array|null} Return value is `WaveShaperNode`'s 'curve'.
  */
  public static createCurve(level: number, numberOfSamples: number): PreampCurve {
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
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context);

    this.preamp  = new JMP(context);
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
              case 'jc-120': {
                this.preampType = 'jc-120';
                this.preamp     = new JC120(this.context);

                break;
              }

              case 'gsp2101': {
                this.preampType = 'gsp2101';
                this.preamp     = new GSP2101(this.context);

                break;
              }

              case 'twin': {
                this.preampType = 'twin';
                this.preamp     = new TwinReverb(this.context);

                break;
              }

              case 'bassman': {
                this.preampType = 'bassman';
                this.preamp     = new Bassman(this.context);

                break;
              }

              case 'jtm45': {
                this.preampType = 'jtm45';
                this.preamp     = new JTM45(this.context);

                break;
              }

              case 'jmp': {
                this.preampType = 'jmp';
                this.preamp     = new JMP(this.context);

                break;
              }

              case 'jcm800': {
                this.preampType = 'jcm800';
                this.preamp     = new JCM800(this.context);

                break;
              }

              case 'mark': {
                this.preampType = 'mark';
                this.preamp     = new Mark(this.context);

                break;
              }

              case 'rectifier': {
                this.preampType = 'rectifier';
                this.preamp     = new Rectifier(this.context);

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
              case 'jc-120': {
                this.preampType = 'jc-120';
                this.preamp     = new JC120(this.context);

                break;
              }

              case 'gsp2101': {
                this.preampType = 'gsp2101';
                this.preamp     = new GSP2101(this.context);

                break;
              }

              case 'twin': {
                this.preampType = 'twin';
                this.preamp     = new TwinReverb(this.context);

                break;
              }

              case 'bassman': {
                this.preampType = 'bassman';
                this.preamp     = new TwinReverb(this.context);

                break;
              }

              case 'jtm45': {
                this.preampType = 'jtm45';
                this.preamp     = new JTM45(this.context);

                break;
              }

              case 'jmp': {
                this.preampType = 'jmp';
                this.preamp     = new JMP(this.context);

                break;
              }

              case 'jcm800': {
                this.preampType = 'jcm800';
                this.preamp     = new JCM800(this.context);

                break;
              }

              case 'mark': {
                this.preampType = 'mark';
                this.preamp     = new Mark(this.context);

                break;
              }

              case 'rectifier': {
                this.preampType = 'rectifier';
                this.preamp     = new Rectifier(this.context);

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

              case 'IR': {
                this.cabinetType = 'IR';
                this.cabinet     = new IRCabinet(this.context);

                break;
              }
            }

            this.connect();
          }

          break;
        }

        case 'preamp': {
          if (typeof value === 'object') {
            if (this.preamp instanceof JC120) {
              const v: JC120Params = value;

              this.preamp.param(v);
            }

            if (this.preamp instanceof GSP2101) {
              const v: GSP2101Params = value;

              this.preamp.param(v);
            }

            if (this.preamp instanceof TwinReverb) {
              const v: TwinReverbParams = value;

              this.preamp.param(v);
            }

            if (this.preamp instanceof Bassman) {
              const v: BassmanParams = value;

              this.preamp.param(v);
            }

            if (this.preamp instanceof JTM45) {
              const v: JTM45Params = value;

              this.preamp.param(v);
            }

            if (this.preamp instanceof JMP) {
              const v: JMPParams = value;

              this.preamp.param(v);
            }

            if (this.preamp instanceof JCM800) {
              const v: JCM800Params = value;

              this.preamp.param(v);
            }

            if (this.preamp instanceof Mark) {
              const v: MarkParams = value;

              this.preamp.param(v);
            }

            if (this.preamp instanceof Rectifier) {
              const v: RectifierParams = value;

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

            if (this.cabinet instanceof IRCabinet) {
              const v: IRCabinetParams = value;

              this.cabinet.param(v);
            }
          }

          break;
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
