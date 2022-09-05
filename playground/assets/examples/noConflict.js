const result = document.getElementById('result-text');

const $ = noConflict();

result.innerHTML = `
  <ul>
    <li>X: ${X}</li>
    <li>XSound: ${XSound}</li>
  </ul>
`;

window.X = $;
