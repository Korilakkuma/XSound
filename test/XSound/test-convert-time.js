'use strict';

describe('XSound TEST', () => {
    describe('XSound.convertTime', () => {
        // Negative
        it('should return `undefined`', () => {
            expect(X.convertTime()).toBeUndefined();
            expect(X.convertTime(-1)).toBeUndefined();
        });

        // Positive
        it('should return associative array', () => {
            const times1 = X.convertTime(0);

            expect(times1.minutes).toEqual(0);
            expect(times1.seconds).toEqual(0);
            expect(times1.milliseconds).toEqual(0);

            const times2 = X.convertTime(61.1);

            expect(times2.minutes).toEqual(1);
            expect(times2.seconds).toEqual(1);
            expect((Math.floor(times2.milliseconds * 10) / 10)).toEqual(0.1);
        });
    });
});
