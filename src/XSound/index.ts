// Constants for Music

// 12 equal temperament
//
// Min -> 27.5 Hz (A), Max -> 4186 Hz (C)
//
// A * 1.0594630943592953 -> A# (half up)
export const EQUAL_TEMPERAMENT = 12 as const;
export const FREQUENCY_RATIO   = 1.0594630943592953 as const;  // 2 ** (1 / EQUAL_TEMPERAMENT)
export const MIN_A             = 27.5 as const;
export const QUARTER_NOTE      = 4 as const;
export const SHARP             = '#' as const;
export const HALF_UP           = '+' as const;
export const HALF_DOWN         = '-' as const;
export const DOT               = '.' as const;

export type PitchChar = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B' | 'R';

export type ConvertedTime = {
  minutes: number,
  seconds: number,
  milliseconds: number
};

/**
 * This predicate method determine whether is `PitchChar` type.
 * @param {string} pitchChar This argument is any string.
 * @return {boolean}
 */
export function isPitchChar(pitchChar: string): pitchChar is PitchChar {
  switch (pitchChar.toUpperCase()) {
    case 'C':
    case 'D':
    case 'E':
    case 'F':
    case 'G':
    case 'A':
    case 'B':
    case 'R': {
      return true;
    }

    default: {
      return false;
    }
  }
}

/**
 * This class (static) method computes index by octave and `PitchChar` string.
 * @param {number} octave This argument is octave.
 * @param {PitchChar} pitchChar This argument is `PitchChar` string.
 * @return {number} Return value is index that is computed by octave and pitch character.
 */
export function computeIndex(octave: number, pitchChar: PitchChar): number {
  let index = 0;

  switch (pitchChar) {
    case 'C': {
      index = 3;
      break;
    }

    case 'D': {
      index = 5;
      break;
    }

    case 'E': {
      index = 7;
      break;
    }

    case 'F': {
      index = 8;
      break;
    }

    case 'G': {
      index = 10;
      break;
    }

    case 'A': {
      index = 12;
      break;
    }

    case 'B': {
      index = 14;
      break;
    }

    case 'R': {
      return -1;
    }
  }

  const computedIndex = (EQUAL_TEMPERAMENT * (octave - 1)) + index;

  return (computedIndex >= 0) ? computedIndex : -1;
}

/**
 * This class (static) method computes frequency from index that corresponds to 12 equal temperament.
 * @param {number} index This argument is index that corresponds to 12 equal temperament.
 *     For example, this value is between 0 and 88 in case of piano.
 * @return {number} Return value is frequency.
 */
export function computeFrequency(index: number): number {
  return (index >= 0) ? (MIN_A * (FREQUENCY_RATIO ** index)) : 0;
}

export interface FileEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

// Utility types and functions

export type FileReaderType      = 'arraybuffer' | 'dataURL' | 'text' | 'json';
export type FileReaderErrorText = 'NOT_FOUND_ERR' | 'SECURITY_ERR' | 'ABORT_ERR' | 'NOT_READABLE_ERR' | 'ERR' | '';

/**
 * This class (static) method executes FFT.
 * @param {Float32Array} reals This argument is instance of `Float32Array` for real number.
 * @param {Float32Array} imags This argument is instance of `Float32Array` for imaginary number.
 * @param {number} size This argument is FFT size (power of two).
 */
export function fft(reals: Float32Array, imags: Float32Array, size: number): void {
  const pow2 = (n: number) => 2 ** n;

  const indexes = new Uint16Array(size);

  const numberOfStages = Math.log2(size);

  for (let stage = 1; stage <= numberOfStages; stage++) {
    for (let i = 0; i < pow2(stage - 1); i++) {
      const rest = numberOfStages - stage;

      for (let j = 0; j < pow2(rest); j++) {
        const n = i * pow2(rest + 1) + j;
        const m = pow2(rest) + n;
        const r = j * pow2(stage - 1);

        const areal = reals[n];
        const aimag = imags[n];
        const breal = reals[m];
        const bimag = imags[m];
        const creal = Math.cos((2.0 * Math.PI * r) / size);
        const cimag = -1 * Math.sin((2.0 * Math.PI * r) / size);

        if (stage < numberOfStages) {
          reals[n] = areal + breal;
          imags[n] = aimag + bimag;
          reals[m] = (creal * (areal - breal)) - (cimag * (aimag - bimag));
          imags[m] = (creal * (aimag - bimag)) + (cimag * (areal - breal));
        } else {
          reals[n] = areal + breal;
          imags[n] = aimag + bimag;
          reals[m] = areal - breal;
          imags[m] = aimag - bimag;
        }
      }
    }
  }

  for (let stage = 1; stage <= numberOfStages; stage++) {
    const rest = numberOfStages - stage;

    for (let i = 0; i < pow2(stage - 1); i++) {
      indexes[pow2(stage - 1) + i] = indexes[i] + pow2(rest);
    }
  }

  for (let k = 0; k < size; k++) {
    if (indexes[k] <= k) {
      continue;
    }

    const real = reals[indexes[k]];
    const imag = imags[indexes[k]];

    reals[indexes[k]] = reals[k];
    imags[indexes[k]] = imags[k];

    reals[k] = real;
    imags[k] = imag;
  }
}

