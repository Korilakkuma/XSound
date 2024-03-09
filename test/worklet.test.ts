import type { Inputs, Outputs, Parameters } from '/src/worklet';

import { AudioContextMock } from '/mock/AudioContextMock';
import { createModule, addAudioWorklet } from '/src/worklet';

// Cannot keep class name
class AudioWorkletProcessor {}

class CustomProcessor extends AudioWorkletProcessor {
  public static get parameterDescriptors() {
    return [{
      name          : 'depth',
      defaultValue  : 0,
      minValue      : 0,
      maxValue      : 1,
      automationRate: 'a-rate'
    }];
  }

  public process(inputs: Inputs, outputs: Outputs, _parameters: Parameters): boolean {
    const input  = inputs[0];
    const output = outputs[0];

    for (let channel = 0, len = input.length; channel < len; channel++) {
      const i = input[channel];
      const o = output[channel];

      if (i) {
        i.set(o);
      }
    }

    return true;
  }
}

describe(createModule.name, () => {
  test('should Data URL for AudioWorklet', () => {
    // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
    expect(createModule(CustomProcessor)).toBe('data:text/javascript,class%20CustomProcessor%20extends%20AudioWorkletProcessor%20%7B%0A%20%20%20%20static%20get%20parameterDescriptors()%20%7B%0A%20%20%20%20%20%20%20%20return%20%5B%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20name%3A%20\'depth\'%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20defaultValue%3A%200%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20minValue%3A%200%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20maxValue%3A%201%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20automationRate%3A%20\'a-rate\'%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%5D%3B%0A%20%20%20%20%7D%0A%20%20%20%20process(inputs%2C%20outputs%2C%20_parameters)%20%7B%0A%20%20%20%20%20%20%20%20const%20input%20%3D%20inputs%5B0%5D%3B%0A%20%20%20%20%20%20%20%20const%20output%20%3D%20outputs%5B0%5D%3B%0A%20%20%20%20%20%20%20%20for%20(let%20channel%20%3D%200%2C%20len%20%3D%20input.length%3B%20channel%20%3C%20len%3B%20channel%2B%2B)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20const%20i%20%3D%20input%5Bchannel%5D%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20const%20o%20%3D%20output%5Bchannel%5D%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20if%20(i)%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20i.set(o)%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20return%20true%3B%0A%20%20%20%20%7D%0A%7D; registerProcessor(\'CustomProcessor\', CustomProcessor)');
  });
});

describe(addAudioWorklet.name, () => {
  test('should add `AudioWorklet` and return `Promise`', () => {
    const context = new AudioContextMock();

    // @ts-expect-error Because there is not Web Audio API in Jest environment (Node.js environment), mocks Web Audio API
    expect(addAudioWorklet(context, CustomProcessor)).toBeInstanceOf(Promise);
  });
});
