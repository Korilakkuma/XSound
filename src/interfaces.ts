import { Visualizer } from './SoundModule/Analyser/Visualizer';
import { Effector } from './SoundModule/Effectors/Effector';
import { Oscillator } from './OscillatorModule/Oscillator';

/**
 * This interface is implemented by some classes that abstract `AudioNode` connections (such as `Effector` class).
 *
 * @interface
 */
export interface Connectable {
  get INPUT(): AudioNode | null;
  get OUTPUT(): AudioNode | null;
}

/**
 * This interface is implemented by some classes that have active or inactive status.
 *
 * @interface
 */
export interface Statable {
  state(): boolean;
  activate(): Visualizer | Effector | Oscillator;
  deactivate(): Visualizer | Effector | Oscillator;
}
