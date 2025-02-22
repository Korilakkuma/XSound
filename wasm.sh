#!/bin/sh

# Usage: ./wasm.sh src/**/*.cpp

echo "rm -f src/**/*.wasm"
rm -f src/**/*.wasm

for source in "$@"
do
  target=$(echo "${source}" | sed 's/\.cpp$//')
  echo "emcc -O3 -Wall --no-entry -o ${target}.wasm ${source}"
  emcc -O3 -Wall --no-entry -o "${target}.wasm" "${source}"
done
