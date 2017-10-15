'use strict';

import Filter from '../../../src/SoundModule/Filter';

describe('Filter TEST', () => {
    describe('Filter#toJSON', () => {
        const filter = new Filter(audiocontext, 1024);

        it('should return JSON', () => {
            expect(filter.toJSON()).toEqual('{"state":false,"type":"lowpass","frequency":350,"Q":1,"gain":0,"range":0.1,"attack":0.01,"decay":0.3,"sustain":1,"release":1}');
        });
    });
});
