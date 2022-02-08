const result = document.getElementById('result-text');

const uploader = document.querySelector('input[type="file"]');

document.getElementById('button-uploader').onclick = () => {
  uploader.click();
};

uploader.onchange = (event) => {
  const file = X.file({
    event           : event,
    type            : 'arraybuffer',
    successCallback : (event, arraybuffer) => {
      result.innerHTML = `
        <ul>
          <li>${file.name}</li>
          <li>${file.type}</li>
          <li>${file.size}</li>
        </ul>
      `;
    },
    errorCallback   : (event, textStatus) => {
      result.textContent = textStatus;
    },
    progressCallback: (event) => {
      if (event.lengthComputable && (event.total > 0)) {
        result.textContent = `${Math.trunc(event.loaded / event.total) * 100} %`;
      }
    }
  });

  if (file instanceof Error) {
    result.textContent = file.message;
  }
};
