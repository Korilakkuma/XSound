'use strict';

import { TimeOverview } from '../../../../src/SoundModule/Analyser/TimeOverview';

describe('TimeOverview TEST', () => {
    describe('TimeOverview#toString', () => {
        const timeOverview = new TimeOverview(audiocontext.sampleRate);

        it('should return "[SoundModule Analyser TimeOverview]"', () => {
            expect(timeOverview.toString()).toEqual('[SoundModule Analyser TimeOverview]');
        });
    });
});
