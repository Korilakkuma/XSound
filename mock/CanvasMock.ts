export const canvasMock = document.createElement('canvas');

Object.defineProperty(canvasMock, 'getContext', {
  configurable: true,
  writable    : false,
  value       : () => {
    return {
      beginPath: () => {},
      clearRect: () => {},
      lineTo   : () => {},
      moveTo   : () => {},
      stroke   : () => {}
    };
  }
});

Object.defineProperty(canvasMock, 'toDataURL', {
  configurable: true,
  writable    : true,
  value       : () => {}
});
