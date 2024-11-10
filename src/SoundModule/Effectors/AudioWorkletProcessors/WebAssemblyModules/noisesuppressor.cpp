#include "constants.hpp"
#include "FFT.hpp"

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#endif

static float *inputs  = NULL;
static float *outputs = NULL;

#ifdef __cplusplus
extern "C" {
#endif

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
float *noisesuppressor(const float threshold) {
  if (outputs) {
    free(outputs);
  }

  outputs = (float *)calloc(buffer_size, sizeof(float));

  float *input_reals  = (float *)calloc(buffer_size, sizeof(float));
  float *input_imags  = (float *)calloc(buffer_size, sizeof(float));
  float *output_reals = (float *)calloc(buffer_size, sizeof(float));
  float *output_imags = (float *)calloc(buffer_size, sizeof(float));

  float *amplitudes = (float *)calloc(buffer_size, sizeof(float));
  float *phases     = (float *)calloc(buffer_size, sizeof(float));

  for (int n = 0; n < buffer_size; n++) {
    input_reals[n] = inputs[n];
    input_imags[n] = 0.0f;
  }

  FFT(input_reals, input_imags, buffer_size);

  for (int k = 0; k < buffer_size; k++) {
    amplitudes[k] = sqrtf((input_reals[k] * input_reals[k]) + (input_imags[k] * input_imags[k]));

    if ((input_imags[k] != 0.0f) && (input_reals[k] != 0.0f)) {
      phases[k] = atan2f(input_imags[k], input_reals[k]);
    }
  }

  for (int k = 0; k < buffer_size; k++) {
    amplitudes[k] -= threshold;

    if (amplitudes[k] < 0.0f) {
      amplitudes[k] = 0.0f;
    }
  }

  for (int k = 0; k < buffer_size; k++) {
    output_reals[k] = amplitudes[k] * cosf(phases[k]);
    output_imags[k] = amplitudes[k] * sinf(phases[k]);
  }

  IFFT(output_reals, output_imags, buffer_size);

  for (int n = 0; n < buffer_size; n++) {
    outputs[n] = output_reals[n];
  }

  free(input_reals);
  free(input_imags);
  free(output_reals);
  free(output_imags);
  free(amplitudes);
  free(phases);

  return outputs;
}

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
float *alloc_memory_inputs(void) {
  if (inputs) {
    free(inputs);
  }

  inputs = (float *)calloc(buffer_size, sizeof(float));

  return inputs;
}

#ifdef __cplusplus
}
#endif
