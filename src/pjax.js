require('jquery-pjax');
const NProgress = require('nprogress');

NProgress.configure({
  showSpinner: false,
  easing: 'ease-out',
  speed: 1000
});

$(document).pjax('a:not(.fancybox)', '#main', {
  scrollTo: $('.header-megumi').height(),
  fragment: '#main',
  timeout: 5000,
});

$(document).on('pjax:start', function () {
  NProgress.start();
  $('html, body').animate({
    scrollTop: $('.header-megumi').height()
  }, 500);
});

$(document).on('pjax:end', function () {
  NProgress.done();
  require('./pisces')();
  CONFIG.fancybox && NexT.utils.wrapImageWithFancyBox();

  ga('set', 'location', window.location.href);
  ga('send', 'pageview');
});

const addEventToMenu = e => {
  const menu = document.querySelector('#menu');
	menu.addEventListener('click', (e) => {
    const clickMenu = e.target.parentElement;
    $(clickMenu).addClass('menu-item-active').siblings().removeClass('menu-item-active');
  });
}

$(document).ready(addEventToMenu);