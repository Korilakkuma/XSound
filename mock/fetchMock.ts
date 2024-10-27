Object.defineProperty(window, 'fetch', {
  configurable: true,
  writable    : false,
  value       : () => {
    return Promise.resolve({
      arrayBuffer: () => {
        return Promise.resolve(new ArrayBuffer(1024));
      }
    });
  }
});
