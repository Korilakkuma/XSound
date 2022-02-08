/**
 * This class is for using Web MIDI API.
 * @constructor
 */
export class MIDI {
  private midiAccess: MIDIAccess | null = null;
  private inputs: MIDIInput[] = [];
  private outputs: MIDIOutput[] = [];

  // eslint-disable-next-line no-useless-constructor
  constructor() {
  }

  /**
   * This method invokes `requestMIDIAccess` and gets instance of `MIDIAccess`.
   * @param {MIDIOptions} options This argument is object based on `MIDIOptions` dictionary.
   * @param {function} successCallback This argument is invoked on `requestMIDIAccess` success.
   * @param {function} errorCallback This argument is invoked on `requestMIDIAccess` failure.
   * @return {Promise<MIDIAccess|void>} Return value is `Promise` that `requestMIDIAccess` method returns.
   */
  public setup(params: {
    options?: MIDIOptions;
    successCallback?(midiAccess: MIDIAccess, midiInputs: MIDIInput[], midiOutputs: MIDIOutput[]): void;
    errorCallback?(error: Error): void;
  }): Promise<MIDIAccess|void> {
    if (!navigator.requestMIDIAccess) {
      return Promise.reject();
    }

    const { options, successCallback, errorCallback } = params;

    return navigator.requestMIDIAccess(options)
      .then((midiAccess: MIDIAccess) => {
        this.midiAccess = midiAccess;

        midiAccess.inputs.forEach((input: MIDIInput) => {
          this.inputs.push(input);
        });

        midiAccess.outputs.forEach((output: MIDIOutput) => {
          this.outputs.push(output);
        });

        if (successCallback) {
          successCallback(this.midiAccess, this.inputs, this.outputs);
        }
      })
      .catch((error: Error) => {
        if (errorCallback) {
          errorCallback(error);
        }
      });
  }

  /**
   * This method gets instance of `MIDIAccess`.
   * @return {MIDIAccess|null}
   */
  public get(): MIDIAccess | null {
    return this.midiAccess;
  }
}
