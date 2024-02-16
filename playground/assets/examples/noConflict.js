const result = document.getElementById('result-text');

const $ = X.noConflict();

result.textContent = `X: ${X}\nXSound: ${XSound}\n`;

window.X = $;
