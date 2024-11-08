Object.defineProperty(WebAssembly, 'instantiateStreaming', {
  configurable: true,
  writable    : false,
  value       : () => {
    return Promise.resolve({});
  }
});
