const result = document.getElementById('result-text');

const textFile = X.toTextFile('abcABCあいうえお');

const a = document.createElement('a');

a.textContent = 'Download';
a.download    = `${Date.now()}.txt`;
a.href        = textFile;

result.appendChild(a);
