'use strict';

import { ProcessorModule } from '../../src/ProcessorModule';

describe('ProcessorModule TEST', () => {
    describe('ProcessorModule#toString', () => {
        const processorModule = new ProcessorModule(audiocontext);

        it('should return "[ProcessorModule]"', () => {
            expect(processorModule.toString()).toEqual('[ProcessorModule]');
        });
    });
});
