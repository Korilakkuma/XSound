#include <stdlib.h>

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#endif

#define absf(f) (f >= 0 ? f : (0 - f))

static const int buffer_size = 128;

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
    // input[n]: Amplitude is equal to argument.
    //        0: Because signal is detected as background noise, amplitude is `0`.
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
