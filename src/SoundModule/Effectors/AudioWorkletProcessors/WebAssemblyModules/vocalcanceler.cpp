#include "constants.hpp"

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#endif

static float *inputLs  = NULL;
static float *inputRs  = NULL;
static float *outputLs = NULL;
static float *outputRs = NULL;

#ifdef __cplusplus
extern "C" {
#endif

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
float *vocalcancelerL(const float depth) {
  if (outputLs) {
    free(outputLs);
  }

  outputLs = (float *)calloc(buffer_size, sizeof(float));

  for (int n = 0; n < buffer_size; n++) {
    outputLs[n] = inputLs[n] - (depth * inputRs[n]);
  }

  return outputLs;
}
#endif

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
float *vocalcancelerR(const float depth) {
  if (outputRs) {
    free(outputRs);
  }

  outputRs = (float *)calloc(buffer_size, sizeof(float));

  for (int n = 0; n < buffer_size; n++) {
    outputRs[n] = inputRs[n] - (depth * inputLs[n]);
  }

  return outputRs;
}
#endif

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
float *alloc_memory_inputLs(void) {
  if (inputLs) {
    free(inputLs);
  }

  inputLs = (float *)calloc(buffer_size, sizeof(float));

  return inputLs;
}

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
float *alloc_memory_inputRs(void) {
  if (inputRs) {
    free(inputRs);
  }

  inputRs = (float *)calloc(buffer_size, sizeof(float));

  return inputRs;
}

#ifdef __cplusplus
}
#endif
