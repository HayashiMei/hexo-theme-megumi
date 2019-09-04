NexT.utils = NexT.$u = {
  /**
   * Wrap images with fancybox support.
   */
  wrapImageWithFancyBox: function () {
    $('.content img')
      .not('[hidden]')
      .not('.group-picture img, .post-gallery img')
      .each(function () {
        const $image = $(this);
        const imageTitle = $image.attr('title');
        let $imageWrapLink = $image.parent('a');

        if ($imageWrapLink.length < 1) {
          const imageLink = $image.attr('data-original')
            ? this.getAttribute('data-original')
            : this.getAttribute('src');
          $imageWrapLink = $image
            .wrap('<a data-fancybox="group" href="' + imageLink + '"></a>')
            .parent('a');
        }

        $imageWrapLink.addClass('fancybox fancybox.image');
        $imageWrapLink.attr('rel', 'group');

        if (imageTitle) {
          $imageWrapLink.append(
            '<p class="image-caption">' + imageTitle + '</p>'
          );

          // make sure img title tag will show correctly in fancybox
          $imageWrapLink.attr('title', imageTitle);
        }
      });

    $('.fancybox').fancybox({
      helpers: {
        overlay: {
          locked: false,
        },
      },
    });
  },

  lazyLoadPostsImages: function () {
    $('#posts')
      .find('img')
      .lazyload({
        // placeholder: '/images/loading.gif',
        effect: 'fadeIn',
        threshold: 0,
      });
  },

  /**
   * Tabs tag listener (without twitter bootstrap).
   */
  registerTabsTag: function () {
    const tNav = '.tabs ul.nav-tabs ';

    // Binding `nav-tabs` & `tab-content` by real time permalink changing.
    $(function () {
      $(window)
        .bind('hashchange', function () {
          const tHash = location.hash;
          if (tHash !== '') {
            $(tNav + 'li:has(a[href="' + tHash + '"])')
              .addClass('active')
              .siblings()
              .removeClass('active');
            $(tHash)
              .addClass('active')
              .siblings()
              .removeClass('active');
          }
        })
        .trigger('hashchange');
    });

    $(tNav + '.tab').on('click', function (href) {
      href.preventDefault();
      // Prevent selected tab to select again.
      if (!$(this).hasClass('active')) {
        // Add & Remove active class on `nav-tabs` & `tab-content`.
        $(this)
          .addClass('active')
          .siblings()
          .removeClass('active');
        const tActive = $(this)
          .find('a')
          .attr('href');
        $(tActive)
          .addClass('active')
          .siblings()
          .removeClass('active');

        // Clear location hash in browser if #permalink exists.
        if (location.hash !== '') {
          history.pushState(
            '',
            document.title,
            window.location.pathname + window.location.search
          );
        }
      }
    });
  },

  registerESCKeyEvent: function () {
    $(document).on('keyup', function (event) {
      const shouldDismissSearchPopup =
        event.which === 27 && $('.search-popup').is(':visible');
      if (shouldDismissSearchPopup) {
        $('.search-popup').hide();
        $('.search-popup-overlay').remove();
        $('body').css('overflow', '');
      }
    });
  },

  registerBackToTop: function () {
    const THRESHOLD = 690 - 52;
    const $top = $('.back-to-top');

    $top.toggleClass('back-to-top-on', window.pageYOffset > THRESHOLD);

    // var setBackToTopPostion = function () {
    //   var offsetLeft = $('.content-wrap').offset().left;
    //   var targetWidth = $('.content-wrap').width();
    //   var documentWidth = $(document).width();
    //   var b2tOffsetRight = offsetLeft + targetWidth;
    //   $('.back-to-top').offset({
    //     left: offsetLeft + targetWidth - 25
    //   })
    // };

    // setBackToTopPostion();

    $(window).on('scroll', function () {
      $top.toggleClass('back-to-top-on', window.pageYOffset > THRESHOLD);

      const scrollTop = $(window).scrollTop();
      const contentVisibilityHeight = NexT.utils.getContentVisibilityHeight();
      const scrollPercent = scrollTop / contentVisibilityHeight;
      const scrollPercentRounded = Math.round(scrollPercent * 100);
      const scrollPercentMaxed =
        scrollPercentRounded > 100 ? 100 : scrollPercentRounded;
      $('#scrollpercent>span').html(scrollPercentMaxed);
    });
    // .on('resize', setBackToTopPostion);

    $top.on('click', function () {
      $('body').velocity('scroll');
    });
  },

  /**
   * Transform embedded video to support responsive layout.
   * @see http://toddmotto.com/fluid-and-responsive-youtube-and-vimeo-videos-with-fluidvids-js/
   */
  embeddedVideoTransformer: function () {
    const $iframes = $('iframe');

    // Supported Players. Extend this if you need more players.
    const SUPPORTED_PLAYERS = [
      'www.youtube.com',
      'player.vimeo.com',
      'player.youku.com',
      'music.163.com',
      'www.tudou.com',
    ];
    const pattern = new RegExp(SUPPORTED_PLAYERS.join('|'));

    $iframes.each(function () {
      const iframe = this;
      const $iframe = $(this);
      const oldDimension = getDimension($iframe);
      let newDimension;

      if (this.src.search(pattern) > 0) {
        // Calculate the video ratio based on the iframe's w/h dimensions
        const videoRatio = getAspectRadio(
          oldDimension.width,
          oldDimension.height
        );

        // Replace the iframe's dimensions and position the iframe absolute
        // This is the trick to emulate the video ratio
        $iframe
          .width('100%')
          .height('100%')
          .css({
            position: 'absolute',
            top: '0',
            left: '0',
          });

        // Wrap the iframe in a new <div> which uses a dynamically fetched padding-top property
        // based on the video's w/h dimensions
        const wrap = document.createElement('div');
        wrap.className = 'fluid-vids';
        wrap.style.position = 'relative';
        wrap.style.marginBottom = '20px';
        wrap.style.width = '100%';
        wrap.style.paddingTop = videoRatio + '%';
        // Fix for appear inside tabs tag.
        wrap.style.paddingTop === '' && (wrap.style.paddingTop = '50%');

        // Add the iframe inside our newly created <div>
        const iframeParent = iframe.parentNode;
        iframeParent.insertBefore(wrap, iframe);
        wrap.appendChild(iframe);

        // Additional adjustments for 163 Music
        if (this.src.search('music.163.com') > 0) {
          newDimension = getDimension($iframe);
          const shouldRecalculateAspect =
            newDimension.width > oldDimension.width ||
            newDimension.height < oldDimension.height;

          // 163 Music Player has a fixed height, so we need to reset the aspect radio
          if (shouldRecalculateAspect) {
            wrap.style.paddingTop =
              getAspectRadio(newDimension.width, oldDimension.height) + '%';
          }
        }
      }
    });

    function getDimension($element) {
      return {
        width: $element.width(),
        height: $element.height(),
      };
    }

    function getAspectRadio(width, height) {
      return (height / width) * 100;
    }
  },

  hasMobileUA: function () {
    const nav = window.navigator;
    const ua = nav.userAgent;
    const pa = /iPad|iPhone|Android|Opera Mini|BlackBerry|webOS|UCWEB|Blazer|PSP|IEMobile|Symbian/g;

    return pa.test(ua);
  },

  isTablet: function () {
    return (
      window.screen.width < 992 &&
      window.screen.width > 767 &&
      this.hasMobileUA()
    );
  },

  isMobile: function () {
    return window.screen.width < 767 && this.hasMobileUA();
  },

  isDesktop: function () {
    return !this.isTablet() && !this.isMobile();
  },

  /**
   * Escape meta symbols in jQuery selectors.
   *
   * @param selector
   * @returns {string|void|XML|*}
   */
  escapeSelector: function (selector) {
    return selector.replace(/[!"$%&'()*+,./:;<=>?@[\\\]^`{|}~]/g, '\\$&');
  },

  displaySidebar: function () {
    if (!this.isDesktop() || this.isPisces() || this.isGemini()) {
      return;
    }
    $('.sidebar-toggle').trigger('click');
  },

  isMist: function () {
    return CONFIG.scheme === 'Mist';
  },

  isPisces: function () {
    return CONFIG.scheme === 'Pisces';
  },

  isGemini: function () {
    return CONFIG.scheme === 'Gemini';
  },

  getScrollbarWidth: function () {
    const $div = $('<div />')
      .addClass('scrollbar-measure')
      .prependTo('body');
    const div = $div[0];
    const scrollbarWidth = div.offsetWidth - div.clientWidth;

    $div.remove();

    return scrollbarWidth;
  },

  getContentVisibilityHeight: function () {
    const docHeight = $('#content').height(),
      winHeight = $(window).height(),
      contentVisibilityHeight =
        docHeight > winHeight
          ? docHeight - winHeight
          : $(document).height() - winHeight;
    return contentVisibilityHeight;
  },

  getSidebarb2tHeight: function () {
    // var sidebarb2tHeight = (CONFIG.sidebar.b2t) ? document.getElementsByClassName('back-to-top')[0].clientHeight : 0;
    const sidebarb2tHeight = CONFIG.sidebar.b2t
      ? $('.back-to-top').height()
      : 0;
    // var sidebarb2tHeight = (CONFIG.sidebar.b2t) ? 24 : 0;
    return sidebarb2tHeight;
  },

  getSidebarSchemePadding: function () {
    const sidebarNavHeight =
        $('.sidebar-nav').css('display') === 'block'
          ? $('.sidebar-nav').outerHeight(true)
          : 0,
      sidebarInner = $('.sidebar-inner'),
      sidebarPadding = sidebarInner.innerWidth() - sidebarInner.width(),
      sidebarSchemePadding =
        this.isPisces() || this.isGemini()
          ? sidebarPadding * 2 +
            sidebarNavHeight +
            CONFIG.sidebar.offset * 2 +
            this.getSidebarb2tHeight()
          : sidebarPadding * 2 + sidebarNavHeight / 2;
    return sidebarSchemePadding;
  },

  /**
   * Affix behaviour for Sidebar.
   *
   * @returns {Boolean}
   */
  //  needAffix: function () {
  //    return this.isPisces() || this.isGemini();
  //  }
};

$(document).ready(function () {
  initSidebarDimension();

  /**
   * Init Sidebar & TOC inner dimensions on all pages and for all schemes.
   * Need for Sidebar/TOC inner scrolling if content taller then viewport.
   */
  function initSidebarDimension() {
    let updateSidebarHeightTimer;

    $(window).on('resize', function () {
      updateSidebarHeightTimer && clearTimeout(updateSidebarHeightTimer);

      updateSidebarHeightTimer = setTimeout(function () {
        const sidebarWrapperHeight =
          document.body.clientHeight - NexT.utils.getSidebarSchemePadding();

        updateSidebarHeight(sidebarWrapperHeight);
      }, 0);
    });

    // Initialize Sidebar & TOC Width.
    const scrollbarWidth = NexT.utils.getScrollbarWidth();
    if (
      $('.site-overview-wrap').height() >
      document.body.clientHeight - NexT.utils.getSidebarSchemePadding()
    ) {
      $('.site-overview').css('width', 'calc(100% + ' + scrollbarWidth + 'px)');
    }
    if (
      $('.post-toc-wrap').height() >
      document.body.clientHeight - NexT.utils.getSidebarSchemePadding()
    ) {
      $('.post-toc').css('width', 'calc(100% + ' + scrollbarWidth + 'px)');
    }

    // Initialize Sidebar & TOC Height.
    updateSidebarHeight(
      document.body.clientHeight - NexT.utils.getSidebarSchemePadding()
    );
  }

  function updateSidebarHeight(height) {
    height = height || 'auto';
    $('.site-overview, .post-toc').css('max-height', height);
  }
});
