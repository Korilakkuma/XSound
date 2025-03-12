const svg = document.getElementById('visualizer-svg');

X.requestFullscreen(svg);

document.onkeydown = (event) => {
  if ((event.key === 'Escape') || (event.keyCode === 27)) {
    X.exitFullscreen();
  }
};
