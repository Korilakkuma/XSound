#include <stdlib.h>
#include <math.h>

typedef enum {
  RECTANGULAR,
  HANNING,
  HAMMING
} WINDOW_FUNCTION;

static void window_function(float *const window, const size_t size, const WINDOW_FUNCTION function) {
  switch (function) {
    case HANNING: {
      for (int n = 0; n < size; n++) {
        if (n & 0x00000001) {
          window[n] = 0.5f - (0.5f * cosf(((2.0f * M_PI) * (n + 0.5f)) / size));
        } else {
          window[n] = 0.5f - (0.5f * cosf(((2.0f * M_PI) * n) / size));
        }
      }

      break;
    }

    case HAMMING: {
      for (int n = 0; n < size; n++) {
        if (n & 0x00000001) {
          window[n] = 0.54f - (0.46f * cosf(((2.0f * M_PI) * (n + 0.5f)) / size));
        } else {
          window[n] = 0.54f - (0.46f * cosf(((2.0f * M_PI) * n) / size));
        }
      }

      break;
    }

    case RECTANGULAR: {
      for (int n = 0; n < size; n++) {
        window[n] = 1.0f;
      }

      break;
    }
  }
}

static inline int pow2(const int n) {
  if (n == 0) {
    return 1;
  }

  return 2 << (n - 1);
}

static inline void swap(float *const reals, float *const imags, const size_t i, const size_t k) {
  float tmp_real;
  float tmp_imag;

  tmp_real = reals[i];
  tmp_imag = imags[i];

  reals[i] = reals[k];
  imags[i] = imags[k];

  reals[k] = tmp_real;
  imags[k] = tmp_imag;
}

static void FFT(float *const reals, float *const imags, const size_t size) {
  int number_of_stages = (int)log2f((float)size);

  for (int stage = 1; stage <= number_of_stages; stage++) {
    for (int i = 0; i < pow2(stage - 1); i++) {
      int rest = number_of_stages - stage;

      for (int j = 0; j < pow2(rest); j++) {
        int n = i * pow2(rest + 1) + j;
        int m = pow2(rest) + n;

        float w = 2.0f * M_PI * j * pow2(stage - 1);

        float e_real = reals[n];
        float e_imag = imags[n];
        float o_real = reals[m];
        float o_imag = imags[m];
        float w_real = cosf(w / size);
        float w_imag = 0.0f - sinf(w / size);

        if (stage < number_of_stages) {
          reals[n] = e_real + o_real;
          imags[n] = e_imag + o_imag;
          reals[m] = (w_real * (e_real - o_real)) - (w_imag * (e_imag - o_imag));
          imags[m] = (w_real * (e_imag - o_imag)) + (w_imag * (e_real - o_real));
        } else {
          reals[n] = e_real + o_real;
          imags[n] = e_imag + o_imag;
          reals[m] = e_real - o_real;
          imags[m] = e_imag - o_imag;
        }
      }
    }
  }

  size_t *index = (size_t *)calloc(size, sizeof(size_t));

  for (int stage = 1; stage <= number_of_stages; stage++) {
    int rest = number_of_stages - stage;

    for (int i = 0; i < pow2(stage - 1); i++) {
      index[(size_t)(pow2(stage - 1) + i)] = index[i] + (size_t)pow2(rest);
    }
  }

  for (size_t k = 0; k < size; k++) {
    if (index[k] <= k) {
      continue;
    }

    swap(reals, imags, index[k], k);
  }

  free(index);
}

static void IFFT(float *const reals, float *const imags, const size_t size) {
  int number_of_stages = (int)log2f((float)size);

  for (int stage = 1; stage <= number_of_stages; stage++) {
    for (int i = 0; i < pow2(stage - 1); i++) {
      int rest = number_of_stages - stage;

      for (int j = 0; j < pow2(rest); j++) {
        int n = i * pow2(rest + 1) + j;
        int m = pow2(rest) + n;

        float w = 2.0f * M_PI * j * pow2(stage - 1);

        float e_real = reals[n];
        float e_imag = imags[n];
        float o_real = reals[m];
        float o_imag = imags[m];
        float w_real = cosf(w / size);
        float w_imag = sinf(w / size);

        if (stage < number_of_stages) {
          reals[n] = e_real + o_real;
          imags[n] = e_imag + o_imag;
          reals[m] = (w_real * (e_real - o_real)) - (w_imag * (e_imag - o_imag));
          imags[m] = (w_real * (e_imag - o_imag)) + (w_imag * (e_real - o_real));
        } else {
          reals[n] = e_real + o_real;
          imags[n] = e_imag + o_imag;
          reals[m] = e_real - o_real;
          imags[m] = e_imag - o_imag;
        }
      }
    }
  }

  size_t *index = (size_t *)calloc(size, sizeof(size_t));

  for (int stage = 1; stage <= number_of_stages; stage++) {
    int rest = number_of_stages - stage;

    for (int i = 0; i < pow2(stage - 1); i++) {
      index[(size_t)(pow2(stage - 1) + i)] = index[i] + (size_t)pow2(rest);
    }
  }

  for (size_t k = 0; k < size; k++) {
    if (index[k] <= k) {
      continue;
    }

    swap(reals, imags, index[k], k);
  }
  for (int k = 0; k < size; k++) {
    reals[k] /= size;
    imags[k] /= size;
  }

  free(index);
}