/**
 * This class (static) method executes IFFT.
 * @param {Float32Array} reals This argument is instance of `Float32Array` for real number.
 * @param {Float32Array} imags This argument is instance of `Float32Array` for imaginary number.
 * @param {number} size This argument is IFFT size (power of two).
 */
export function ifft(reals: Float32Array, imags: Float32Array, size: number): void {
  const pow2 = (n: number) => 2 ** n;

  const indexes = new Uint16Array(size);

  const numberOfStages = Math.log2(size);

  for (let stage = 1; stage <= numberOfStages; stage++) {
    for (let i = 0; i < pow2(stage - 1); i++) {
      const rest = numberOfStages - stage;

      for (let j = 0; j < pow2(rest); j++) {
        const n = i * pow2(rest + 1) + j;
        const m = pow2(rest) + n;
        const r = j * pow2(stage - 1);

        const areal = reals[n];
        const aimag = imags[n];
        const breal = reals[m];
        const bimag = imags[m];
        const creal = Math.cos((2.0 * Math.PI * r) / size);
        const cimag = Math.sin((2.0 * Math.PI * r) / size);

        if (stage < numberOfStages) {
          reals[n] = areal + breal;
          imags[n] = aimag + bimag;
          reals[m] = (creal * (areal - breal)) - (cimag * (aimag - bimag));
          imags[m] = (creal * (aimag - bimag)) + (cimag * (areal - breal));
        } else {
          reals[n] = areal + breal;
          imags[n] = aimag + bimag;
          reals[m] = areal - breal;
          imags[m] = aimag - bimag;
        }
      }
    }
  }

  for (let stage = 1; stage <= numberOfStages; stage++) {
    const rest = numberOfStages - stage;

    for (let i = 0; i < pow2(stage - 1); i++) {
      indexes[pow2(stage - 1) + i] = indexes[i] + pow2(rest);
    }
  }

  for (let k = 0; k < size; k++) {
    if (indexes[k] <= k) {
      continue;
    }

    const real = reals[indexes[k]];
    const imag = imags[indexes[k]];

    reals[indexes[k]] = reals[k];
    imags[indexes[k]] = imags[k];

    reals[k] = real;
    imags[k] = imag;
  }

  for (let k = 0; k < size; k++) {
    reals[k] /= size;
    imags[k] /= size;
  }
}

/**
 * This class (static) method retrieves resource on web by Ajax.
 * @property {string} url This argument is URL for resource.
 * @property {XMLHttpRequestResponseType} type This argument is response type that is one of 'arraybuffer', 'blob', 'document', 'json', 'text'. The default value is 'arraybuffer'.
 * @property {number} timeout This argument is timeout of Ajax. The default value is 60000 msec (1 minutes).
 * @property {function} successCallback This argument is invoked on success.
 * @property {function} errorCallback This argument is invoked on failure.
 * @property {function} progressCallback This argument is invoked during receiving data.
 */
export function ajax(params: {
  url: string;
  type?: XMLHttpRequestResponseType;
  timeout?: number;
  successCallback?(event: ProgressEvent, respsonse: ArrayBuffer | Blob | Document | string): void;
  errorCallback?(event: ProgressEvent, textStatus: 'error' | 'timeout'): void;
  progressCallback?(event: ProgressEvent): void;
}): void {
  const { url, type, timeout, successCallback, errorCallback, progressCallback } = params;

  // for error
  const ERROR_AJAX         = 'error';
  const ERROR_AJAX_TIMEOUT = 'timeout';

  const xhr = new XMLHttpRequest();

  xhr.timeout = timeout ?? 60000;

  xhr.ontimeout = (event: ProgressEvent) => {
    if (errorCallback) {
      errorCallback(event, ERROR_AJAX_TIMEOUT);
    }
  };

  xhr.onprogress = (event: ProgressEvent) => {
    if (progressCallback) {
      progressCallback(event);
    }
  };

  xhr.onerror = (event: ProgressEvent) => {
    if (errorCallback) {
      errorCallback(event, ERROR_AJAX);
    }
  };

  xhr.onload = (event: ProgressEvent) => {
    if (successCallback && (xhr.status === 200)) {
      successCallback(event, xhr.response);
    }
  };

  xhr.open('GET', url, true);
  xhr.responseType = type ?? 'arraybuffer';
  xhr.send(null);
}

