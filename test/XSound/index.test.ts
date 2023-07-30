import { AudioContextMock } from '/mock/AudioContextMock';
import {
  isPitchChar,
  computeIndex,
  computeFrequency,
  FileEvent,
  fft,
  ifft,
  ajax,
  convertTime,
  decode,
  requestFullscreen,
  exitFullscreen,
  read,
  drop,
  file,
  toFrequencies,
  toTextFile
} from '/src/XSound';

describe(isPitchChar.name, () => {
  test('should return `true`', () => {
    ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'R'].forEach((pitchChar: string) => {
      expect(isPitchChar(pitchChar)).toBe(true);
    });
  });

  test('should return `false`', () => {
    expect(isPitchChar('Z')).toBe(false);
  });
});

describe(computeIndex.name, () => {
  test('should return index from octave and `PitchChar` string', () => {
    expect(computeIndex(4, 'C')).toBe(39);
    expect(computeIndex(4, 'D')).toBe(41);
    expect(computeIndex(4, 'E')).toBe(43);
    expect(computeIndex(4, 'F')).toBe(44);
    expect(computeIndex(4, 'G')).toBe(46);
    expect(computeIndex(4, 'A')).toBe(48);
    expect(computeIndex(4, 'B')).toBe(50);
    expect(computeIndex(4, 'R')).toBe(-1);
  });
});

describe(computeFrequency.name, () => {
  test('should return frequency from index', () => {
    expect(computeFrequency(39)).toBeCloseTo(261.6255653005991, 3);
    expect(computeFrequency(41)).toBeCloseTo(293.6647679174081, 3);
    expect(computeFrequency(44)).toBeCloseTo(349.22823143300457, 3);
    expect(computeFrequency(46)).toBeCloseTo(391.99543598175006, 3);
    expect(computeFrequency(48)).toBeCloseTo(440, 3);
    expect(computeFrequency(50)).toBeCloseTo(493.8833012561252, 3);
    expect(computeFrequency(-1)).toBeCloseTo(0, 0);
  });
});

describe(`${fft.name} and ${ifft.name}`, () => {
  const reals = new Float32Array([Math.sin(0), Math.sin(1), Math.sin(2), Math.sin(3)]);
  const imags = new Float32Array([0, 0, 0, 0]);
  const size  = 4;

  test('should return `Float32Array`', () => {
    fft(reals, imags, size);

    [1.8918883800506592, -0.9092974066734314, -0.07329356670379639, -0.9092974066734314].forEach((expected, index) => {
      expect(reals[index]).toBeCloseTo(expected, 3);
    });

    [0, -0.7003509402275085, 0, 0.7003509402275085].forEach((expected, index) => {
      expect(imags[index]).toBeCloseTo(expected, 3);
    });

    ifft(reals, imags, size);

    [Math.sin(0), Math.sin(1), Math.sin(2), Math.sin(3)].forEach((expected, index) => {
      expect(reals[index]).toBeCloseTo(expected, 3);
    });

    [0, 0, 0, 0].forEach((expected, index) => {
      expect(imags[index]).toBeCloseTo(expected, 3);
    });
  });
});

describe(ajax.name, () => {
  test('should invoke callbacks', (done) => {
    const originalMethod = XMLHttpRequest.prototype.send;
    const sendMock       = jest.fn();

    Object.defineProperty(XMLHttpRequest.prototype, 'send', {
      configurable: true,
      writable    : true,
      value       : sendMock
    });

    const successCallbackMock = (event: ProgressEvent, response: ArrayBuffer | Blob | Document | string) => {
      expect(sendMock).toHaveBeenCalledTimes(1);
      expect(response).toBeInstanceOf(ArrayBuffer);
      done();
    };

    const errorCallbackMock = (event: Event) => {
      expect(sendMock).toHaveBeenCalledTimes(1);
      expect(event).toBeInstanceOf(Event);
      done();
    };

    const progressCallbackMock = (event: ProgressEvent) => {
      expect(sendMock).toHaveBeenCalledTimes(1);
      expect(event).toBeInstanceOf(ProgressEvent);
      done();
    };

    ajax({
      url             : 'https://example.com/assets/tears.mp3',
      type            : 'arraybuffer',
      timeout         : 10000,
      successCallback : successCallbackMock,
      errorCallback   : errorCallbackMock,
      progressCallback: progressCallbackMock
    });

    XMLHttpRequest.prototype.send = originalMethod;

    done();
  });
});

describe(convertTime.name, () => {
  // Positive
  test('should return associative array', () => {
    expect(convertTime(0)).toStrictEqual({
      minutes     : 0,
      seconds     : 0,
      milliseconds: 0
    });

    expect(convertTime(61.5)).toStrictEqual({
      minutes     : 1,
      seconds     : 1,
      milliseconds: 0.5
    });
  });

  // Negative
  test('should return invalid times', () => {
    expect(convertTime(-1)).toStrictEqual({
      minutes     : -1,
      seconds     : -1,
      milliseconds: -1
    });
  });
});

describe(decode.name, () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  xtest('should invoke callback', () => {
    const mock = new AudioContextMock();

    const successCallbackMock = jest.fn();
    const errorCallbackMock   = jest.fn();

    // @ts-ignore
    decode(mock, new ArrayBuffer(1024), successCallbackMock, errorCallbackMock);

    expect(successCallbackMock).toHaveBeenCalledTimes(1);
    expect(errorCallbackMock).toHaveBeenCalledTimes(0);
  });
});

describe(requestFullscreen.name, () => {
  test('should return undefined', () => {
    const element = document.createElement('div');

    element.requestFullscreen = jest.fn(() => Promise.resolve());

    requestFullscreen(element)
      .then((r) => {
        expect(r).toBe(undefined);
      })
      .catch((error) => {
        expect(error).toBe(undefined);
      });
  });
});

