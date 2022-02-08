import { AudioContextMock } from '../../../mock/AudioContextMock';
import { Effector } from '../../../src/SoundModule/Effectors/Effector';

describe(Effector.name, () => {
  const context = new AudioContextMock();

  // @ts-ignore
  const effector = new Effector(context, 2048);

  describe(`${effector.activate.name} and ${effector.deactivate.name}`, () => {
    test('should return boolean', () => {
      expect(effector.activate().state()).toBe(true);
      expect(effector.deactivate().state()).toBe(false);
    });
  });

  describe(effector.params.name, () => {
    test('should return empty plain object', () => {
      expect(effector.params()).toStrictEqual({});
    });
  });

  describe(effector.toJSON.name, () => {
    test('should return empty plain object as JSON', () => {
      expect(effector.toJSON()).toBe('{}');
    });
  });
});
