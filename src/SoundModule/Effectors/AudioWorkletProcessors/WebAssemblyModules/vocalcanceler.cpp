#include "constants.hpp"
#include "FFT.hpp"

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#endif

// Safe positive minimum on `float` (6 digits)
static const float minimum_amplitude = 0.000001f;

static float *inputLs  = NULL;
static float *inputRs  = NULL;
static float *outputLs = NULL;
static float *outputRs = NULL;
static float *outputs  = NULL;

#ifdef __cplusplus
extern "C" {
#endif

static inline float complex_abs(const float real, const float imag) {
  return sqrtf(powf(real, 2.0f) + powf(imag, 2.0f));
}

static inline float complex_arg(const float real, const float imag) {
  return atan2f(imag, real);
}

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
float *vocalcanceler_on_spectrum(const float sample_rate, const float min_frequency, const float max_frequency, const float threshold) {
  if (outputs) {
    free(outputs);
  }

  float *realLs = (float *)calloc(buffer_size, sizeof(float));
  float *realRs = (float *)calloc(buffer_size, sizeof(float));
  float *imagLs = (float *)calloc(buffer_size, sizeof(float));
  float *imagRs = (float *)calloc(buffer_size, sizeof(float));

  window_function(inputLs, buffer_size, RECTANGULAR);
  window_function(inputRs, buffer_size, RECTANGULAR);

  for (int n = 0; n < buffer_size; n++) {
    realLs[n] = inputLs[n];
    realRs[n] = inputRs[n];
    imagLs[n] = 0.0f;
    imagRs[n] = 0.0f;
  }

  FFT(realLs, imagLs, buffer_size);
  FFT(realRs, imagRs, buffer_size);

  float *absLs = (float *)calloc(buffer_size, sizeof(float));
  float *absRs = (float *)calloc(buffer_size, sizeof(float));
  float *argLs = (float *)calloc(buffer_size, sizeof(float));
  float *argRs = (float *)calloc(buffer_size, sizeof(float));

  for (int k = 0; k < buffer_size; k++) {
    absLs[k] = complex_abs(realLs[k], imagLs[k]);
    absRs[k] = complex_abs(realRs[k], imagRs[k]);
    argLs[k] = complex_arg(realLs[k], imagLs[k]);
    argRs[k] = complex_arg(realRs[k], imagRs[k]);
  }

  int min = (int)(min_frequency * (buffer_size / sample_rate));
  int max = (int)(max_frequency * (buffer_size / sample_rate));

  for (int k = min; k < max; k++) {
    float numerator   = powf((absLs[k] - absRs[k]), 2.0f);
    float denominator = powf((absLs[k] + absRs[k]), 2.0f);

    if (denominator != 0.0f) {
      float diff = numerator / denominator;

      if (diff < threshold) {
        absLs[k] = minimum_amplitude;
        absRs[k] = minimum_amplitude;

        absLs[buffer_size - k] = absLs[k];
        absRs[buffer_size - k] = absRs[k];
      }
    }
  }

  // Euler's formula
  // abs * exp(j * arg) = abs * (cos(arg) + j * sin(arg))
  for (int k = 0; k < buffer_size; k++) {
    realLs[k] = absLs[k] * cosf(argLs[k]);
    realRs[k] = absRs[k] * cosf(argRs[k]);
    imagLs[k] = absLs[k] * sinf(argLs[k]);
    imagRs[k] = absRs[k] * sinf(argRs[k]);
  }

  free(absLs);
  free(absRs);
  free(argLs);
  free(argRs);

  IFFT(realLs, imagLs, buffer_size);
  IFFT(realRs, imagRs, buffer_size);

  // Unify left channel data and right channel data
  outputs = (float *)calloc((2 * buffer_size), sizeof(float));

  for (int n = 0; n < buffer_size; n++) {
    outputs[n] = realLs[n];
  }

  for (int n = 0; n < buffer_size; n++) {
    outputs[buffer_size + n] = realRs[n];
  }

  free(realLs);
  free(realRs);
  free(imagLs);
  free(imagRs);

  return outputs;
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