/**
 * This class (static) method calculates minutes, seconds and milliseconds from designated time (seconds).
 * @param {number} time This argument is time (seconds).
 * @return {ConvertedTime} Return value is converted time as associative array
 */
export function convertTime(time: number): ConvertedTime {
  if (time < 0) {
    return {
      minutes     : -1,
      seconds     : -1,
      milliseconds: -1
    };
  }

  const m  = Math.trunc(time / 60);
  const s  = Math.trunc(time % 60);
  const ms = time - Math.trunc(time);

  return {
    minutes     : m,
    seconds     : s,
    milliseconds: ms
  };
}

/**
 * This class (static) method decodes instance of `ArrayBuffer` to instance of `AudioBuffer`.
 * @param {AudioContext} context This argument is instance of `AudioContext` for `decodeAudioData` method.
 * @param {ArrayBuffer} arraybuffer This argument is decoded to instance of `AudioBuffer`.
 * @param {function} successCallback This argument is invoked on success.
 * @param {function} errorCallback This argument is invoked on failure.
 */
export function decode(
  context: AudioContext,
  arraybuffer: ArrayBuffer,
  successCallback?: (buffer: AudioBuffer) => void,
  errorCallback?: (error: Error) => void
): void {
  if (!successCallback) {
    successCallback = () => {};
  }

  if (!errorCallback) {
    errorCallback = () => {};
  }

  context.decodeAudioData(arraybuffer, successCallback, errorCallback);
}

/**
 * This class (static) method shows designated `Element` in full screen.
 * @param {Element} element This argument is instance of `Element` that is target of full screen.
 * @return {Promise} Return value is instance of `Promise`.
 */
export function requestFullscreen(element: Element): Promise<void> {
  return element.requestFullscreen();
}

/**
 * This class (static) method shows `Document` in original size from full screen.
 * @return {Promise} Return value is instance of `Promise`.
 */
export function exitFullscreen(): Promise<void> {
  return document.exitFullscreen();
}

/**
 * This class (static) method reads file.
 * @property {File} file This argument is instance of `File`.
 * @property {FileReaderType} type This argument is one of 'arraybuffer', 'dataURL', 'text', 'json'.
 * @property {function} successCallback This argument is invoked on success.
 * @property {function} errorCallback This argument is invoked on failure.
 * @property {function} progressCallback This argument is invoked as `onprogress` event handler in instance of `FileReader`.
 */
export function read(params: {
  file: File;
  type: FileReaderType;
  successCallback?(event: ProgressEvent, result: ArrayBuffer | ReturnType<typeof JSON.parse> | string | null): void;
  errorCallback?(event: ProgressEvent, textStatus: FileReaderErrorText): void;
  progressCallback?(event: ProgressEvent): void;
}): void {
  const { file, type, successCallback, errorCallback, progressCallback } = params;

  const reader = new FileReader();

  reader.onprogress = (event: ProgressEvent) => {
    if (progressCallback) {
      progressCallback(event);
    }
  };

  reader.onerror = (event: ProgressEvent) => {
    if (!errorCallback) {
      return;
    }

    let error: FileReaderErrorText;

    switch (reader.error?.code) {
      case reader.error?.NOT_FOUND_ERR: {
        error = 'NOT_FOUND_ERR';
        break;
      }

      case reader.error?.SECURITY_ERR: {
        error = 'SECURITY_ERR';
        break;
      }

      case reader.error?.ABORT_ERR: {
        error = 'ABORT_ERR';
        break;
      }

      case reader.error?.NOT_SUPPORTED_ERR: {
        error = 'NOT_READABLE_ERR';
        break;
      }

      default: {
        error = 'ERR';
        break;
      }
    }

    errorCallback(event, error);
  };

  reader.onload = (event: ProgressEvent) => {
    if (!successCallback) {
      return;
    }

    let result = reader.result;

    // Escape `<script>` if `FileReaderType` is either `text` or `json`
    switch (type) {
      case 'text': {
        if (typeof result === 'string') {
          result = result.replace(/<(\/?script.*?)>/gi, '&lt;$1&gt;');
        }

        break;
      }

      case 'json': {
        if (typeof result === 'string') {
          result = JSON.parse(result.replace(/<(\/?script.*?)>/gi, '&lt;$1&gt;'));
        }

        break;
      }
    }

    successCallback(event, result);
  };

  switch (type) {
    case 'arraybuffer': {
      reader.readAsArrayBuffer(file);
      break;
    }

    case 'dataURL': {
      reader.readAsDataURL(file);
      break;
    }

    case 'text':
    case 'json': {
      reader.readAsText(file, 'UTF-8');
      break;
    }
  }
}

