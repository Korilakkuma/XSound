const result = document.getElementById('result-text');

const dropArea = document.getElementById('button-uploader');

dropArea.ondragenter = (event) => {
  dropArea.textContent = 'Drop';
};

dropArea.ondragover = (event) => {
  event.preventDefault();
};

dropArea.ondragleave = (event) => {
  dropArea.textContent = 'Upload';
};

dropArea.ondrop = (event) => {
  event.preventDefault();

  dropArea.textContent = 'Upload';

  const file = X.drop({
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

  if (file === null) {
    result.textContent = 'There is not dropped file';
  }
};
