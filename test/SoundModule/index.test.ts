import { AudioContextMock } from '../../mocks/AudioContextMock';
import { SoundModule } from '../../src/SoundModule';

describe(SoundModule.name, () => {
  const context = new AudioContextMock();

  // @ts-ignore
  const soundModule = new SoundModule(context, 1024);

  describe(`${soundModule.resize.name} and ${soundModule.getBufferSize.name}`, () => {
    test('should return resized buffer size', () => {
      soundModule.resize(2048);
      expect(soundModule.getBufferSize()).toBe(2048);
      soundModule.resize(1024);
    });
  });

  describe(soundModule.toString.name, () => {
    test('should return [SoundModule]', () => {
      expect(soundModule.toString()).toBe('[SoundModule]');
    });
  });
});
