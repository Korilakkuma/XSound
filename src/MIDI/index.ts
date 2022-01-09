// HACK: Interfaces for Web MIDI API is not defined

export interface MIDIOptions {
  sysex: boolean;
}

export interface MIDIMessageEvent {
  data: Uint8Array;
  receivedTime: number;
}

export interface MIDIInput {
  onmidimessage(event: MIDIMessageEvent): void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MIDIOutput {
  clear(): void;
  send(data: Uint8Array, timestamp?: number): void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MIDIAccess {
  inputs: Map<string, MIDIInput>;
  outputs: Map<string, MIDIOutput>;
  onstatechang(): void;
  sysexEnabled: boolean;
}

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
    // @ts-ignore
    if (!navigator.requestMIDIAccess) {
      return Promise.reject();
    }

    const { options, successCallback, errorCallback } = params;

    // @ts-ignore
    return navigator.requestMIDIAccess(options)
      .then((midiAccess: MIDIAccess) => {
        this.midiAccess = midiAccess;

        const inputIterator  = midiAccess.inputs.values();
        const outputIterator = midiAccess.outputs.values();

        for (let i = inputIterator.next(); !i.done; i = inputIterator.next()) {
          this.inputs.push(i.value);
        }

        for (let o = outputIterator.next(); !o.done; o = outputIterator.next()) {
          this.outputs.push(o.value);
        }

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
