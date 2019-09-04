const sakura = () => {
  const canvas = document.getElementById('sakura');
  const ctx = canvas.getContext('2d');
  const Radian = Math.PI / 180;

  const petals = [],
    num = 15;

  let width = 800,
    height = 600,
    petalWidth = 13,
    petalHeight = 16,
    dx = 5;

  const inTroSakura = new Image();
  inTroSakura.src = '/images/intro_sakura.png';
  inTroSakura.onload = () => {
    init();
    setInterval(randomX, 3e3);
    setInterval(updatePetals, 10);
    canvas.style.opacity = '1';
  };

  const u = 1.3,
    w = 0.5,
    m = 1,
    _ = 0.5;
  const init = () => {
    for (let i = 0; i < num; i++) {
      let e = Math.random() * (u - w) + w;
      petals.push({
        posx: Math.random() * width,
        posy: Math.random() * height,
        sizew: petalWidth * e,
        sizeh: petalHeight * e,
        speedy: Math.random() * (m - _) + _,
        angle: 360 * Math.random(),
      });
    }
  };

  const updatePetals = () => {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < num; i++) {
      petals[i].posx += dx / petals[i].sizew;
      petals[i].posy += petals[i].speedy;
      i % 2 ? (petals[i].angle += 1) : (petals[i].angle -= 1);
      const v = Math.cos(petals[i].angle * Radian);
      const E = Math.sin(petals[i].angle * Radian);
      ctx.setTransform(v, E, E, v, petals[i].posx, petals[i].posy);
      ctx.drawImage(inTroSakura, 0, 0, petals[i].sizew, petals[i].sizeh);
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      if (petals[i].posy >= height) {
        petals[i].posy = -petals[i].sizeh;
        if (i > num) {
          petals.splice(i, 1);
        }
      }

      if (petals[i].posx >= width) {
        petals[i].posx = -petals[i].sizew;
        if (i > num) {
          petals.splice(i, 1);
        }
      }
    }
  };

  const b = 25,
    L = 5;

  let tid = null,
    T = 0;

  const randomX = () => {
    T = Math.random() * (b - L) + L;
    clearInterval(tid);
    tid = setInterval(() => {
      if (T != dx) {
        T > dx ? (dx += 0.01) : (dx -= 0.01);
      }
    }, 100);
  };
};

setTimeout(() => {
  sakura();
}, 500);
