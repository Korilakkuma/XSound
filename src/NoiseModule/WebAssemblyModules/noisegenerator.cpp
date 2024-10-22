#include <stdlib.h>

#ifdef __EMSCRIPTEN__
#include <emscripten.h>
#endif

static const int buffer_size = 128;

static float *outputs = NULL;

static float b0 = 0.0f;
static float b1 = 0.0f;
static float b2 = 0.0f;
static float b3 = 0.0f;
static float b4 = 0.0f;
static float b5 = 0.0f;
static float b6 = 0.0f;

static float last_out = 0.0f;

#ifdef __cplusplus
extern "C" {
#endif

static inline float generate_normalized_rand(void) {
  return (float)rand() / ((float)RAND_MAX + 1.0f);
}

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
float *whitenoise(const unsigned int time) {
  if (outputs) {
    free(outputs);
  }

  srand(time);

  outputs = (float *)calloc(buffer_size, sizeof(float));

  for (int n = 0; n < buffer_size; n++) {
    outputs[n] = (float)((2.0f * generate_normalized_rand()) - 1.0f);
  }

  return outputs;
}

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
float *pinknoise(const unsigned int time) {
  if (outputs) {
    free(outputs);
  }

  srand(time);

  outputs = (float *)calloc(buffer_size, sizeof(float));

  // ref: https://noisehack.com/generate-noise-web-audio-api/#pink-noise
  for (int n = 0; n < buffer_size; n++) {
    float white = (float)((2.0f * generate_normalized_rand()) - 1.0f);

    b0 = (0.99886f * b0) + (white * 0.0555179f);
    b1 = (0.99332f * b1) + (white * 0.0750759f);
    b2 = (0.96900f * b2) + (white * 0.1538520f);
    b3 = (0.86650f * b3) + (white * 0.3104856f);
    b4 = (0.55000f * b4) + (white * 0.5329522f);
    b5 = (-0.7616f * b5) - (white * 0.0168980f);

    outputs[n] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + (white * 0.5362f);
    outputs[n] *= 0.11f;

    b6 = white * 0.115926f;
  }

  return outputs;
}

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_KEEPALIVE
#endif
float *browniannoise(const unsigned int time) {
  if (outputs) {
    free(outputs);
  }

  srand(time);

  outputs = (float *)calloc(buffer_size, sizeof(float));

  // ref: https://noisehack.com/generate-noise-web-audio-api/#brownian-noise
  for (int n = 0; n < buffer_size; n++) {
    float white = (float)((2.0f * generate_normalized_rand()) - 1.0f);

    outputs[n] = (last_out + (0.02f * white)) / 1.02f;

    last_out = outputs[n];

    outputs[n] *= 3.5f;
  }

  return outputs;
}

#ifdef __cplusplus
}
#endif
