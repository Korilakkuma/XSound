'use strict';

/**
 * This class (static) method gets audio data as `ArrayBuffer` by Ajax.
 * @param {string} url This argument is URL for audio resource.
 * @param {type} string This argument is response type that is one of 'text', 'arraybuffer', 'blob', 'document', 'json'. The default value is 'arraybuffer'.
 * @param {number} timeout This argument is timeout of Ajax. The default value is 60000 msec (1 minutes).
 * @param {function} successCallback This argument is invoked as next process when reading file is successful.
 * @param {function} errorCallback This argument is invoked when error occurred.
 * @param {function} progressCallback This argument is invoked during receiving audio data.
 */
export function ajax(url, type, timeout, successCallback, errorCallback, progressCallback) {
    // The argument is associative array ?
    if (Object.prototype.toString.call(arguments[0]) === '[object Object]') {
        const properties = arguments[0];

        if ('url' in properties) {
            url = properties.url;
        }

        if ('type' in properties) {
            type = properties.type;
        }

        if ('timeout' in properties) {
            timeout = properties.timeout;
        }

        if ('success' in properties) {
            successCallback = properties.success;
        }

        if ('error' in properties) {
            errorCallback = properties.error;
        }

        if ('progress' in properties) {
            progressCallback = properties.progress;
        }
    }

    // for errorCallback
    const ERROR_AJAX         = 'error';
    const ERROR_AJAX_TIMEOUT = 'timeout';

    const xhr = new XMLHttpRequest();

    const t = parseInt(timeout, 10);

    xhr.timeout = (t > 0) ? t : 60000;

    xhr.ontimeout = event => {
        if (Object.prototype.toString.call(errorCallback) === '[object Function]') {
            errorCallback(event, ERROR_AJAX_TIMEOUT);
        }
    };

    xhr.onprogress = event => {
        if (Object.prototype.toString.call(progressCallback) === '[object Function]') {
            progressCallback(event);
        }
    };

    xhr.onerror = event => {
        if (Object.prototype.toString.call(errorCallback) === '[object Function]') {
            errorCallback(event, ERROR_AJAX);
        }
    };

    xhr.onload = event => {
        if ((xhr.status === 200) && (Object.prototype.toString.call(successCallback) === '[object Function]')) {
            successCallback(event, xhr.response);
        }
    };

    xhr.open('GET', url, true);
    xhr.responseType = /text|arraybuffer|blob|document|json/.test(String(type).toLowerCase()) ? String(type).toLowerCase() : 'arraybuffer';
    xhr.send(null);
}

/**
 * This class (static) method calculates minutes and seconds from the designated time in seconds.
 * @param {number} time This argument is the time in seconds.
 * @return {object} This is returned as associative array that contains `minutes`, `seconds` and `milliseconds` keys.
 */
export function convertTime(time) {
    const t = parseFloat(time);

    if (t >= 0) {
        const m  = Math.floor(t / 60);
        const s  = Math.floor(t % 60);
        const ms = t - parseInt(t, 10);

        return {
            'minutes'      : m,
            'seconds'      : s,
            'milliseconds' : ms
        };
    }
}

/**
 * This class (static) method creates the instance of `AudioBuffer` from `ArrayBuffer`.
 * @param {AudioContext} context This argument is the instance of `AudioContext` for `decodeAudioData` method.
 * @param {ArrayBuffer} arrayBuffer This argument is converted to the instance of `AudioBuffer`.
 * @param {function} successCallback This argument is invoked when `decodeAudioData` method is successful.
       The 1st argument in this callback function is the instance of `AudioBuffer`.
 * @param {function} errorCallback This argument is invoked when `decodeAudioData` method failed.
 * @return {Promise} This is returned as `Promise`.
 */
export function decode(context, arrayBuffer, successCallback, errorCallback) {
    if (!(context instanceof AudioContext)) {
        return;
    }

    if (!(arrayBuffer instanceof ArrayBuffer)) {
        return;
    }

    if (Object.prototype.toString.call(successCallback) !== '[object Function]') {
        successCallback = () => {};
    }

    if (Object.prototype.toString.call(errorCallback) !== '[object Function]') {
        errorCallback = () => {};
    }

    return context.decodeAudioData(arrayBuffer, successCallback, errorCallback);
}

