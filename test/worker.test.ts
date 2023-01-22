import { extractWorkerString, createWorkerBlob, createWorkerObjectURL } from '../src/worker';

const workerString = `
  let timerId: number | null = null;

  self.onmessage = () => {
    timerId = self.setTimeout(() => {
      self.postMessage('test');
    }, 100);
  };
`;

const workerContainerString = `export const workerContainer = () => {
${workerString}
};`;

describe(extractWorkerString.name, () => {
  test('should return worker script as string', () => {
    expect(extractWorkerString(workerContainerString)).toBe(`\n${workerString}\n`);
  });
});

describe(createWorkerBlob.name, () => {
  test('should return `Blob` for worker', () => {
    expect(createWorkerBlob(workerContainerString)).toBeInstanceOf(Blob);
  });
});

describe(createWorkerObjectURL.name, () => {
  test('should return Object URL for worker', () => {
    const originalCreateObjectURL = URL.createObjectURL;

    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      writable    : true,
      value       : () => workerString
    });

    expect(createWorkerObjectURL(workerContainerString)).toBe(workerString);

    URL.createObjectURL = originalCreateObjectURL;
  });
});
