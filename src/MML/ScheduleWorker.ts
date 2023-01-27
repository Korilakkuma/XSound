import { MMLScheduleWorkerEventData } from '../types';

export const schedule = () => {
  let timerId: number | null = null;

  self.onmessage = (event: MessageEvent<MMLScheduleWorkerEventData>) => {
    switch (event.data.type) {
      case 'schedule':
        if (typeof event.data.duration === 'number') {
          timerId = self.setTimeout(() => {
            const message: MMLScheduleWorkerEventData =  { type: 'next' };

            self.postMessage(message);
          }, (event.data.duration * 1000));
        }

        break;
      case 'next':
        break;
      case 'stop':
        if (timerId !== null) {
          self.clearTimeout(timerId);
          self.close();
          timerId = null;
        }

        break;
      default:
        break;
    }
  };
};