/**
 * This class (static) method gets instance of `File` from `DataTransfer`.
 * @property {DragEvent} event This argument is instance of `DragEvent`.
 * @property {FileReaderType|string} type This argument is one of 'arraybuffer', 'dataURL', 'objectURL', 'text', 'json'.
 * @property {function} successCallback This argument is invoked on success.
 * @property {function} errorCallback This argument is invoked on failure.
 * @property {function} progressCallback This argument is invoked as `onprogress` event handler in instance of `FileReader`.
 * @return {string|File|null} Return value is Object URL or instance of `File` on success. Otherwise, it is `null`.
 */
export function drop(params: {
  event: DragEvent;
  type: FileReaderType | 'objectURL';
  successCallback?(event: ProgressEvent, result: ArrayBuffer | ReturnType<typeof JSON.parse> | string | null): void;
  errorCallback?(event: ProgressEvent, textStatus: FileReaderErrorText): void;
  progressCallback?(event: ProgressEvent): void;
}): string | File | null {
  const { event, type, successCallback, errorCallback, progressCallback } = params;

  event.preventDefault();

  const file = event.dataTransfer?.items[0].getAsFile() ?? null;

  if (file === null) {
    return null;
  }

  if (type === 'objectURL') {
    return window.URL.createObjectURL(file);
  }

  read({
    file,
    type,
    successCallback,
    errorCallback,
    progressCallback
  });

  return file;
}

/**
 * This class (static) method gets instance of `File`.
 * @property {Event} event This argument is instance of `Event` by `HTMLInputElement`.
 * @property {FileReaderType|string} type This argument is one of 'arraybuffer', 'dataURL', 'objectURL', 'text', 'json'.
 * @property {function} successCallback This argument is invoked on success.
 * @property {function} errorCallback This argument is invoked on failure.
 * @property {function} progressCallback This argument is invoked as `onprogress` event handler in instance of `FileReader`.
 * @return {string|File|null} Return value is Object URL or instance of `File` on success. Otherwise, it is `null`.
 */
export function file(params: {
  event: FileEvent;
  type: FileReaderType | 'objectURL';
  successCallback?(event: ProgressEvent, result: ArrayBuffer | ReturnType<typeof JSON.parse> | string | null): void;
  errorCallback?(event: ProgressEvent, textStatus: FileReaderErrorText): void;
  progressCallback?(event: ProgressEvent): void;
}): string | File | null {
  const { event, type, successCallback, errorCallback, progressCallback } = params;

  // HACK:
  const file = event.target.files?.item(0) ?? null;

  if (file === null) {
    return null;
  }

  if (type === 'objectURL') {
    return window.URL.createObjectURL(file);
  }

  read({
    file,
    type,
    successCallback,
    errorCallback,
    progressCallback
  });

  return file;
}

/**
 * This class (static) method calculates frequency from index that corresponds to 12 equal temperament.
 * @param {Array<number>} indexes This argument is array that contains index that corresponds to 12 equal temperament.
 *     For example, this value is between 0 and 88 in case of piano.
 * @return {Array<number>} Return value is array that contains frequency.
 */
export function toFrequencies(indexes: number[]): number[] {
  return indexes.map((index: number) => computeFrequency(index));
}

/**
 * This class (static) method creates text file.
 * @param {string} text This argument is string.
 * @param {boolean} asObjectURL This argument is `true` in case of getting text file as Object URL.
 * @return {string} Return value is text file as Data URL or Object URL.
 */
export function toTextFile(text: string, asObjectURL: boolean): string {
  if (asObjectURL) {
    const blob = new Blob([text], { type: 'text/plain' });

    return window.URL.createObjectURL(blob);
  }

  return `data:,${encodeURIComponent(text)}`;
}
