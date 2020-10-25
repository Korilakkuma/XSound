'use strict';

describe('XSound TEST', () => {
    describe('XSound.FFT, XSound.IFFT', () => {
        const reals = new Float32Array([Math.sin(0), Math.sin(1), Math.sin(2), Math.sin(3)]);
        const imags = new Float32Array([0, 0, 0, 0]);
        const size  = 4;

        it('should result as FFT and IFFT', () => {
            X.FFT(reals, imags, size);

            [1.8918883800506592, -0.9092974066734314, -0.07329356670379639, -0.9092974066734314].forEach((expected, index) => {
                expect(reals[index]).toBeCloseTo(expected, 3);
            });

            [0, -0.7003509402275085, 0, 0.7003509402275085].forEach((expected, index) => {
                expect(imags[index]).toBeCloseTo(expected, 3);
            });

            X.IFFT(reals, imags, size);

            [Math.sin(0), Math.sin(1), Math.sin(2), Math.sin(3)].forEach((expected, index) => {
                expect(reals[index]).toBeCloseTo(expected, 3);
            });

            [0, 0, 0, 0].forEach((expected, index) => {
                expect(imags[index]).toBeCloseTo(expected, 3);
            });
        });
    });
});