describe(exitFullscreen.name, () => {
  test('should return undefined', () => {
    document.exitFullscreen = jest.fn(() => Promise.resolve());

    exitFullscreen()
      .then((r) => {
        expect(r).toBe(undefined);
      })
      .catch((error) => {
        expect(error).toBe(undefined);
      });
  });
});

describe(read.name, () => {
  test('should be string or instance of `Event`', (done) => {
    const blob     = new Blob([new Uint8Array([0x60, 0x61, 0x62])], { type: 'text/plain' });
    const fileMock = new File([blob], 'testfile', { type: 'text/plain' });

    const successCallbackMock = (event: Event, result: string) => {
      expect(result).toBe(String.fromCodePoint(0x60, 0x61, 0x62));
      done();
    };

    const errorCallbackMock = (event: Event) => {
      expect(event).toBeInstanceOf(Event);
      done();
    };

    const progressCallbackMock = (event: Event) => {
      expect(event).toBeInstanceOf(Event);
      done();
    };

    read({
      file            : fileMock,
      type            : 'text',
      successCallback : successCallbackMock,
      errorCallback   : errorCallbackMock,
      progressCallback: progressCallbackMock
    });

    done();
  });
});

describe(drop.name, () => {
  xtest('should return instance of `File`', (done) => {
    const blob  = new Blob([new Uint8Array([0x60, 0x61, 0x62])], { type: 'text/plain' });
    const files = [new File([blob], 'testfile', { type: 'text/plain' })];

    // HACK:
    const fileListMock = {
      length: files.length,
      item  : (index: number) => files[index]
    } as FileList;

    // HACK:
    const dataTransferItemListMock = {} as DataTransferItemList;

    const dataTransferMock: DataTransfer =  {
      clearData    : () => {},
      dropEffect   : 'none',
      effectAllowed: 'none',
      files        : fileListMock,
      getData      : () => '',
      items        : dataTransferItemListMock,
      setData      : () => {},
      setDragImage : () => {},
      types        : ['text/plain']
    };

    const eventMock = new DragEvent('drop', { dataTransfer: dataTransferMock });

    const successCallbackMock = (event: Event, result: string) => {
      expect(result).toBe(String.fromCodePoint(0x60, 0x61, 0x62));
      done();
    };

    const errorCallbackMock = (event: Event) => {
      expect(event).toBeInstanceOf(Event);
      done();
    };

    const progressCallbackMock = (event: Event) => {
      expect(event).toBeInstanceOf(Event);
      done();
    };

    const f = drop({
      event           : eventMock,
      type            : 'text',
      successCallback : successCallbackMock,
      errorCallback   : errorCallbackMock,
      progressCallback: progressCallbackMock
    });

    expect(f).toStrictEqual(files[0]);

    done();
  });
});

describe(file.name, () => {
  test('should return instance of `File`', (done) => {
    const blob  = new Blob([new Uint8Array([0x60, 0x61, 0x62])], { type: 'text/plain' });
    const files = [new File([blob], 'testfile', { type: 'text/plain' })];

    // HACK:
    const fileListMock = {
      length: files.length,
      item  : (index: number) => files[index]
    } as FileList;

    const event = document.createEvent('Event');
    const input = document.createElement('input');

    const eventMock: FileEvent = {
      ...event,
      target: {
        ...input,
        // HACK:
        files: fileListMock
      }
    };

    const successCallbackMock = (event: Event, result: string) => {
      expect(result).toBe(String.fromCodePoint(0x60, 0x61, 0x62));
      done();
    };

    const errorCallbackMock = (event: Event) => {
      expect(event).toBeInstanceOf(Event);
      done();
    };

    const progressCallbackMock = (event: Event) => {
      expect(event).toBeInstanceOf(Event);
      done();
    };

    const f = file({
      event           : eventMock,
      type            : 'text',
      successCallback : successCallbackMock,
      errorCallback   : errorCallbackMock,
      progressCallback: progressCallbackMock
    });

    expect(f).toStrictEqual(files[0]);

    done();
  });
});

describe(toFrequencies.name, () => {
  // FIXME: `computeFrequency` should be mocked
  test('should call `computeFrequency` function', () => {
    const frequencies = toFrequencies([0, 48, 87]);

    expect(frequencies.length).toBe(3);
    expect(frequencies[0]).toBeCloseTo(27.5, 1);
    expect(frequencies[1]).toBeCloseTo(440, 1);
    expect(frequencies[2]).toBeCloseTo(4186, 1);
  });
});

describe(toTextFile.name, () => {
  test('should return string as Object URL', () => {
    const originalCreateObjectURL = URL.createObjectURL;

    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      writable    : true,
      value       : () => 'blob:https://xsound.jp/3bd816bf-28a5-4eb1-a1f6-66da75eb1ef5'
    });

    expect(toTextFile('あいうえお T62  O3  R16 A16 B-16  O4  D16 F12 A12  O5  F12 C2&C2. R4', true)).toBe('blob:https://xsound.jp/3bd816bf-28a5-4eb1-a1f6-66da75eb1ef5');

    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      writable    : true,
      value       : originalCreateObjectURL
    });
  });

  test('should return string as Data URL', () => {
    expect(toTextFile('あいうえお T62  O3  R16 A16 B-16  O4  D16 F12 A12  O5  F12 C2&C2. R4', false)).toBe('data:,%E3%81%82%E3%81%84%E3%81%86%E3%81%88%E3%81%8A%20T62%20%20O3%20%20R16%20A16%20B-16%20%20O4%20%20D16%20F12%20A12%20%20O5%20%20F12%20C2%26C2.%20R4');
  });
});
