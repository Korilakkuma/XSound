const canvas = document.querySelector('canvas');

X.requestFullscreen(canvas);

document.onkeydown = (event) => {
  if ((event.key === 'Escape') || (event.keyCode === 27)) {
    X.exitFullscreen();
  }
};
