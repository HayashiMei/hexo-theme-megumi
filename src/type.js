const gsap = require('gsap');
const TweenLite = gsap.TweenLite;

const animatedText = document.getElementById('animate');
const guideText = document.getElementById('guide');

const guideSpans = guideText.getElementsByTagName('span');
const animatedSpans = animatedText.getElementsByTagName('span');

const textLength = guideSpans.length;

const placeSpans = () => {
  // for each span in the guide
  for (let i = 0; i < textLength; i++) {
    const guide = guideSpans[i];
    const animated = animatedSpans[i];
    // get the guide client rect
    const rect = guide.getBoundingClientRect();
    // set the left property of the animate
    // span to rect.left
    animated.style.left = rect.left + 'px';
  }
};

const animateLetterIn = i => {
  setTimeout(() => {
    TweenLite.fromTo(
      animatedSpans[i],
      0.4,
      {
        opacity: 0,
        y: 40,
      },
      {
        opacity: 1,
        y: 0,
        ease: Power3.easeOut,
      }
    );
    TweenLite.fromTo(
      animatedSpans[i],
      0.4,
      {
        scale: 0,
      },
      {
        scale: 1,
        ease: Back.easeOut,
      }
    );
  }, i * 200);
};

const animateIn = () => {
  for (let i = 0; i < textLength; i++) {
    animateLetterIn(i);
  }
};

// just to make sure the text will fit the window width
const resizeText = (text, fontSize) => {
  text.style.fontSize = fontSize + 'px';
  text.style.height = fontSize + 'px';
  text.style.lineHeight = fontSize + 'px';
};

const resize = () => {
  let fontSize = window.innerWidth / 9;
  if (fontSize > 130) {fontSize = 130;}
  // (fontSize * -0.5) + 'px';
  resizeText(animatedText, fontSize);
  resizeText(guideText, fontSize);
  placeSpans();
};

const checkWebpFeature = require('./check-webp.js');

const activePrallax = () => {
  const prallaxBackground = document.querySelector('.sakura-front'),
    force = 4.2;

  if (CONFIG.supportWebp) {prallaxBackground.style.backgroundImage = 'url(/images/sakura.webp)';}
  else {prallaxBackground.style.backgroundImage = 'url(/images/sakura.png)';}

  const prallax = e => {
    const cx = window.innerWidth / 2,
      cy = window.innerHeight / 2,
      dx = e.clientX - cx,
      dy = e.clientY - cy;

    TweenLite.killTweensOf([prallaxBackground]);
    TweenLite.to(prallaxBackground, 0.8, {
      x: (0.01 * dx * force) >> 0,
      y: (0.01 * dy * force) >> 0,
    });
  };

  window.addEventListener('mousemove', prallax);
};

setTimeout(() => {
  resize();
  animateIn();
  window.addEventListener('resize', resize);
  checkWebpFeature(activePrallax);
}, 100);
