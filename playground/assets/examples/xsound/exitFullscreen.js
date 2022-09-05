const canvas = document.querySelector('canvas');

requestFullscreen(canvas);

document.onkeydown = (event) => {
  if ((event.key === 'Escape') || (event.keyCode === 27)) {
    exitFullscreen();
  }
};
