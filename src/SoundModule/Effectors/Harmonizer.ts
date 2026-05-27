import { Effector } from './Effector';
import { PitchShifter } from './PitchShifter';

export type HarmonizerType = 'harmony' | 'octave' | 'detune';
export type HarmonizerMode = 'major' | 'minor';

export type HarmonizerParams = {
  state?: boolean,
  type?: HarmonizerType,
  mode?: HarmonizerMode,
  shifts?: [number, number],
  dry?: number,
  wets?: [number, number],
};

/**
 * Effector's subclass for Harmonizer.
 */
export class Harmonizer extends Effector {
  private static readonly indexes: [0, 1] = [0, 1];

  private type: HarmonizerType = 'harmony';
  private mode: HarmonizerMode = 'major';
  private shifts: [number, number] = [1, 1];
  private pitchShifters: [PitchShifter, PitchShifter];
  private dry = 1;
  private wets: [number, number] = [0, 0];

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context);

    this.pitchShifters = [new PitchShifter(context), new PitchShifter(context)];

    Harmonizer.indexes.forEach((index: 0 | 1) => {
      this.pitchShifters[index].param({ pitch: this.shifts[index], dry: this.dry, wet: this.wets[index] });
    });

    // `Harmonizer` is not connected by default
    this.deactivate();
  }

  /** @override */
  public override start(): void {
  }

  /** @override */
  public override stop(): void {
  }

  /** @override */
  public override connect(): GainNode {
    // Clear connection
    this.input.disconnect(0);

    Harmonizer.indexes.forEach((index: 0 | 1) => {
      this.pitchShifters[index].OUTPUT.disconnect(0);
    });

    if (this.isActive) {
      // GainNode (Input) -> Pitch Shifter -> GainNode (Output);
      Harmonizer.indexes.forEach((index: 0 | 1) => {
        this.input.connect(this.pitchShifters[index].INPUT);
        this.pitchShifters[index].OUTPUT.connect(this.output);
      });
    } else {
      // GainNode (Input) -> GainNode (Output)
      this.input.connect(this.output);
    }

    return this.output;
  }

  /**
   * This method gets or sets parameters for harmonizer.
   * This method is overloaded for type interface and type check.
   * @param {keyof HarmonizerParams|HarmonizerParams} params This argument is string if getter. Otherwise, setter.
   * @return {HarmonizerParams[keyof HarmonizerParams]|Harmonizer} Return value is parameter for pitch shifter if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: 'state'): boolean;
  public param(params: 'type'): HarmonizerType;
  public param(params: 'mode'): HarmonizerMode;
  public param(params: 'shifts'): [number, number];
  public param(params: 'dry'): number;
  public param(params: 'wets'): [number, number];
  public param(params: HarmonizerParams): Harmonizer;
  public param(params: keyof HarmonizerParams | HarmonizerParams): HarmonizerParams[keyof HarmonizerParams] | Harmonizer {
    if (typeof params === 'string') {
      switch (params) {
        case 'state': {
          return this.isActive;
        }

        case 'type': {
          return this.type;
        }

        case 'mode': {
          return this.mode;
        }

        case 'shifts': {
          return this.shifts;
        }

        case 'dry': {
          return this.dry;
        }

        case 'wets': {
          return this.wets;
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

        case 'type': {
          if (typeof value === 'string') {
            if ((value === 'harmony') || (value === 'octave') || (value === 'detune')) {
              this.type = value;

              this.setPitch();
            }
          }

          break;
        }

        case 'mode': {
          if (typeof value === 'string') {
            if ((value === 'major') || (value === 'minor')) {
              this.mode = value;
            }
          }

          break;
        }

        case 'shifts': {
          if (Array.isArray(value) && (value.length === 2)) {
            this.shifts = value;

            this.setPitch();
          }

          break;
        }

        case 'dry': {
          if (typeof value === 'number') {
            this.dry = value;

            Harmonizer.indexes.forEach((index: 0 | 1) => {
              this.pitchShifters[index].param({ dry: this.dry });
            });
          }

          break;
        }

        case 'wets': {
          if (Array.isArray(value) && (value.length === 2)) {
            this.wets = value;

            Harmonizer.indexes.forEach((index: 0 | 1) => {
              this.pitchShifters[index].param({ wet: this.wets[index] });
            });
          }

          break;
        }
      }
    }

    return this;
  }

  /** @override */
  public override params(): Required<HarmonizerParams> {
    return {
      state : this.isActive,
      type  : this.type,
      mode  : this.mode,
      shifts: this.shifts,
      dry   : this.dry,
      wets  : this.wets
    };
  }

  /**
   * This method
   * @return {Harmonizer}
   */
  private setPitch(): Harmonizer {
    switch (this.type) {
      case 'harmony': {
        switch (this.mode) {
          case 'major': {
            const pitch3 = 1 + (400 / 1200);
            const pitch5 = 1 + (700 / 1200);

            this.pitchShifters[0].param({ pitch: pitch3 });
            this.pitchShifters[1].param({ pitch: pitch5 });

            break;
          }

          case 'minor': {
            const pitch3 = 1 + (300 / 1200);
            const pitch5 = 1 + (700 / 1200);

            this.pitchShifters[0].param({ pitch: pitch3 });
            this.pitchShifters[1].param({ pitch: pitch5 });

            break;
          }
        }

        break;
      }

      case 'octave': {
        Harmonizer.indexes.forEach((index: 0 | 1) => {
          const octave = Math.abs(Math.trunc(this.shifts[index]));
          const pitch  = (this.shifts[index] >= 0) ? (1 + octave) : (1 / (2 ** octave));

          this.pitchShifters[index].param({ pitch });
        });

        break;
      }

      case 'detune': {
        Harmonizer.indexes.forEach((index: 0 | 1) => {
          const detune = Math.abs(this.shifts[index] / 1200);
          const pitch  = (this.shifts[index] >= 0) ? (1 + detune) : (1 / (2 ** detune));

          this.pitchShifters[index].param({ pitch });
        });

        break;
      }
    }

    return this;
  }
}
