export const canvasMock = document.createElement('canvas');

Object.defineProperty(canvasMock, 'getContext', {
  configurable: true,
  writable    : false,
  value       : () => {
    return {
      clearRect: () => {}
    };
  }
});

Object.defineProperty(canvasMock, 'toDataURL', {
  configurable: true,
  writable    : true,
  value       : () => {}
});
