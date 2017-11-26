'use strict';

describe('XSound TEST', () => {
    describe('XSound.get', () => {
        it('should return the instance of `AudioContext`', () => {
            expect(X.get()).toEqual(jasmine.any(AudioContext));
        });
    });
});
