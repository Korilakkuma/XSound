import { AudioContextMock } from '../../mock/AudioContextMock';
import { WorkerMock } from '../../mock/WorkerMock';
import { OscillatorModule } from '../../src/OscillatorModule';
import { Sequence } from '../../src/MML/Sequence';
import { Part } from '../../src/MML/Part';
import { MML } from '../../src/MML/index';

describe(MML.name, () => {
  const mml = new MML();

  const originalWebWorker       = window.Worker;
  const originalCreateObjectURL = URL.createObjectURL;
  const originalRevokeObjectURL = URL.revokeObjectURL;

  beforeAll(() => {
    Object.defineProperty(window, 'Worker', {
      configurable: true,
      writable    : true,
      value       : WorkerMock
    });

    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      writable    : true,
      value       : () => 'https://xxx'
    });

    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      writable    : true,
      value       : () => {}
    });
  });

  afterAll(() => {
    window.Worker       = originalWebWorker;
    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
  });

  afterEach(() => {
    mml.clear();
  });

  describe(mml.ready.name, () => {
    test('should call `stop` and `clear` method. And, should set instance of `Part`', () => {
      const context = new AudioContextMock();

      // @ts-ignore
      const source = new OscillatorModule(context, 2048);

      const mmls = [
        'T60 O4 C4 R2. C4&C4',
        'T60 O4 C4 R2. C4&C4'
      ];

      const originalStop  = mml.stop;
      const originalClear = mml.clear;

      const stopMock  = jest.fn();
      const clearMock = jest.fn();

      mml.stop  = stopMock;
      mml.clear = clearMock;

      mml.ready({ source, mmls });

      expect(stopMock).toHaveBeenCalledTimes(1);
      expect(clearMock).toHaveBeenCalledTimes(1);

      // eslint-disable-next-line dot-notation
      expect(mml['parts'].length).toBe(2);

      mml.stop  = originalStop;
      mml.clear = originalClear;
    });
  });

  describe(mml.start.name, () => {
    test('should call `start` method each `Part`', () => {
      const context = new AudioContextMock();

      // @ts-ignore
      const source = new OscillatorModule(context, 2048);

      const mmls = [
        'T60 O4 C4 R2. C4&C4',
        'T60 O4 C4 R2. C4&C4'
      ];

      const originalPartStart = Part.prototype.start;

      const partStartMock = jest.fn();

      Part.prototype.start = partStartMock;

      mml.ready({ source, mmls });

      mml.start(0);
      mml.start(1);

      expect(partStartMock).toHaveBeenCalledTimes(2);

      Part.prototype.start = originalPartStart;
    });
  });

  describe(mml.stop.name, () => {
    test('should call `stop` method each `Part`', () => {
      const context = new AudioContextMock();

      // @ts-ignore
      const source = new OscillatorModule(context, 2048);

      const mmls = [
        'T60 O4 C4 R2. C4&C4',
        'T60 O4 C4 R2. C4&C4'
      ];

      const originalPartStop = Part.prototype.stop;

      const partStopMock = jest.fn();

      Part.prototype.stop = partStopMock;

      mml.ready({ source, mmls });

      mml.start(0);
      mml.start(1);

      mml.stop();

      expect(partStopMock).toHaveBeenCalledTimes(2);

      Part.prototype.stop = originalPartStop;
    });
  });

  describe(mml.getMML.name, () => {
    test('should return MML string', () => {
      const context = new AudioContextMock();

      // @ts-ignore
      const source = new OscillatorModule(context, 2048);

      const mmls = [
        'T60 O4 C4 R2. C4&C4',
        'T60 O4 C4 R2. C4&C4'
      ];

      mml.ready({ source, mmls });

      expect(mml.getMML(0)).toBe('T60 O4 C4 R2. C4&C4');
      expect(mml.getMML(1)).toBe('T60 O4 C4 R2. C4&C4');
    });
  });

  describe(mml.getMMLs.name, () => {
    test('should return array that contains MML string', () => {
      const context = new AudioContextMock();

      // @ts-ignore
      const source = new OscillatorModule(context, 2048);

      const mmls = [
        'T60 O4 C4 R2. C4&C4',
        'T60 O4 C4 R2. C4&C4'
      ];

      mml.ready({ source, mmls });

      expect(mml.getMMLs()).toStrictEqual(['T60 O4 C4 R2. C4&C4', 'T60 O4 C4 R2. C4&C4']);
    });
  });

  describe(mml.getSequences.name, () => {
    test('should return array that contains instance of `Sequence`', () => {
      const context = new AudioContextMock();

      // @ts-ignore
      const source = new OscillatorModule(context, 2048);

      const mmls = [
        'T60 O4 C4 R2. C4&C4',
        'T60 O4 C4 R2. C4&C4'
      ];

      mml.ready({ source, mmls });

      expect(mml.getSequences(0)).toStrictEqual([
        new Sequence({ id: '1', note: 'C4',    indexes: [39], frequencies: [261.6255653005991], start: 0, stop: 1, duration: 1 }),
        new Sequence({ id: '2', note: 'R2.',   indexes: [-1], frequencies: [0.000000000000000], start: 1, stop: 4, duration: 3 }),
        new Sequence({ id: '3', note: 'C4&C4', indexes: [39], frequencies: [261.6255653005991], start: 4, stop: 6, duration: 2 })
      ]);

      expect(mml.getSequences(1)).toStrictEqual([
        new Sequence({ id: '1', note: 'C4',    indexes: [39], frequencies: [261.6255653005991], start: 0, stop: 1, duration: 1 }),
        new Sequence({ id: '2', note: 'R2.',   indexes: [-1], frequencies: [0.000000000000000], start: 1, stop: 4, duration: 3 }),
        new Sequence({ id: '3', note: 'C4&C4', indexes: [39], frequencies: [261.6255653005991], start: 4, stop: 6, duration: 2 })
      ]);
    });
  });

  describe(mml.getAllSequences.name, () => {
    test('should return array that contains instance of `Sequence` from the all of MML parts', () => {
      const context = new AudioContextMock();

      // @ts-ignore
      const source = new OscillatorModule(context, 2048);

      const mmls = [
        'T60 O4 C4 R2. C4&C4',
        'T60 O4 C4 R2. C4&C4'
      ];

      mml.ready({ source, mmls });

      expect(mml.getAllSequences()).toStrictEqual([
        [
          new Sequence({ id: '1', note: 'C4',    indexes: [39], frequencies: [261.6255653005991], start: 0, stop: 1, duration: 1 }),
          new Sequence({ id: '2', note: 'R2.',   indexes: [-1], frequencies: [0.000000000000000], start: 1, stop: 4, duration: 3 }),
          new Sequence({ id: '3', note: 'C4&C4', indexes: [39], frequencies: [261.6255653005991], start: 4, stop: 6, duration: 2 })
        ],
        [
          new Sequence({ id: '1', note: 'C4',    indexes: [39], frequencies: [261.6255653005991], start: 0, stop: 1, duration: 1 }),
          new Sequence({ id: '2', note: 'R2.',   indexes: [-1], frequencies: [0.000000000000000], start: 1, stop: 4, duration: 3 }),
          new Sequence({ id: '3', note: 'C4&C4', indexes: [39], frequencies: [261.6255653005991], start: 4, stop: 6, duration: 2 })
        ]
      ]);
    });
  });

  describe(mml.getSyntaxTree.name, () => {
    test('should return string that represents MML syntax tree', () => {
      const context = new AudioContextMock();

      // @ts-ignore
      const source = new OscillatorModule(context, 2048);

      const mmls = [
        'T60 O4 C4 R2. C4&C4',
        'T60 O4 C4 R2. C4&C4'
      ];

      mml.ready({ source, mmls });

      expect(mml.getSyntaxTree(0).replace(/\s/g, '')).toBe('T(id=1)/\\60O(id=3)/\\4C(id=5)/\\4R(id=7)/\\2.C(id=9)/\\4&(id=11)/\\C(id=12)/\\4EOS');
      expect(mml.getSyntaxTree(1).replace(/\s/g, '')).toBe('T(id=1)/\\60O(id=3)/\\4C(id=5)/\\4R(id=7)/\\2.C(id=9)/\\4&(id=11)/\\C(id=12)/\\4EOS');
    });
  });

  describe(mml.has.name, () => {
    test('should return `false`', () => {
      expect(mml.has()).toBe(false);
    });

    test('should return `true`', () => {
      const context = new AudioContextMock();

      // @ts-ignore
      const source = new OscillatorModule(context, 2048);

      const mmls = [
        'T60 O4 C4 R2. C4&C4',
        'T60 O4 C4 R2. C4&C4'
      ];

      mml.ready({ source, mmls });

      expect(mml.has()).toBe(true);
    });
  });

  describe(mml.paused.name, () => {
    test('should return `true`', () => {
      expect(mml.paused()).toBe(true);
    });

    test('should return `false`', () => {
      const context = new AudioContextMock();

      // @ts-ignore
      const source = new OscillatorModule(context, 2048);

      const mmls = [
        'T60 O4 C4 R2. C4&C4',
        'T60 O4 C4 R2. C4&C4'
      ];

      mml.ready({ source, mmls });

      const originalPaused = Part.prototype.paused;

      const pausedMock = jest.fn(() => false);

      Part.prototype.paused = pausedMock;

      expect(mml.paused()).toBe(false);

      Part.prototype.paused = originalPaused;
    });
  });

  describe(mml.currentIndex.name, () => {
    test('should set index each `Part`', () => {
      const context = new AudioContextMock();

      // @ts-ignore
      const source = new OscillatorModule(context, 2048);

      const mmls = [
        'T60 O4 C4 R2. C4&C4',
        'T60 O4 C4 R2. C4&C4'
      ];

      mml.ready({ source, mmls });

      mml.currentIndex(0, 0);

      expect(mml.currentIndex(0)).toBe(0);

      mml.currentIndex(0, 2);

      expect(mml.currentIndex(0)).toBe(2);

      mml.currentIndex(1, 0);

      expect(mml.currentIndex(1)).toBe(0);

      mml.currentIndex(1, 2);

      expect(mml.currentIndex(1)).toBe(2);
    });
  });

  describe(mml.clear.name, () => {
    test('should call `stop` method each `Part`. And `Part` should be none', () => {
      const context = new AudioContextMock();

      // @ts-ignore
      const source = new OscillatorModule(context, 2048);

      const mmls = [
        'T60 O4 C4 R2. C4&C4',
        'T60 O4 C4 R2. C4&C4'
      ];

      const originalPartStop = Part.prototype.stop;

      const partStopMock = jest.fn();

      Part.prototype.stop = partStopMock;

      mml.ready({ source, mmls });
      mml.clear();

      expect(partStopMock).toHaveBeenCalledTimes(2);

      // eslint-disable-next-line dot-notation
      expect(mml['parts'].length).toBe(0);

      Part.prototype.stop = originalPartStop;
    });
  });

  describe(mml.toABC.name, () => {
    expect(mml.toABC('T60 O4 C4 R2. C4&C4')).toBe(`X:1
T:
M:4/4
L:1/256
K:
Q:1/4=60
C64 z192 C64-C64`);
  });
});
