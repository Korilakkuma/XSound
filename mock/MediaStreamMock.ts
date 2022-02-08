export class MediaStreamMock {
}

Object.defineProperty(window, 'MediaStream', {
  configurable: true,
  writable    : false,
  value       : MediaStreamMock
});
