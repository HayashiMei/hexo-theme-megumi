const checkWebpFeature = require('./check-webp.js');

document.addEventListener('DOMContentLoaded', () => {
  // random background postion for post
  const randomPostBackground = () => {
    document.querySelectorAll('.post').forEach(post => {
      const dx = Math.floor(Math.random() * 100 - 50) + 650;
      const dy = Math.floor(Math.random() * 1200 - 600);
      post.style.backgroundPosition = `${dx}px ${dy}px`;
      if (CONFIG.supportWebp) {
        post.style.backgroundImage = 'url(/images/post-bg.webp)';
      } else {
        post.style.backgroundImage = 'url(/images/post-bg.png)';
      }
    });
  };

  checkWebpFeature(randomPostBackground);

  // load header megumi
  const headerMegumi = document.querySelector('.header-megumi');
  const brandBackgrounds = [...CONFIG.brandBackground];
  const loadHeader = () => {
    if (!brandBackgrounds.length) {
      return false;
    }
    const img = new Image();
    const imgURL = brandBackgrounds.shift();

    if (CONFIG.supportWebp) {
      img.src = imgURL + '.webp';
    } else {
      img.src = imgURL + '.jpg';
    }

    img.onload = () => {
      headerMegumi.style.backgroundImage = `url(${img.src})`;
      headerMegumi.classList.add('loaded');
      loadHeader();
    };
  };

  checkWebpFeature(loadHeader);

  // load footer megumi
  const loadFooter = () => {
    const img = new Image();
    if (CONFIG.supportWebp) {
      img.src = '/images/footer-megumi.webp';
    } else {
      img.src = '/images/footer-megumi.png';
    }
    img.onload = () => {
      const footerMegumi = document.querySelector('.footer-megumi');
      footerMegumi.style.backgroundImage = `url(${img.src})`;
      footerMegumi.classList.add('loaded');
    };
  };

  checkWebpFeature(loadFooter);
});
