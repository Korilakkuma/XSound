#include <math.h>

typedef enum {
  RECTANGULAR,
  HANNING,
  HAMMING
} WINDOW_FUNCTION;

static void hanning_window(float *const inputs, const size_t size);
static void hamming_window(float *const inputs, const size_t size);

static void window_function(float *const inputs, const size_t size, const WINDOW_FUNCTION function) {
  switch (function) {
    case HANNING: {
      hanning_window(inputs, size);
      break;
    }

    case HAMMING: {
      hamming_window(inputs, size);
      break;
    }

    case RECTANGULAR: {
      break;
    }
  }
}

static void hanning_window(float *const inputs, const size_t size) {
  float *window_function = (float *)calloc(size, sizeof(float));

  for (int n = 0; n < size; n++) {
    if (n & 0x00000001) {
      window_function[n] = 0.5 - (0.5 * cosf(((2 * M_PI) * (n + 0.5)) / size));
    } else {
      window_function[n] = 0.5 - (0.5 * cosf(((2 * M_PI) * n) / size));
    }
  }

  for (int n = 0; n < size; n++) {
    inputs[n] *= window_function[n];
  }

  free(window_function);
}

static void hamming_window(float *const inputs, const size_t size) {
  float *window_function = (float *)calloc(size, sizeof(float));

  for (int n = 0; n < size; n++) {
    if (n & 0x00000001) {
      window_function[n] = 0.54 - (0.46 * cosf(((2 * M_PI) * (n + 0.5)) / size));
    } else {
      window_function[n] = 0.54 - (0.46 * cosf(((2 * M_PI) * n) / size));
    }
  }

  for (int n = 0; n < size; n++) {
    inputs[n] *= window_function[n];
  }

  free(window_function);
}
