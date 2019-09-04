function getAttr(script, attr, default_val) {
  return Number(script.getAttribute(attr)) || default_val;
}

const ribbon = document.getElementById('ribbon');
const config = {
  zIndex: getAttr(ribbon, 'zIndex', -1),
  alpha: getAttr(ribbon, 'alpha', 0.6),
  ribbon_width: getAttr(ribbon, 'size', 90),
};

const canvas = document.createElement('canvas');
canvas.style.cssText =
  'width: 100%; position: fixed; top: 0; left: 0; z-index: ' + config.zIndex;
canvas.className = 'evanyou';
document.getElementsByTagName('body')[0].appendChild(canvas);

const ctx = canvas.getContext('2d');
const dpr = window.devicePixelRatio || 1,
  width = window.innerWidth,
  height = window.innerHeight,
  RIBBON_WIDTH = config.ribbon_width,
  math = Math,
  PI_2 = math.PI * 2,
  cos = math.cos,
  random = math.random;

let path,
  r = 0;

canvas.width = width * dpr;
canvas.height = height * dpr;
ctx.scale(dpr, dpr);
ctx.globalAlpha = config.alpha;

function evanyou() {
  ctx.clearRect(0, 0, width, height);
  path = [
    {
      x: 0,
      y: height * 0.7 + RIBBON_WIDTH,
    },
    {
      x: 0,
      y: height * 0.7 - RIBBON_WIDTH,
    },
  ];

  while (path[1].x < width + RIBBON_WIDTH) {
    draw(path[0], path[1]);
  }
}

function draw(i, j) {
  ctx.beginPath();
  ctx.moveTo(i.x, i.y);
  ctx.lineTo(j.x, j.y);
  const nextX = j.x + (random() * 2 - 0.25) * RIBBON_WIDTH,
    nextY = geneY(j.y);
  ctx.lineTo(nextX, nextY);
  ctx.closePath();

  r += PI_2 / 50;
  ctx.fillStyle =
    '#' +
    (
      ((cos(r) * 127 + 128) << 16) |
      ((cos(r + PI_2 / 3) * 127 + 128) << 8) |
      (cos(r + (PI_2 / 3) * 2) * 127 + 128)
    ).toString(16);
  ctx.fill();
  path[0] = path[1];
  path[1] = {
    x: nextX,
    y: nextY,
  };
}

function geneY(y) {
  const t = y + (random() * 2 - 1.1) * RIBBON_WIDTH;
  return t > height || t < 0 ? geneY(y) : t;
}

document.addEventListener('click', evanyou);
document.addEventListener('touchstart', evanyou);

evanyou();
