(() => {
    const STORAGE_KEY = 'xsound-playground';

    const textarea = document.querySelector('textarea');

    const editor = CodeMirror.fromTextArea(textarea, {
        mode        : 'javascript',
        lineNumbers : true,
        indentUnit  : 4,
        smartIndent : true
    });

    editor.save();

    document.querySelector('[href="#run"]').addEventListener('click', (event) => {
        event.preventDefault();

        editor.save();

        const executor = new Function(textarea.value);

        executor();
    }, false);

    document.querySelector('[href="#clear"]').addEventListener('click', (event) => {
        event.preventDefault();
        editor.setValue('');
        editor.clearHistory();
    }, false);

    document.querySelector('[href="#run"]').addEventListener('dragstart', (event) => {
        event.preventDefault();
    }, false);

    document.querySelector('[href="#clear"]').addEventListener('dragstart', (event) => {
        event.preventDefault();
    }, false);

    window.addEventListener('load', () => {
        if (localStorage.getItem(STORAGE_KEY)) {
            editor.setValue('');
            editor.clearHistory();
            editor.setValue(localStorage.getItem(STORAGE_KEY));
        }
    }, true);

    window.addEventListener('unload', () => {
        editor.save();
        localStorage.setItem(STORAGE_KEY, textarea.value);
    }, true);
})();
