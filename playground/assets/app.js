(() => {
    const STORAGE_KEY = 'xsound-playground';

    const textarea = document.querySelector('textarea');
    const ui       = document.getElementById('ui');

    const editor = CodeMirror.fromTextArea(textarea, {
        mode        : 'javascript',
        lineNumbers : true,
        indentUnit  : 4,
        smartIndent : true
    });

    editor.save();

    document.getElementById('button-run').addEventListener('click', (event) => {
        editor.save();

        const executor = new Function(textarea.value);

        executor();

        if (ui.hasAttribute('hidden')) {
            ui.removeAttribute('hidden');
        }
    }, false);

    document.getElementById('button-clear').addEventListener('click', (event) => {
        editor.setValue('');
        editor.clearHistory();
    }, false);

    document.getElementById('button-run').addEventListener('dragstart', (event) => {
        event.preventDefault();
    }, false);

    document.getElementById('button-clear').addEventListener('dragstart', (event) => {
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
