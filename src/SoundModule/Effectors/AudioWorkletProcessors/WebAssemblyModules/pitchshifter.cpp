#include "FFT.hpp"

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#endif

static float *inputs  = nullptr;
static float *outputs = nullptr;

#ifdef __cplusplus
extern "C" {
#endif

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
float *pitchshifter(const float pitch, const float speed, const size_t fft_size, const size_t time_cursor) {
  if (outputs) {
    free(outputs);
  }

  outputs = (float*)calloc(fft_size, sizeof(float));

  float *reals = (float*)calloc(fft_size, sizeof(float));
  float *imags = (float*)calloc(fft_size, sizeof(float));

  float *window = (float*)calloc(fft_size, sizeof(float));

  window_function(window, fft_size, HANNING);

  for (int n = 0; n < fft_size; n++) {
    reals[n] = window[n] * inputs[n];
    imags[n] = 0.0f;
  }

  FFT(reals, imags, fft_size);

  const size_t half_fft_size = fft_size / 2;
  const size_t buffer_size   = half_fft_size + 1;

  float *magnitudes = (float *)calloc(buffer_size, sizeof(float));
  int *peak_indexes = (int *)calloc(buffer_size, sizeof(int));

  for (int k = 0; k < buffer_size; k++) {
    magnitudes[k] = (reals[k] * reals[k]) + (imags[k] * imags[k]);
  }

  int number_of_peaks = 0;

  // Find peaks
  int index = 2;

  const size_t end = half_fft_size + 1 - 2;

  while (index < end) {
    float magnitude = magnitudes[index];

    if ((magnitudes[index - 1] >= magnitude) || (magnitudes[index - 2] >= magnitude)) {
      ++index;
      continue;
    }

    if ((magnitudes[index + 1] >= magnitude) || (magnitudes[index + 2] >= magnitude)) {
      ++index;
      continue;
    }

    peak_indexes[number_of_peaks++] = index;

    index += 2;
  }

  // Shift peaks
  float *shifted_reals = (float*)calloc(fft_size, sizeof(float));
  float *shifted_imags = (float*)calloc(fft_size, sizeof(float));

  for (int k = 0; k < number_of_peaks; k++) {
    const int peak_index = peak_indexes[k];

    const int shifted_peak_index = roundf(peak_index * pitch * (1 / speed));

    if (shifted_peak_index > buffer_size) {
      break;
    }

    int start_index = 0;
    int end_index   = fft_size;

    if (k > 0) {
      const int peak_index_before = peak_indexes[k - 1];

      start_index = peak_index - floorf((float)(peak_index - peak_index_before) / 2.0f);
    }

    if (k < (number_of_peaks - 1)) {
      const int peak_index_after = peak_indexes[k + 1];

      end_index = peak_index + ceilf((float)(peak_index_after - peak_index) / 2.0f);
    }

    const int start_offset = start_index - peak_index;
    const int end_offset   = end_index - peak_index;

    for (int m = start_offset; m < end_offset; m++) {
      const int bin_count_index = peak_index + m;

      const int shifted_bin_count_index = shifted_peak_index + m;

      if (shifted_bin_count_index >= buffer_size) {
        break;
      }

      const float omega = (2.0f * M_PI * (shifted_bin_count_index - bin_count_index)) / fft_size;

      const float shifted_real = cosf(omega * time_cursor);
      const float shifted_imag = sinf(omega * time_cursor);

      shifted_reals[shifted_bin_count_index] += (reals[bin_count_index] * shifted_real) - (imags[bin_count_index] * shifted_imag);
      shifted_imags[shifted_bin_count_index] += (reals[bin_count_index] * shifted_imag) + (imags[bin_count_index] * shifted_real);
    }
  }

  free(reals);
  free(imags);
  free(magnitudes);
  free(peak_indexes);

  for (int k = 1; k < half_fft_size; k++) {
    shifted_reals[fft_size - k] = 0.0f + shifted_reals[k];
    shifted_imags[fft_size - k] = 0.0f - shifted_imags[k];
  }

  IFFT(shifted_reals, shifted_imags, fft_size);

  for (int n = 0; n < fft_size; n++) {
    outputs[n] = window[n] * shifted_reals[n];
  }

  free(shifted_reals);
  free(shifted_imags);
  free(window);

  return outputs;
}

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
float *alloc_memory_inputs(const size_t buffer_size) {
  if (inputs) {
    free(inputs);
  }

  inputs = (float *)calloc(buffer_size, sizeof(float));

  return inputs;
}

#ifdef __cplusplus
}
#endif
