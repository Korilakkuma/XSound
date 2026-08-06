import { Effector } from '../Effector';

export type IRCabinetParams = {
  state?: boolean
  buffer?: AudioBuffer | string | null,
  tone?: number;
};

/**
 * Effector's subclass for IR (Impulse Response) Cabinet.
 */
export class IRCabinet extends Effector {
  private convolver: ConvolverNode;
  private tone: BiquadFilterNode;

  private asset = '';

  /**
   * @param {AudioContext} context This argument is in order to use Web Audio API.
   */
  constructor(context: AudioContext) {
    super(context);

    this.convolver = context.createConvolver();
    this.tone      = context.createBiquadFilter();

    // Initialize parameters
    this.tone.type            = 'lowpass';
    this.tone.frequency.value = 350;
    this.tone.Q.value         = 6;
    this.tone.gain.value      = 0;  // Not used

    // `IRCabinet` is connected by default
    this.activate();
  }

  /** @override */
  public override connect(): GainNode {
    // Clear connection
    this.input.disconnect(0);
    this.convolver.disconnect(0);
    this.tone.disconnect(0);

    if (this.isActive) {
      // Effect ON

      // GainNode (Input) -> BiquadFilterNode (Low-Pass) -> ConvolverNode (IR) -> GainNode (Output)
      this.input.connect(this.tone);
      this.tone.connect(this.convolver);
      this.convolver.connect(this.output);
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
   * @param {keyof IRCabinetParams|IRCabinetParams} params This argument is string if getter. Otherwise, setter.
   * @return {IRCabinetParams[keyof IRCabinetParams]} Return value is parameter for cabinet if getter.
   *     Otherwise, return value is for method chain.
   */
  public param(params: 'state'): boolean;
  public param(params: 'buffer'): AudioBuffer | null;
  public param(params: 'tone'): number;
  public param(params: IRCabinetParams): void;
  public param(params: keyof IRCabinetParams | IRCabinetParams): IRCabinetParams[keyof IRCabinetParams] | IRCabinet {
    if (typeof params === 'string') {
      switch (params) {
        case 'state': {
          return this.isActive;
        }

        case 'buffer': {
          return this.convolver.buffer;
        }

        case 'tone': {
          return this.tone.frequency.value;
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

        case 'buffer': {
          if ((value instanceof AudioBuffer) || (value === null)) {
            this.convolver.buffer = value;
          } else if (typeof value === 'string') {
            if (this.asset === value) {
              break;
            }

            this.asset = value;

            fetch(this.asset)
              .then((response) => {
                return response.arrayBuffer();
              })
              .then((arrayBuffer) => {
                this.context.decodeAudioData(arrayBuffer)
                  .then((audioBuffer) => {
                    this.convolver.buffer = audioBuffer;
                  })
                  .catch((error) => {
                    throw error;
                  });
              })
              .catch((error) => {
                throw error;
              });
          }

          break;
        }

        case 'tone': {
          if (typeof value === 'number') {
            this.tone.frequency.value = value;
          }

          break;
        }
      }
    }

    return this;
  }

  /** @override */
  public override params(): Required<IRCabinetParams> {
    return {
      state : this.isActive,
      buffer: this.asset,
      tone  : this.tone.frequency.value
    };
  }
}
