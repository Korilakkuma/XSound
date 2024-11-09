#include <stdlib.h>
#include <math.h>

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#endif

static float *reals = NULL;
static float *imags = NULL;

#ifdef __cplusplus
extern "C" {
#endif

static inline int pow2(const int n) {
  if (n == 0) {
    return 1;
  }

  return 2 << (n - 1);
}

static inline void swap(float *const reals, float *const imags, const int i, const int k) {
  float tmp_real;
  float tmp_imag;

  tmp_real = reals[i];
  tmp_imag = imags[i];

  reals[i] = reals[k];
  imags[i] = imags[k];

  reals[k] = tmp_real;
  imags[k] = tmp_imag;
}

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
void FFT(const size_t size) {
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
        float w_imag = 0 - sinf(w / size);

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

  int *index = (int *)calloc(size, sizeof(int));

  for (int stage = 1; stage <= number_of_stages; stage++) {
    int rest = number_of_stages - stage;

    for (int i = 0; i < pow2(stage - 1); i++) {
      index[pow2(stage - 1) + i] = index[i] + pow2(rest);
    }
  }

  for (int k = 0; k < size; k++) {
    if (index[k] <= k) {
      continue;
    }

    swap(reals, imags, index[k], k);
  }

  free(index);
}

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
void IFFT(const size_t size) {
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

  int *index = (int *)calloc(size, sizeof(int));

  for (int stage = 1; stage <= number_of_stages; stage++) {
    int rest = number_of_stages - stage;

    for (int i = 0; i < pow2(stage - 1); i++) {
      index[pow2(stage - 1) + i] = index[i] + pow2(rest);
    }
  }

  for (int k = 0; k < size; k++) {
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

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
float *alloc_memory_reals(const size_t buffer_size) {
  if (reals) {
    free(reals);
  }

  reals = (float *)calloc(buffer_size, sizeof(float));

  return reals;
}

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
float *alloc_memory_imags(const size_t buffer_size) {
  if (imags) {
    free(imags);
  }

  imags = (float *)calloc(buffer_size, sizeof(float));

  return imags;
}

#ifdef __cplusplus
}
#endif
