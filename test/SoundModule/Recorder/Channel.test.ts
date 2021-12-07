import { Channel } from '../../../src/SoundModule/Recorder/Channel';
import { Track } from '../../../src/SoundModule/Recorder/Track';

describe(Channel.name, () => {
  const channel = new Channel('channel-1');

  test('should append track', () => {
    const track1 = new Track('track-1');
    const track2 = new Track('track-2');

    expect(channel.length()).toBe(0);

    channel.append(track1).append(track2);

    expect(channel.length()).toBe(2);

    expect(channel.get(0)).toStrictEqual(track1);
    expect(channel.get(1)).toStrictEqual(track2);
    expect(channel.getAllTracks()).toStrictEqual([track1, track2]);
  });

  test('should set channel gain', () => {
    channel.setGain(0.5);

    expect(channel.getGain()).toBe(0.5);

    channel.setGain(1);
  });
});
