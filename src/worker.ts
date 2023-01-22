/**
 * This function returns worker script as string by removing container string.
 * @param {string} workerContainerString This argument is string that contains worker script.
 * @return {string} Return value is worker script as string.
 */
export function extractWorkerString(workerContainerString: string): string {
  return workerContainerString.replace(/^.+?\{/s, '').replace(/\};?$/s, '');
}

/**
 * This function returns worker script as `Blob` by removing container string.
 * @param {string} workerContainerString This argument is string that contains worker script.
 * @return {Blob} Return value is worker script as `Blob`.
 */
export function createWorkerBlob(workerContainerString: string): Blob {
  return new Blob([extractWorkerString(workerContainerString)], { type: 'text/javascript' });
}

/**
 * This function returns worker script as Object URL by removing container string.
 * @param {string} workerContainerString This argument is string that contains worker script.
 * @return {string} Return value is worker script as Object URL.
 */
export function createWorkerObjectURL(workerContainerString: string): string {
  return window.URL.createObjectURL(createWorkerBlob(workerContainerString));
}
