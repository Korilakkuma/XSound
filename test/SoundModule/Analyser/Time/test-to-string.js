'use strict';

import Time from '../../../../src/SoundModule/Analyser/Time';

describe('Time TEST', () => {
    describe('Time#toString', () => {
        const time = new Time(audiocontext.sampleRate);

        it('should return "[SoundModule Analyser Time]"', () => {
            expect(time.toString()).toEqual('[SoundModule Analyser Time]');
        });
    });
});
