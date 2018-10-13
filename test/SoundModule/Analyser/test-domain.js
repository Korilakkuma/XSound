'use strict';

import { Analyser } from '../../../src/SoundModule/Analyser';
import { TimeOverview } from '../../../src/SoundModule/Analyser/TimeOverview';
import { Time } from '../../../src/SoundModule/Analyser/Time';
import { FFT } from '../../../src/SoundModule/Analyser/FFT';

describe('Analyser TEST', () => {
    describe('Analyser#domain', () => {
        const analyser = new Analyser(audiocontext);

        it('should return one of `TimeOverview`, `Time`, `FFT`, `Analyser`', () => {
            expect(analyser.domain('timeOverviewL')).toEqual(jasmine.any(TimeOverview));
            expect(analyser.domain('timeOverviewR')).toEqual(jasmine.any(TimeOverview));
            expect(analyser.domain('time')).toEqual(jasmine.any(Time));
            expect(analyser.domain('fft')).toEqual(jasmine.any(FFT));
            expect(analyser.domain()).toEqual(jasmine.any(Analyser));
            expect(analyser.domain('')).toEqual(jasmine.any(Analyser));
        });
    });
});
