(() => {
  const STORAGE_KEY = 'xsound-playground';

  const result     = document.getElementById('result-text');
  const codeEditor = document.getElementById('textarea-codemirror');
  const ui         = document.getElementById('ui');

  const editor = CodeMirror.fromTextArea(codeEditor, {
    mode       : 'javascript',
    lineNumbers: true,
    indentUnit : 2,
    smartIndent: true
  });

  editor.save();

  document.getElementById('button-run').addEventListener('click', (event) => {
    editor.save();

    const executor = new Function(codeEditor.value);

    executor();

    if (ui.hasAttribute('hidden')) {
      ui.removeAttribute('hidden');
    }
  }, false);

  document.getElementById('select-code').addEventListener('change', (event) => {
    const path = event.currentTarget.value;

    result.innerHTML = '';

    editor.setValue('\'Loading ...\';');

    fetch(`./assets/examples/${path}.js`)
      .then((res) => {
        return res.text();
      })
      .then((text) => {
        editor.setValue(text.trim());
      });
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

  document.getElementById('select-module').addEventListener('change', (event) => {
    const select = event.currentTarget;
    const path   = select.value;

    const textarea = document.getElementById('textarea-param-json');

    textarea.value = 'Loading ...';

    fetch(`./assets/params/${path}.json`)
      .then((res) => {
        return res.text();
      })
      .then((text) => {
        textarea.value = text.trim();
      });
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
    localStorage.setItem(STORAGE_KEY, codeEditor.value);
  }, true);
})();
