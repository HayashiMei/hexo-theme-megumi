document.addEventListener('DOMContentLoaded', () => {
  // random background postion for post
  document.querySelectorAll('.post').forEach((post, index) => {
    let dx = Math.floor(Math.random() * 100 - 50) + 650;
    let dy = Math.floor(Math.random() * 1200 - 600);
    post.style.backgroundPosition = `${dx}px ${dy}px`
  })

  // load header megumi
  const headerMegumi = document.querySelector('.header-megumi');
  const brandBackgrounds = [...CONFIG.brandBackground];
  const changeImage = () => {
    if (!brandBackgrounds.length) return false;
    const img = new Image;
    const imgURL = brandBackgrounds.shift();
    img.src = imgURL;
    img.onload = () => {
      headerMegumi.style.backgroundImage = `url(${imgURL})`;
      headerMegumi.classList.add('loaded');
      changeImage();
    }
  }

  changeImage();

  // load footer megumi
  const footerImg = new Image;
  footerImg.src = '/images/footer-megumi.png';
  footerImg.onload = () => {
    const footerMegumi = document.querySelector('.footer-megumi');
    footerMegumi.classList.add('loaded');
  }
})
