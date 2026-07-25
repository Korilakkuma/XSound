import { Effector } from '../Effector';

export type SimpleCabinetParams = {
  state?: boolean
};

/**
 * Effector's subclass for SimpleCabinet.
 */
export class SimpleCabinet extends Effector {
  private lowpass: BiquadFilterNode;
  private notch: BiquadFilterNode;

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context);

    this.lowpass = context.createBiquadFilter();
    this.notch   = context.createBiquadFilter();

    // Initialize parameters
    this.lowpass.type            = 'lowpass';
    this.lowpass.frequency.value = 3200;
    this.lowpass.Q.value         = 6;
    this.lowpass.gain.value      = 0;  // Not used

    this.notch.type            = 'notch';
    this.notch.frequency.value = 8000;
    this.notch.Q.value         = 1;
    this.notch.gain.value      = 0;  // Not used

    // `SimpleCabinet` is connected by default
    this.activate();
  }

  /** @override */
  public override connect(): GainNode {
    // Clear connection
    this.input.disconnect(0);
    this.lowpass.disconnect(0);
    this.notch.disconnect(0);

    if (this.isActive) {
      // Effect ON

      // GainNode (Input) -> BiquadFilterNode (Notch) -> BiquadFilterNode (Low-Pass) -> GainNode (Output)
      this.input.connect(this.notch);
      this.notch.connect(this.lowpass);
      this.lowpass.connect(this.output);
    } else {
      // Effect OFF

      // GainNode (Input) -> GainNode (Output)
      this.input.connect(this.output);
    }

    return this.output;
  }

  /**
   * This method gets or sets parameters for cabinet.
   * This method is overloaded for type interface and type check.
   * @param {keyof SimpleCabinetParams|SimpleCabinetParams} params This argument is string if getter. Otherwise, setter.
   * @return {SimpleCabinetParams[keyof SimpleCabinetParams]|SimpleCabinet} Return value is parameter for cabinet if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: 'state'): boolean;
  public param(params: SimpleCabinetParams): SimpleCabinet;
  public param(params: keyof SimpleCabinetParams | SimpleCabinetParams): SimpleCabinetParams[keyof SimpleCabinetParams] | SimpleCabinet {
    if (typeof params === 'string') {
      switch (params) {
        case 'state': {
          return this.isActive;
        }
      }
    }

    for (const [key, value] of Object.entries(params)) {
      switch (key) {
        case 'state': {
          if (typeof value === 'boolean') {
            if (value) {
              this.activate();
            } else {
              this.deactivate();
            }
          }

          break;
        }
      }
    }

    return this;
  }

  /** @override */
  public override params(): Required<SimpleCabinetParams> {
    return {
      state: this.isActive
    };
  }
}