/**
 * This class (static) method shows `Element` in original size from full screen.
 * @return {Promise} This is returned as `Promise`.
 */
export function exitFullscreen() {
    if (document.exitFullscreen) {
        return document.exitFullscreen();
    }

    if (document.webkitCancelFullScreen) {
        return document.webkitCancelFullScreen();
    }

    if (document.mozCancelFullScreen) {
        return document.mozCancelFullScreen();
    }

    if (document.msExitFullscreen) {
        return document.msExitFullscreen();
    }

    if (document.cancelFullScreen) {
        return document.cancelFullScreen();
    }

    return Promise.reject('Cannot exit from full screen.');
}

/**
 * This class (static) method gets the instance of `File` (extends `Blob`).
 * @param {Event} event This argument is the instance of Event by Drag & Drop or `<input type="file">`.
 * @param {string} type This argument is one of 'ArrayBuffer', 'DataURL', 'ObjectURL', 'Text'.
 * @param {function} successCallback This argument is invoked as next process when reading file is successful.
 * @param {function} errorCallback This argument is invoked when reading file failed.
 * @param {function} progressCallback This argument is invoked as `onprogress` event handler in the instance of `FileReader`.
 * @return {File|ObjectURL} This is returned as the instance of `File` (extends `Blob`) or Object URL.
 */
export function file(event, type, successCallback, errorCallback, progressCallback) {
    // The argument is associative array ?
    if (Object.prototype.toString.call(arguments[0]) === '[object Object]') {
        const properties = arguments[0];

        if ('event' in properties) {
            event = properties.event;
        }

        if ('type' in properties) {
            type = properties.type;
        }

        if ('success' in properties) {
            successCallback = properties.success;
        }

        if ('error' in properties) {
            errorCallback = properties.error;
        }

        if ('progress' in properties) {
            progressCallback = properties.progress;
        }
    }

    if (!(event instanceof Event)) {
        return;
    }

    // for the instance of `File` (extends `Blob`)
    let file = null;

    if (event.type === 'drop') {
        // Drag & Drop
        event.stopPropagation();
        event.preventDefault();

        file = /* ('items' in event.dataTransfer) ? event.dataTransfer.items[0].getAsFile() : */event.dataTransfer.files[0];
    } else if ((event.type === 'change') && ('files' in event.target)) {
        // `<input type="file">`
        file = event.target.files[0];
    } else {
        return;
    }

    if (!(file instanceof File)) {
        throw new Error('Please upload file.');
    } else if ((/text/i.test(type)) && (file.type.indexOf('text') === -1)) {
        throw new Error('Please upload text file.');
    } else if ((/arraybuffer|dataurl/i.test(type)) && !/audio|video/.test(file.type)) {
        throw new Error('Please upload audio or video file.');
    } else {
        if (/objecturl/i.test(type)) {
            return window.URL.createObjectURL(file);
        }

        read({
            'file'     : file,
            'type'     : type,
            'success'  : successCallback,
            'error'    : errorCallback,
            'progress' : progressCallback
        });

        return file;
    }
}

/**
 * This class (static) method reads file of audio or text.
 * @param {Blob} file This argument is the instance of `Blob`. This is entity of file.
 * @param {string} type This argument is one of 'ArrayBuffer', 'DataURL', 'Text'.
 * @param {function} successCallback This argument is invoked as next process when reading file is successful.
 * @param {function} errorCallback This argument is invoked when reading file failed.
 * @param {function} progressCallback This argument is invoked as `onprogress` event handler in the instance of `FileReader`.
 */
