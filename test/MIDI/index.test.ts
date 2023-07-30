import { MIDI } from '/src/MIDI';

describe(MIDI.name, () => {
  const midi = new MIDI();

  describe(midi.setup.name, () => {
    test('should gets instance of `MIDIAccess`', () => {
      const requestMIDIAccessMock = jest.fn();

      requestMIDIAccessMock.mockImplementation(() => {
        return Promise.resolve();
      });

      // FIXME: Revert to original
      Object.defineProperty(navigator, 'requestMIDIAccess', {
        configurable: true,
        writable    : true,
        value       : requestMIDIAccessMock
      });

      midi.setup({ options: { sysex: true } });

      expect(requestMIDIAccessMock).toHaveBeenCalledTimes(1);
      expect(requestMIDIAccessMock).toHaveBeenCalledWith({ sysex: true });
    });
  });
});
