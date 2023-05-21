export type MMLScheduleWorkerMessageEventType = 'schedule' | 'next' | 'stop';

export type MMLScheduleWorkerMessageEventData = {
  type: MMLScheduleWorkerMessageEventType,
  duration?: number
};

export const schedule = () => {
  let timerId: number | null = null;

  self.onmessage = (event: MessageEvent<MMLScheduleWorkerMessageEventData>) => {
    switch (event.data.type) {
      case 'schedule':
        if (typeof event.data.duration === 'number') {
          timerId = self.setTimeout(() => {
            const message: MMLScheduleWorkerMessageEventData = { type: 'next' };

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
