import { Track } from '/src/SoundModule/Recorder/Track';

describe(Track.name, () => {
  const track = new Track('track-1');

  test('should append data, and clear data', () => {
    const data1 = new Float32Array([1, 0, 1]);
    const data2 = new Float32Array([-1, 0, -1]);

    expect(track.has()).toBe(false);

    track.append(data1).append(data2);

    expect(track.has()).toBe(true);
    expect(track.get()).toStrictEqual([data1, data2]);

    track.clear();

    expect(track.has()).toBe(false);
    expect(track.get()).toStrictEqual([]);
  });
});
