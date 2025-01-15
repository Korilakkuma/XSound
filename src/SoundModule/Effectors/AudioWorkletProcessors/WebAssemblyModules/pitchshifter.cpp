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
float *pitchshifter(const float pitch) {
  if (outputs) {
    free(outputs);
  }

  outputs = (float *)calloc(buffer_size, sizeof(float));

  float *input_reals  = (float *)calloc(buffer_size, sizeof(float));
  float *input_imags  = (float *)calloc(buffer_size, sizeof(float));
  float *output_reals = (float *)calloc(buffer_size, sizeof(float));
  float *output_imags = (float *)calloc(buffer_size, sizeof(float));

  window_function(inputs, buffer_size, RECTANGULAR);

  for (int n = 0; n < buffer_size; n++) {
    input_reals[n] = inputs[n];
    input_imags[n] = 0.0f;
  }

  FFT(input_reals, input_imags, buffer_size);

  int half_buffer_size = buffer_size / 2;

  for (int k = 0; k < buffer_size; k++) {
    int offset = (int)floorf(pitch * k);

    int eq = 1;

    if (k > half_buffer_size) {
      eq = 0;
    }

    if ((offset >= 0) && (offset < buffer_size)) {
      output_reals[offset] += 2.0f * eq * input_reals[k];
      output_imags[offset] += 2.0f * eq * input_imags[k];
    }
  }

  IFFT(output_reals, output_imags, buffer_size);

  for (int n = 0; n < buffer_size; n++) {
    outputs[n] = output_reals[n];
  }

  free(input_reals);
  free(input_imags);
  free(output_reals);
  free(output_imags);

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