export function read(file, type, successCallback, errorCallback, progressCallback) {
    // The argument is associative array ?
    if (Object.prototype.toString.call(arguments[0]) === '[object Object]') {
        const properties = arguments[0];

        if ('file' in properties) {
            file = properties.file;
        }

        if ('type' in properties) {
            type = properties.type;
        }

        if ('success' in properties) {
            successCallback = properties.success;
        }

        if ('error' in properties) {
            errorCallback = properties.error;
        }

        if ('progress' in properties) {
            progressCallback = properties.progress;
        }
    }

    if (!(file instanceof Blob)) {
        if (Object.prototype.toString.call(errorCallback) === '[object Function]') {
            errorCallback(null, 'FILE_IS_NOT_BLOB');
        }

        return;
    }

    const reader = new FileReader();

    reader.onprogress = event => {
        if (Object.prototype.toString.call(progressCallback) === '[object Function]') {
            progressCallback(event);
        }
    };

    reader.onerror = event => {
        if (Object.prototype.toString.call(errorCallback) === '[object Function]') {
            let error = '';

            switch (reader.error.code) {
                case reader.error.NOT_FOUND_ERR:
                    error = 'NOT_FOUND_ERR';
                    break;
                case reader.error.SECURITY_ERR:
                    error = 'SECURITY_ERR';
                    break;
                case reader.error.ABORT_ERR:
                    error = 'ABORT_ERR';
                    break;
                case reader.error.NOT_READABLE_ERR:
                    error = 'NOT_READABLE_ERR';
                    break;
                case reader.error.ENCODING_ERR:
                    error = 'ENCODING_ERR';
                    break;
                default:
                    error = 'ERR';
                    break;
            }

            errorCallback(event, error);
        }
    };

    reader.onload = event => {
        if (Object.prototype.toString.call(successCallback) === '[object Function]') {
            let result = reader.result;

            // Escape `<script>` in the case of text
            if ((typeof result === 'string') && (result.indexOf('data:') === -1) && (result.indexOf('blob:') === -1)) {
                result = result.replace(/<(\/?script.*?)>/gi, '&lt;$1&gt;');
            }

            successCallback(event, result);
        }
    };

    if (/arraybuffer/i.test(type)) {
        reader.readAsArrayBuffer(file);
    } else if (/dataurl/i.test(type)) {
        reader.readAsDataURL(file);
    } else if (/text/i.test(type)) {
        reader.readAsText(file, 'UTF-8');
    }
}

/**
 * This class (static) method shows the designated `Element` in full screen.
 * @param {Element} element This argument is the instance of `Element` that is the target of full screen.
 * @return {Promise} This is returned as `Promise`.
 */
export function requestFullscreen(element) {
    if (!(element instanceof Element)) {
        return Promise.reject('Invalid argument.');
    }

    if (element.requestFullscreen) {
        return element.requestFullscreen();
    }

    if (element.webkitRequestFullscreen) {
        return element.webkitRequestFullscreen();
    }

    if (element.mozRequestFullScreen) {
        return element.mozRequestFullScreen();
    }

    if (element.msRequestFullscreen) {
        return element.msRequestFullscreen();
    }

    return Promise.reject('Cannot change to full screen.');
}

/**
 * This class (static) method calculates frequency from the index that corresponds to the 12 equal temperament.
 * @param {Array.<number>} indexes This argument is array of index that corresponds to the 12 equal temperament.
 *     For example, This value is between 0 and 88 in the case of piano.
 * @return {Array.<number>} This is returned as array that contains frequencies.
 */
export function toFrequencies(indexes) {
    // The 12 equal temperament
    //
    // Min -> 27.5 Hz (A), Max -> 4186 Hz (C)
    //
    // A * 1.059463 -> A# (half up)

    const FREQUENCY_RATIO = Math.pow(2, (1 / 12));  // about 1.059463
    const MIN_A           = 27.5;

    if (!Array.isArray(indexes)) {
        indexes = [indexes];
    }

    const frequencies = new Array(indexes.length);

    for (let i = 0, len = indexes.length; i < len; i++) {
        const index = parseInt(indexes[i], 10);

        frequencies[i] = (index >= 0) ? (MIN_A * Math.pow(FREQUENCY_RATIO, index)) : 0;
    }

    return frequencies;
}

/**
 * This class (static) method creates text file.
 * @param {string} text This argument is string.
 * @return {string} This is returned as text file.
 */
export function toTextFile(text) {
    /**
     * This function converts string to ASCII string.
     * @param {string} string This argument is string.
     * @return {string} This is returned as string that is converted to ASCII string.
     */
    const toAscii = string => {
        let converted = '';

        for (let i = 0, len = string.length; i < len; i++) {
            const charCode = string.charCodeAt(i);

            if (charCode > 0xFF) {
                converted += `&#${charCode};`;
            } else {
                converted += string.charAt(i);
            }
        }

        return converted;
    };

    const base64  = window.btoa(toAscii(String(text)));
    const dataURL = `data:text/plain;base64,${base64}`;

    return dataURL;
}
