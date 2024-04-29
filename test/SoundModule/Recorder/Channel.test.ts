import { Channel } from '/src/SoundModule/Recorder/Channel';
import { Frame } from '/src/SoundModule/Recorder/Frame';

describe(Channel.name, () => {
  const channel = new Channel('channel-1');

  test('should append frame', () => {
    const frame1 = new Frame('frame-1');
    const frame2 = new Frame('frame-2');

    expect(channel.length()).toBe(0);

    channel.append(frame1).append(frame2);

    expect(channel.length()).toBe(2);

    expect(channel.get(0)).toStrictEqual(frame1);
    expect(channel.get(1)).toStrictEqual(frame2);
    expect(channel.get()).toStrictEqual([frame1, frame2]);
  });

  test('should set channel gain', () => {
    channel.gain(0.5);

    expect(channel.gain()).toBeCloseTo(0.5, 1);

    channel.gain(1);
  });
});
