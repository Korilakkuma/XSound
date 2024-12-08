#include "constants.hpp"

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#endif

#define absf(f) (f >= 0 ? f : (0 - f))

static float *inputs  = NULL;
static float *outputs = NULL;

#ifdef __cplusplus
extern "C" {
#endif

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
float *noisegate(const float level) {
  if (outputs) {
    free(outputs);
  }

  outputs = (float *)calloc(buffer_size, sizeof(float));

  for (int n = 0; n < buffer_size; n++) {
    // input[n]: If amplitude is greater than `level`.
    //        0: Otherwise, signal is detected as background noise (amplitude is `0`).
    if (absf(inputs[n]) > level) {
      outputs[n] = inputs[n];
    } else {
      outputs[n] = 0.0f;
    }
  }

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
