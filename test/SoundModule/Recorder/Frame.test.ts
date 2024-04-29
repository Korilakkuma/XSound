import { Frame } from '/src/SoundModule/Recorder/Frame';

describe(Frame.name, () => {
  const frame = new Frame('frame-1');

  test('should append data, and clear data', () => {
    const data1 = new Float32Array([1, 0, 1]);
    const data2 = new Float32Array([-1, 0, -1]);

    expect(frame.has()).toBe(false);

    frame.append(data1).append(data2);

    expect(frame.has()).toBe(true);
    expect(frame.get()).toStrictEqual([data1, data2]);

    frame.clear();

    expect(frame.has()).toBe(false);
    expect(frame.get()).toStrictEqual([]);
  });
});
