const STORAGE_KEY = 'xsound-playground';

const codeEditorContainerElement = document.getElementById('code-editor-container');

const resultElement = document.getElementById('result-text');
const uiElement     = document.getElementById('ui');

require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@latest/min/vs' } });
require(['vs/editor/editor.main'], async () => {
  const defaultValue = `X('oscillator').setup([true, true, false, false]);

document.getElementById('button-start').onclick = () => {
  X('oscillator').start([440, 880]);
};

document.getElementById('button-stop').onclick = () => {
  X('oscillator').stop();
};`;

  const editor = monaco.editor.create(codeEditorContainerElement, {
    value: defaultValue,
    language: 'javascript',
    automaticLayout: true,
    theme: 'vs-dark'
  });

  document.getElementById('button-run').addEventListener('click', (event) => {
    const executor = new Function(editor.getValue());

    executor();

    if (uiElement.hasAttribute('hidden')) {
      uiElement.removeAttribute('hidden');
    }

    document.getElementById('button-stop').click();
  });

  document.getElementById('select-code').addEventListener('change', (event) => {
    const path = event.currentTarget.value;

    resultElement.innerHTML = '';

    editor.setValue('\'Loading ...\';');

    fetch(`./assets/examples/${path}.js`)
      .then((res) => {
        return res.text();
      })
      .then((text) => {
        editor.setValue(text.trim());
     });
  });

  document.getElementById('button-clear').addEventListener('click', (event) => {
    editor.setValue('');
  });

  document.getElementById('button-run').addEventListener('dragstart', (event) => {
    event.preventDefault();
  });

  document.getElementById('button-clear').addEventListener('dragstart', (event) => {
    event.preventDefault();
  });

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
  });

  window.addEventListener('load', () => {
    if (localStorage.getItem(STORAGE_KEY)) {
      editor.setValue(localStorage.getItem(STORAGE_KEY));
    }
  }, true);

  window.addEventListener('unload', () => {
    localStorage.setItem(STORAGE_KEY, editor.getValue())
  }, true);
});
